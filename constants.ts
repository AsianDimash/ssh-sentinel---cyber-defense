import { Incident, LogEntry, Severity, BlockRule, ChartDataPoint } from './types';

export const MOCK_INCIDENTS: Incident[] = [
  { 
      id: '1', 
      ip: '192.168.1.100', 
      attempts: 7, 
      firstAttempt: '14:20:00',
      lastAttempt: '14:23:15', 
      country: 'KZ', 
      status: 'BLOCKED', 
      isp: 'Kazakhtelecom', 
      threatScore: 85,
      usernames: ['root', 'admin']
  },
  { 
      id: '2', 
      ip: '203.0.113.45', 
      attempts: 5, 
      firstAttempt: '14:15:00',
      lastAttempt: '14:18:42', 
      country: 'RU', 
      status: 'WATCHING', 
      isp: 'Rostelecom', 
      threatScore: 45,
      usernames: ['user', 'test']
  },
  { 
      id: '3', 
      ip: '198.51.100.23', 
      attempts: 12, 
      firstAttempt: '14:00:00',
      lastAttempt: '14:10:05', 
      country: 'CN', 
      status: 'BLOCKED', 
      isp: 'China Unicom', 
      threatScore: 92,
      usernames: ['root']
  },
];

export const MOCK_LOGS: LogEntry[] = []; // Starts empty, filled by simulation

export const MOCK_BLOCKS: BlockRule[] = [
  { id: 'b1', ip: '192.168.1.100', reason: 'Brute-force (7 attempts)', timestamp: '14:23:15', duration: '24h', type: 'AUTO' },
  { id: 'b2', ip: '198.51.100.23', reason: 'Known Botnet', timestamp: '14:10:05', duration: 'Permanent', type: 'MANUAL' },
];

export const CHART_DATA: ChartDataPoint[] = [
  { time: '00:00', attempts: 12 },
  { time: '04:00', attempts: 8 },
  { time: '08:00', attempts: 25 },
  { time: '12:00', attempts: 45 },
  { time: '16:00', attempts: 30 },
  { time: '20:00', attempts: 55 },
  { time: '23:59', attempts: 20 },
];
