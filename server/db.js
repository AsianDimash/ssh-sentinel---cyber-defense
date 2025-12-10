import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

export async function initDb() {
  const db = await openDb();

  // Create Incidents Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      ip TEXT,
      attempts INTEGER,
      firstAttempt TEXT,
      lastAttempt TEXT,
      country TEXT,
      status TEXT,
      isp TEXT,
      threatScore INTEGER,
      usernames TEXT
    )
  `);

  // Create Logs Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT,
      ip TEXT,
      user TEXT,
      message TEXT,
      severity TEXT,
      country TEXT
    )
  `);

  // Create BlockRules Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS blocks (
      id TEXT PRIMARY KEY,
      ip TEXT,
      reason TEXT,
      timestamp TEXT,
      duration TEXT,
      type TEXT
    )
  `);

  // Create Users Table (for login)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // Seed Data if empty
  const incidentCount = await db.get('SELECT count(*) as count FROM incidents');
  if (incidentCount.count === 0) {
    const today = new Date().toISOString().split('T')[0];
    await db.run(`
      INSERT INTO incidents (id, ip, attempts, firstAttempt, lastAttempt, country, status, isp, threatScore, usernames)
      VALUES 
      ('1', '192.168.1.100', 7, '${today}T14:20:00.000Z', '${today}T14:23:15.000Z', 'KZ', 'BLOCKED', 'Kazakhtelecom', 85, '["root", "admin"]'),
      ('2', '203.0.113.45', 5, '${today}T14:15:00.000Z', '${today}T14:18:42.000Z', 'RU', 'WATCHING', 'Rostelecom', 45, '["user", "test"]'),
      ('3', '198.51.100.23', 12, '${today}T14:00:00.000Z', '${today}T14:10:05.000Z', 'CN', 'BLOCKED', 'China Unicom', 92, '["root"]')
    `);
  }

  const blockCount = await db.get('SELECT count(*) as count FROM blocks');
  if (blockCount.count === 0) {
    const today = new Date().toISOString().split('T')[0];
    await db.run(`
      INSERT INTO blocks (id, ip, reason, timestamp, duration, type)
      VALUES
      ('b1', '192.168.1.100', 'Brute-force (7 attempts)', '${today}T14:23:15.000Z', '24h', 'AUTO'),
      ('b2', '198.51.100.23', 'Known Botnet', '${today}T14:10:05.000Z', 'Permanent', 'MANUAL')
    `);
  }

  const userCount = await db.get('SELECT count(*) as count FROM users');
  if (userCount.count === 0) {
    // Default admin user. Password should be hashed in production, but plain text for this demo as requested.
    await db.run(`INSERT INTO users (username, password) VALUES ('admin', 'password')`);
  }

  console.log('Database initialized');
}
