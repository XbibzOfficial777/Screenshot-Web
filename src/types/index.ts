export interface ScreenshotRequest {
  url: string;
  viewport_width: number;
  viewport_height: number;
  full_page: boolean;
  delay: number;
  user_agent?: string;
  dark_mode: boolean;
  format: 'png' | 'jpeg' | 'webp';
  quality: number;
  hide_elements?: string[];
  wait_for_selector?: string;
}

export interface ScreenshotResponse {
  success: boolean;
  image_base64?: string;
  filename?: string;
  timestamp: string;
  url: string;
  message: string;
  metadata?: {
    viewport: string;
    full_page: boolean;
    format: string;
    size_bytes: number;
  };
}

export interface BrowserSettings {
  default_viewport_width: number;
  default_viewport_height: number;
  default_delay: number;
  default_format: 'png' | 'jpeg' | 'webp';
  default_quality: number;
  headless: boolean;
  disable_images: boolean;
  disable_js: boolean;
  user_agent?: string;
  language: string;
  timezone: string;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface ViewportPreset {
  name: string;
  width: number;
  height: number;
}

export interface UserAgent {
  name: string;
  value: string;
}

export interface ScreenshotHistoryItem {
  filename: string;
  url: string;
  timestamp: string;
  viewport: string;
  full_page: boolean;
}

export type Tab = 'dashboard' | 'settings' | 'history';
