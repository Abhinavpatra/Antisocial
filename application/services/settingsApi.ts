import { apiFetch } from '@/utils/backend';

export type UserSettings = {
  user_id: string;
  theme_mode: 'system' | 'light' | 'dark';
  palette: 'a' | 'b' | 'c' | 'd';
  hide_all_usage: boolean;
  app_visibility: Record<string, boolean>;
  created_at: string;
  updated_at: string;
};

export async function getSettings(params: { userId: string }) {
  return await apiFetch<{ settings: UserSettings | null }>('/api/settings', { userId: params.userId });
}

export async function patchSettings(params: {
  userId: string;
  patch: Partial<Pick<UserSettings, 'theme_mode' | 'palette' | 'hide_all_usage' | 'app_visibility'>>;
}) {
  return await apiFetch<{ settings: UserSettings }>('/api/settings', {
    method: 'PATCH',
    userId: params.userId,
    body: params.patch,
  });
}

