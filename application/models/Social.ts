export type FriendRequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled';

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  createdAt: number;
}

export interface FriendRequest {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendRequestStatus;
  createdAt: number;
  respondedAt?: number;
}

export type SyncOperation = 'upsert' | 'delete';
export type SyncStatus = 'pending' | 'in_flight' | 'failed' | 'completed';

export interface SyncQueueItem {
  id: string;
  entityType: string;
  entityId: string;
  operation: SyncOperation;
  payloadJson?: string;
  status: SyncStatus;
  attempts: number;
  lastAttemptAt?: number;
  createdAt: number;
  updatedAt: number;
}
