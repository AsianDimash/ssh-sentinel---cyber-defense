export enum Severity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export interface LogEntry {
  id: string;
  timestamp: string;
  ip: string;
  user: string;
  message: string;
  severity: Severity;
  country: string;
}

export interface Incident {
  id: string;
  ip: string;
  attempts: number;
  lastAttempt: string;
  firstAttempt: string;
  country: string;
  status: 'BLOCKED' | 'WATCHING' | 'RESOLVED';
  isp: string;
  threatScore: number;
  usernames: string[]; // Used usernames
}

export interface BlockRule {
  id: string;
  ip: string;
  reason: string;
  timestamp: string;
  duration: string;
  type: 'MANUAL' | 'AUTO';
}

export interface ChartDataPoint {
  time: string;
  attempts: number;
}
