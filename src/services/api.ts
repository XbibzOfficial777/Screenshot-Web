import type { ScreenshotRequest, ScreenshotResponse, BrowserSettings, ViewportPreset, UserAgent, ScreenshotHistoryItem } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async takeScreenshot(request: ScreenshotRequest): Promise<ScreenshotResponse> {
    return this.fetch('/api/screenshot', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getSettings(): Promise<BrowserSettings> {
    return this.fetch('/api/settings');
  }

  async updateSettings(settings: BrowserSettings): Promise<{ success: boolean; message: string; settings: BrowserSettings }> {
    return this.fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  async getHistory(limit: number = 50): Promise<{ history: ScreenshotHistoryItem[]; total: number }> {
    return this.fetch(`/api/history?limit=${limit}`);
  }

  async clearHistory(): Promise<{ success: boolean; message: string }> {
    return this.fetch('/api/history', {
      method: 'DELETE',
    });
  }

  async getUserAgents(): Promise<{ user_agents: UserAgent[] }> {
    return this.fetch('/api/user-agents');
  }

  async getViewportPresets(): Promise<{ presets: ViewportPreset[] }> {
    return this.fetch('/api/viewport-presets');
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.fetch('/');
  }
}

export const api = new ApiService();
