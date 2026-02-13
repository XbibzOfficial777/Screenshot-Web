import { useState, useEffect } from 'react';
import {
  Settings2,
  Save,
  RotateCcw,
  Globe,
  Clock,
  Monitor,
  Image as ImageIcon,
  EyeOff,
  Code,
  MapPin,
  Languages,
  Check,
  Loader2,
  Shield,
  Cpu,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/services/api';
import type { BrowserSettings } from '@/types';
import { toast } from 'sonner';

const defaultSettings: BrowserSettings = {
  default_viewport_width: 1920,
  default_viewport_height: 1080,
  default_delay: 0,
  default_format: 'png',
  default_quality: 90,
  headless: true,
  disable_images: false,
  disable_js: false,
  user_agent: '',
  language: 'en-US',
  timezone: 'UTC',
};

const languages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'id-ID', name: 'Indonesian' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'de-DE', name: 'German' },
  { code: 'fr-FR', name: 'French' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'ar-SA', name: 'Arabic' },
  { code: 'hi-IN', name: 'Hindi' },
];

const timezones = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Jakarta',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export function Settings() {
  const [settings, setSettings] = useState<BrowserSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Track changes
  useEffect(() => {
    setHasChanges(true);
  }, [settings]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getSettings();
      setSettings(data);
      setHasChanges(false);
    } catch (error) {
      // Use default settings if API fails
      toast.error('Failed to load settings from server');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await api.updateSettings(settings);
      setHasChanges(false);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults');
  };

  const updateSetting = <K extends keyof BrowserSettings>(
    key: K,
    value: BrowserSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Settings2 className="h-8 w-8 text-primary" />
              Browser Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Configure default browser behavior and screenshot preferences
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={saveSettings}
              disabled={!hasChanges || saving}
              className="gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
              {hasChanges && <span className="ml-1 w-2 h-2 bg-red-500 rounded-full" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Alert */}
      {hasChanges && (
        <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            You have unsaved changes. Don't forget to save your settings!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="viewport">Viewport</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          {/* Screenshot Defaults */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Screenshot Defaults
              </CardTitle>
              <CardDescription>
                Default settings for screenshot capture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Format */}
              <div className="space-y-3">
                <Label>Default Image Format</Label>
                <div className="flex gap-2">
                  {(['png', 'jpeg', 'webp'] as const).map((f) => (
                    <Button
                      key={f}
                      variant={settings.default_format === f ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSetting('default_format', f)}
                      className="flex-1 capitalize"
                    >
                      {settings.default_format === f && <Check className="h-4 w-4 mr-1" />}
                      {f}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              {settings.default_format !== 'png' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Default Quality</Label>
                    <span className="text-sm font-medium">{settings.default_quality}%</span>
                  </div>
                  <Slider
                    value={[settings.default_quality]}
                    onValueChange={(v) => updateSetting('default_quality', v[0])}
                    max={100}
                    step={5}
                  />
                </div>
              )}

              {/* Delay */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Default Delay
                  </Label>
                  <span className="text-sm font-medium">{settings.default_delay}s</span>
                </div>
                <Slider
                  value={[settings.default_delay]}
                  onValueChange={(v) => updateSetting('default_delay', v[0])}
                  max={10}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  Wait time before capturing screenshot (useful for lazy-loaded content)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Browser Language
                  </Label>
                  <select
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timezone
                  </Label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Viewport Settings */}
        <TabsContent value="viewport" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                Default Viewport
              </CardTitle>
              <CardDescription>
                Default browser window size for screenshots
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Width (pixels)</Label>
                  <Input
                    type="number"
                    value={settings.default_viewport_width}
                    onChange={(e) => updateSetting('default_viewport_width', Number(e.target.value))}
                    min="320"
                    max="7680"
                  />
                  <Slider
                    value={[settings.default_viewport_width]}
                    onValueChange={(v) => updateSetting('default_viewport_width', v[0])}
                    min={320}
                    max={3840}
                    step={10}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Height (pixels)</Label>
                  <Input
                    type="number"
                    value={settings.default_viewport_height}
                    onChange={(e) => updateSetting('default_viewport_height', Number(e.target.value))}
                    min="568"
                    max="4320"
                  />
                  <Slider
                    value={[settings.default_viewport_height]}
                    onValueChange={(v) => updateSetting('default_viewport_height', v[0])}
                    min={568}
                    max={2160}
                    step={10}
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-3">
                <Label>Quick Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Desktop HD', w: 1920, h: 1080 },
                    { name: 'Desktop', w: 1366, h: 768 },
                    { name: 'Laptop', w: 1440, h: 900 },
                    { name: 'Tablet', w: 768, h: 1024 },
                    { name: 'Mobile', w: 375, h: 812 },
                  ].map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateSetting('default_viewport_width', preset.w);
                        updateSetting('default_viewport_height', preset.h);
                      }}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control browser privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Headless Mode */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <Label className="font-medium">Headless Mode</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Run browser without visible window (faster, uses less resources)
                  </p>
                </div>
                <Switch
                  checked={settings.headless}
                  onCheckedChange={(v) => updateSetting('headless', v)}
                />
              </div>

              {/* Disable Images */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4" />
                    <Label className="font-medium">Disable Images</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Block image loading for faster page loads
                  </p>
                </div>
                <Switch
                  checked={settings.disable_images}
                  onCheckedChange={(v) => updateSetting('disable_images', v)}
                />
              </div>

              {/* Disable JavaScript */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <Label className="font-medium">Disable JavaScript</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Disable JavaScript execution (may break some sites)
                  </p>
                </div>
                <Switch
                  checked={settings.disable_js}
                  onCheckedChange={(v) => updateSetting('disable_js', v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* User Agent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                User Agent
              </CardTitle>
              <CardDescription>
                Customize the browser user agent string
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
                  value={settings.user_agent || ''}
                  onChange={(e) => updateSetting('user_agent', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use default Chrome user agent
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Advanced Configuration
              </CardTitle>
              <CardDescription>
                Fine-tune browser behavior for specific use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Geolocation */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Geolocation Override
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Latitude"
                    value={settings.geolocation?.latitude ?? ''}
                    onChange={(e) => {
                      const lat = e.target.value ? Number(e.target.value) : 0;
                      const lng = settings.geolocation?.longitude ?? 0;
                      updateSetting('geolocation', { latitude: lat, longitude: lng });
                    }}
                    min="-90"
                    max="90"
                    step="0.0001"
                  />
                  <Input
                    type="number"
                    placeholder="Longitude"
                    value={settings.geolocation?.longitude ?? ''}
                    onChange={(e) => {
                      const lat = settings.geolocation?.latitude ?? 0;
                      const lng = e.target.value ? Number(e.target.value) : 0;
                      updateSetting('geolocation', { latitude: lat, longitude: lng });
                    }}
                    min="-180"
                    max="180"
                    step="0.0001"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Override browser geolocation (leave empty to use default)
                </p>
              </div>

              <Separator />

              {/* API Configuration */}
              <div className="space-y-3">
                <Label>API Endpoint</Label>
                <Input
                  value={import.meta.env.VITE_API_URL || 'http://localhost:8000'}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Configure via VITE_API_URL environment variable
                </p>
              </div>

              {/* Info Box */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  These settings are saved to the server and will be used as defaults for all screenshot requests.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
