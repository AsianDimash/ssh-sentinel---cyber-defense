import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import geoip from 'geoip-lite';
import { openDb, initDb } from './db.js';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secure-secret-key-change-in-production'; // In prod, use env var

// In-memory tracker for failed login attempts (for brute-force detection)
const failedAttempts = {};
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION_MINUTES = 10;

app.use(cors());
app.use(express.json());

// Initialize DB
initDb();

// Helper: Get client IP
const getClientIp = (req) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
    // Normalize IPv6 localhost
    if (ip === '::1') return '127.0.0.1';
    return ip;
};

// Helper: Get Country from IP
const getCountryFromIp = (ip) => {
    // Handle local/private IPs
    if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return 'Local';
    }
    const geo = geoip.lookup(ip);
    return geo ? geo.country : 'Unknown';
};

// Helper: Check if IP is blocked
const isIpBlocked = async (ip) => {
    const db = await openDb();
    // Check for active blocks (timestamp + duration > now) - Simplified for this demo as we store duration as string
    // In a real app, you'd calculate expiration. For now, we trust the existence in 'blocks' table means active.
    const block = await db.get('SELECT * FROM blocks WHERE ip = ?', [ip]);
    return !!block;
};

// Helper: Auto-block IP after too many failed attempts
const handleFailedAttempt = async (ip, username) => {
    const db = await openDb();
    const now = Date.now();

    // Initialize or update tracker
    if (!failedAttempts[ip]) {
        failedAttempts[ip] = { count: 1, firstAttempt: now, usernames: new Set([username]) };
    } else {
        failedAttempts[ip].count++;
        failedAttempts[ip].usernames.add(username);
    }

    const tracker = failedAttempts[ip];
    const country = getCountryFromIp(ip);

    // Log the failed attempt
    await db.run(
        'INSERT INTO logs (id, timestamp, ip, user, message, severity, country) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
            now.toString(),
            new Date().toISOString(),
            ip,
            username,
            `Failed password for ${username} (attempt ${tracker.count}/${MAX_FAILED_ATTEMPTS})`,
            tracker.count >= 3 ? 'CRITICAL' : 'WARNING',
            country
        ]
    );

    // Check if we need to auto-block
    if (tracker.count >= MAX_FAILED_ATTEMPTS) {
        // Check if already blocked
        const alreadyBlocked = await isIpBlocked(ip);
        if (!alreadyBlocked) {
            // Add to blocks table
            const blockId = `auto-${now}`;
            await db.run(
                'INSERT INTO blocks (id, ip, reason, timestamp, duration, type) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    blockId,
                    ip,
                    `Brute-force attack (${tracker.count} failed attempts)`,
                    new Date().toISOString(),
                    `${BLOCK_DURATION_MINUTES}m`,
                    'AUTO'
                ]
            );

            // Create incident
            const incidentId = `inc-${now}`;
            await db.run(
                'INSERT INTO incidents (id, ip, attempts, firstAttempt, lastAttempt, country, status, isp, threatScore, usernames) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    incidentId,
                    ip,
                    tracker.count,
                    new Date(tracker.firstAttempt).toISOString(),
                    new Date().toISOString(),
                    country,
                    'BLOCKED',
                    'Unknown ISP', // GeoIP might not give ISP, usually requires paid DB or different lookup
                    Math.min(50 + tracker.count * 10, 100),
                    JSON.stringify(Array.from(tracker.usernames))
                ]
            );

            // Log the block action
            await db.run(
                'INSERT INTO logs (id, timestamp, ip, user, message, severity, country) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    (now + 1).toString(),
                    new Date().toISOString(),
                    ip,
                    'SYSTEM',
                    `IP ${ip} automatically blocked due to ${tracker.count} failed login attempts`,
                    'CRITICAL',
                    country
                ]
            );

            console.log(`[SECURITY] IP ${ip} has been auto-blocked after ${tracker.count} failed attempts`);

            // Reset counter for this IP
            delete failedAttempts[ip];

            return true; // Was blocked
        }
    }

    return false; // Not blocked yet
};

// Login Endpoint with brute-force protection
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const ip = getClientIp(req);
    const db = await openDb();

    // Check if IP is already blocked
    if (await isIpBlocked(ip)) {
        const country = getCountryFromIp(ip);
        // Log blocked attempt
        await db.run(
            'INSERT INTO logs (id, timestamp, ip, user, message, severity, country) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                Date.now().toString(),
                new Date().toISOString(),
                ip,
                username || 'unknown',
                `Blocked IP ${ip} attempted login`,
                'CRITICAL',
                country || 'Unknown'
            ]
        );
        return res.status(403).json({
            success: false,
            message: 'Сіздің IP мекенжайыңыз блокталған. Әкімшіге хабарласыңыз.',
            blocked: true
        });
    }

    // Attempt login
    const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

    if (user) {
        // Reset failed attempts on successful login
        delete failedAttempts[ip];
        const country = getCountryFromIp(ip);

        // Log successful login
        await db.run(
            'INSERT INTO logs (id, timestamp, ip, user, message, severity, country) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                Date.now().toString(),
                new Date().toISOString(),
                ip,
                username,
                `Successful login for ${username}`,
                'INFO',
                country || 'Unknown'
            ]
        );

        // Generate Real JWT
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ success: true, token, user: { username: user.username } });
    } else {
        // Handle failed attempt (may trigger auto-block)
        const wasBlocked = await handleFailedAttempt(ip, username || 'unknown');

        if (wasBlocked) {
            return res.status(403).json({
                success: false,
                message: 'Тым көп қате әрекет. Сіздің IP мекенжайыңыз блокталды.',
                blocked: true
            });
        }

        const remaining = MAX_FAILED_ATTEMPTS - (failedAttempts[ip]?.count || 0);
        res.status(401).json({
            success: false,
            message: `Қате логин немесе құпиясөз. Қалған әрекеттер: ${remaining}`
        });
    }
});

// Middleware to verify JWT (optional for stats/logs if you want to protect them)
const authenticateToken = (req, res, next) => {
    // For this demo, we might skip strict auth on GETs to allow the dashboard to load even if session expires
    // But ideally:
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    // if (!token) return res.sendStatus(401);
    // jwt.verify(token, JWT_SECRET, (err, user) => {
    //     if (err) return res.sendStatus(403);
    //     req.user = user;
    //     next();
    // });
    next();
};

// Get Incidents
app.get('/api/incidents', authenticateToken, async (req, res) => {
    const db = await openDb();
    const incidents = await db.all('SELECT * FROM incidents ORDER BY id DESC');
    const parsedIncidents = incidents.map(i => ({
        ...i,
        usernames: JSON.parse(i.usernames || '[]')
    }));
    res.json(parsedIncidents);
});

// Get Logs
app.get('/api/logs', authenticateToken, async (req, res) => {
    const db = await openDb();
    const logs = await db.all('SELECT * FROM logs ORDER BY id DESC LIMIT 100');
    res.json(logs);
});

// Add Log (for simulation/frontend reporting)
app.post('/api/logs', authenticateToken, async (req, res) => {
    const { id, timestamp, ip, user, message, severity, country } = req.body;
    const db = await openDb();
    await db.run(
        'INSERT INTO logs (id, timestamp, ip, user, message, severity, country) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, timestamp, ip, user, message, severity, country]
    );
    res.json({ success: true });
});

// Get Blocks
app.get('/api/blocks', authenticateToken, async (req, res) => {
    const db = await openDb();
    const blocks = await db.all('SELECT * FROM blocks ORDER BY id DESC');
    res.json(blocks);
});

// Add Block
app.post('/api/blocks', authenticateToken, async (req, res) => {
    const { id, ip, reason, timestamp, duration, type } = req.body;
    const db = await openDb();
    try {
        await db.run(
            'INSERT INTO blocks (id, ip, reason, timestamp, duration, type) VALUES (?, ?, ?, ?, ?, ?)',
            [id, ip, reason, timestamp, duration, type]
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Remove Block
app.delete('/api/blocks/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const db = await openDb();
    await db.run('DELETE FROM blocks WHERE id = ?', [id]);
    res.json({ success: true });
});

// Dashboard Stats - REAL DATA
app.get('/api/stats', authenticateToken, async (req, res) => {
    const db = await openDb();

    // Get logs for the last 24 hours
    // SQLite doesn't have great date functions, so filtering in JS is often easier for simple charts
    // or using 'datetime' modifier if stored as ISO string.
    // We updated logs to use ISO string in handleFailedAttempt, but old logs might be localeTimeString.
    // Let's grab all logs and filter in JS to be safe with existing data mixture.

    // In a prod app, you should consistently store ISODateString.
    const allLogs = await db.all(`SELECT * FROM logs`);

    // Initialize hourly buckets (00:00 to 23:00)
    const hourlyCounts = new Array(24).fill(0);

    // Current date for comparison (to only show 'today' or 'last 24h')
    // Let's assume the chart wants a 24h distribution or distribution by hour of day (0-23)

    allLogs.forEach(log => {
        // Try to parse timestamp
        let date;
        try {
            // Check if it's ISO (e.g. 2023-10-27T...)
            if (log.timestamp.includes('T')) {
                date = new Date(log.timestamp);
            } else {
                // It might be locale string 'HH:MM:SS' from previous code
                // This is hard to parse without a date, assume it's today
                // Simple hack: if we can't parse it well, skip or count as current hour
                date = new Date(); // fallback
            }
        } catch (e) {
            date = new Date();
        }

        const hour = date.getHours();
        if (hour >= 0 && hour < 24) {
            hourlyCounts[hour]++;
        }
    });

    // Format for the frontend chart [ { time: '00:00', attempts: 5 }, ... ]
    // We will pick a few representative points or return all 24 hours. 
    // The frontend seems to expect specific intervals (4 hours).
    const chartData = [];
    const points = [0, 4, 8, 12, 16, 20];

    points.forEach(hour => {
        // Sum the 4-hour block
        let sum = 0;
        for (let i = 0; i < 4; i++) {
            sum += hourlyCounts[hour + i] || 0;
        }
        chartData.push({
            time: `${String(hour).padStart(2, '0')}:00`,
            attempts: sum
        });
    });

    res.json(chartData);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Brute-force protection: ${MAX_FAILED_ATTEMPTS} attempts before auto-block`);
});
