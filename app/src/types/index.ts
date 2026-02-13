export interface Screenshot {
  id: string;
  url: string;
  filename: string;
  filepath: string;
  browser: string;
  width: number;
  height: number;
  full_page: boolean;
  timestamp: string;
  file_size: number;
  status: 'completed' | 'failed' | 'pending';
  error?: string;
}

export interface ScreenshotRequest {
  url: string;
  browser?: string;
  window_width?: number;
  window_height?: number;
  full_page?: boolean;
  delay?: number;
  dark_mode?: boolean;
  selector?: string;
  custom_name?: string;
}

export interface Settings {
  browser: string;
  window_width: number;
  window_height: number;
  full_page: boolean;
  delay: number;
  dark_mode: boolean;
  user_agent: string;
  headless: boolean;
  javascript_enabled: boolean;
  images_enabled: boolean;
  block_ads: boolean;
}

export interface BrowserInfo {
  name: string;
  version: string;
  available: boolean;
  error?: string;
}

export interface Stats {
  total_screenshots: number;
  completed: number;
  failed: number;
  pending: number;
  total_size_bytes: number;
  total_size_mb: number;
  unique_domains: number;
  domains: string[];
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}