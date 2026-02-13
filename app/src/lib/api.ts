import type { Screenshot, ScreenshotRequest, Settings, BrowserInfo, Stats } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(response.status, error.detail || error.message || 'Unknown error');
  }

  return response.json();
}

export const api = {
  // Screenshots
  createScreenshot: (data: ScreenshotRequest) =>
    fetchApi<Screenshot>('/api/screenshot', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createScreenshotAsync: (data: ScreenshotRequest) =>
    fetchApi<{ id: string; message: string; status: string; check_status: string }>('/api/screenshot/async', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getScreenshotStatus: (id: string) =>
    fetchApi<Screenshot>(`/api/screenshot/${id}/status`),

  downloadScreenshot: (id: string) =>
    fetch(`${API_BASE_URL}/api/screenshot/${id}/download`),

  previewScreenshot: (id: string) =>
    fetchApi<{ id: string; image: string; filename: string }>(`/api/screenshot/${id}/preview`),

  // History
  getHistory: (params?: { limit?: number; offset?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.status) searchParams.append('status', params.status);
    return fetchApi<{ total: number; limit: number; offset: number; screenshots: Screenshot[] }>(
      `/api/history?${searchParams.toString()}`
    );
  },

  deleteScreenshot: (id: string) =>
    fetchApi<{ message: string }>(`/api/history/${id}`, {
      method: 'DELETE',
    }),

  // Settings
  getSettings: () =>
    fetchApi<{ settings: Settings }>('/api/settings'),

  updateSettings: (settings: Partial<Settings>) =>
    fetchApi<{ settings: Settings; message: string }>('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),

  resetSettings: () =>
    fetchApi<{ settings: Settings; message: string }>('/api/settings/reset', {
      method: 'POST',
    }),

  // Browsers
  getBrowsers: () =>
    fetchApi<{ browsers: BrowserInfo[] }>('/api/browsers'),

  // Stats
  getStats: () =>
    fetchApi<Stats>('/api/stats'),

  // Health
  healthCheck: () =>
    fetchApi<{ status: string; timestamp: string }>('/health'),
};