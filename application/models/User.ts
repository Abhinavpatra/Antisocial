export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserPreferences {
  userId: string;
  theme: ThemePreference;
  notificationsEnabled: boolean;
  hapticEnabled: boolean;
  audioEnabled: boolean;
  privacyHiddenApps: string[]; // App IDs
  dataRetentionDays: number;
  updatedAt: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  profileImageUri?: string;
  totalCoins: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserWithPreferences extends UserProfile {
  preferences: UserPreferences;
}
