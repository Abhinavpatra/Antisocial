export type BadgeType = string; // e.g., 'consistency', 'social', 'master'

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description?: string;
  iconUri?: string;
  createdAt: number;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: number;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number; // positive for earn, negative for spend/penalty
  reason: string;
  sourceType?: 'challenge' | 'reward' | 'penalty' | 'manual';
  sourceId?: string;
  balanceAfter: number;
  createdAt: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  profileImageUri?: string;
  value: number; // minutes or coins depending on context
  rank: number;
  change?: number; // relative rank change
}
