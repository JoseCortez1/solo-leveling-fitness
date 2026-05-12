const API_BASE = import.meta.env.VITE_API_URL || '';

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export function getToken(): string | null {
  return localStorage.getItem('sl_token');
}

export function setToken(token: string): void {
  localStorage.setItem('sl_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('sl_token');
}

export function getStoredUser(): { id: string; name: string; email: string } | null {
  const raw = localStorage.getItem('sl_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: { id: string; name: string; email: string }): void {
  localStorage.setItem('sl_user', JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem('sl_user');
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.error || 'Request failed', response.status);
  }

  return data as T;
}

// Auth
export const api = {
  // Auth
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  getMe: () => request<{ id: string; name: string; email: string; created_at: string }>('/api/auth/me'),

  // Hunter
  activateHunter: (data: { name: string; str: number; sta: number; agi: number; vit: number; difficulty: string }) =>
    request('/api/hunter/activate', { method: 'POST', body: data }),

  getHunter: () => request('/api/hunter'),

  changeDifficulty: (difficulty: string) =>
    request('/api/hunter/difficulty', { method: 'PUT', body: { difficulty } }),

  // Quests
  getQuests: () => request<{ date: string; quests: any[]; questsCompleted: number }>('/api/quests'),

  updateQuestProgress: (questId: string, currentReps: number) =>
    request(`/api/quests/${questId}/progress`, { method: 'PUT', body: { currentReps } }),

  completeQuest: (questId: string) =>
    request<{ xpGained: number; xp: number; level: number; rank: string; levelUp: boolean; allCleared: boolean; allClearedBonus: number }>(
      `/api/quests/${questId}/complete`,
      { method: 'POST' }
    ),
};
