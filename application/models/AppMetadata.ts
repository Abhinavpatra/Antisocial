export interface AppMetadata {
  appId: string;
  appName: string;
  iconUri?: string;
  category?: string;
  platform: 'ios' | 'android';
  lastSeenAt?: number;
}
