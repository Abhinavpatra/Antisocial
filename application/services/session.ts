import * as SecureStore from 'expo-secure-store';

import { apiFetch } from '@/utils/backend';

const USER_ID_KEY = 'timerapp.userId';
let inFlightUserId: Promise<string> | null = null;

export async function getStoredUserId() {
  try {
    return (await SecureStore.getItemAsync(USER_ID_KEY)) ?? null;
  } catch {
    return null;
  }
}

export async function setStoredUserId(userId: string) {
  try {
    await SecureStore.setItemAsync(USER_ID_KEY, userId);
  } catch {
    // ignore
  }
}

export async function getOrCreateDevUserId() {
  if (inFlightUserId) return inFlightUserId;
  inFlightUserId = (async () => {
  const existing = await getStoredUserId();
  if (existing) return existing;

  const seed = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const username = `user_${seed}`;

  const data = await apiFetch<{ userId: string }>('/api/auth/dev', {
    method: 'POST',
    body: { username, display_name: 'Alex Rivera' },
  });

  await setStoredUserId(data.userId);
  return data.userId;
  })();

  try {
    return await inFlightUserId;
  } finally {
    inFlightUserId = null;
  }
}

