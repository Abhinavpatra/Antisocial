export type ChallengeStatus = 'pending' | 'active' | 'completed' | 'failed' | 'forfeited';

export interface Challenge {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  targetAppId: string;
  timeLimitMinutes: number;
  durationDays: number;
  status: ChallengeStatus;
  isPopular: boolean;
  coinReward: number;
  coinPenalty: number;
  startAt?: number;
  endAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  status: ChallengeStatus;
  joinedAt: number;
  completedAt?: number;
  forfeitedAt?: number;
}

export interface ChallengeWithDetails extends Challenge {
  participants: ChallengeParticipant[];
}
