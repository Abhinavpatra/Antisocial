export interface UsageSession {
  id: string;
  userId: string;
  appId: string;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  deviceId?: string;
  isHidden: boolean;
}

export interface UsageDailyAggregate {
  userId: string;
  appId: string;
  dayStart: number; // Epoch ms at 00:00:00
  totalSeconds: number;
  sessionCount: number;
  lastUsedAt?: number;
  isHidden: boolean;
}
