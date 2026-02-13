import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings2, 
  Monitor, 
  Globe, 
  Clock, 
  Shield, 
  Image, 
  Code2,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Chrome,
  Firefox,
  Edge,
  Safari
} from 'lucide-react';
import type { Settings as SettingsType, BrowserInfo } from '@/types';

const browserIcons: Record<string, React.ElementType> = {
  chrome: Chrome,
  firefox: Firefox,
  edge: Edge,
  safari: Safari,
};

export function Settings() {
  const { resolvedTheme } = useTheme();
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [browsers, setBrowsers] = useState<BrowserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [settingsRes, browsersRes] = await Promise.all([
        api.getSettings(),
        api.getBrowsers(),
      ]);
      setSettings(settingsRes.settings);
      setBrowsers(browsersRes.browsers);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      await api.updateSettings(settings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const response = await api.resetSettings();
      setSettings(response.settings);
      setMessage({ type: 'success', text: 'Settings reset to defaults!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to reset settings' });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>Failed to load settings. Please refresh the page.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure browser automation and screenshot preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={saving}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {message && (
        <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="browser">Browser</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-primary" />
                Display Settings
              </CardTitle>
              <CardDescription>
                Configure default screenshot dimensions and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Window Size */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="window_width" className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Default Width (px)
                  </Label>
                  <Input
                    id="window_width"
                    type="number"
                    value={settings.window_width}
                    onChange={(e) => updateSetting('window_width', parseInt(e.target.value))}
                    min={320}
                    max={7680}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="window_height" className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Default Height (px)
                  </Label>
                  <Input
                    id="window_height"
                    type="number"
                    value={settings.window_height}
                    onChange={(e) => updateSetting('window_height', parseInt(e.target.value))}
                    min={240}
                    max={4320}
                  />
                </div>
              </div>

              <Separator />

              {/* Full Page */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Full Page Capture
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Capture entire page by default
                  </p>
                </div>
                <Switch
                  checked={settings.full_page}
                  onCheckedChange={(checked) => updateSetting('full_page', checked)}
                />
              </div>

              <Separator />

              {/* Delay */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Capture Delay: {settings.delay}s
                </Label>
                <Slider
                  value={[settings.delay]}
                  onValueChange={([value]) => updateSetting('delay', value)}
                  max={10}
                  step={1}
                />
                <p className="text-sm text-muted-foreground">
                  Wait time before capturing screenshot
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Browser Settings */}
        <TabsContent value="browser" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Browser Configuration
              </CardTitle>
              <CardDescription>
                Select and configure the browser for screenshots
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Available Browsers */}
              <div className="space-y-3">
                <Label>Available Browsers</Label>
                <div className="grid grid-cols-2 gap-3">
                  {browsers.map((browser) => {
                    const Icon = browserIcons[browser.name.toLowerCase()] || Globe;
                    return (
                      <div
                        key={browser.name}
                        className={`
                          flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                          ${settings.browser === browser.name.toLowerCase()
                            ? 'border-primary bg-primary/5' 
                            : 'border-border'
                          }
                          ${!browser.available ? 'opacity-50' : ''}
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="flex-1">
                          <div className="font-medium capitalize">{browser.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {browser.available ? `v${browser.version}` : 'Not available'}
                          </div>
                        </div>
                        {browser.available && (
                          <Button
                            size="sm"
                            variant={settings.browser === browser.name.toLowerCase() ? 'default' : 'outline'}
                            onClick={() => updateSetting('browser', browser.name.toLowerCase())}
                          >
                            {settings.browser === browser.name.toLowerCase() ? 'Selected' : 'Select'}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* User Agent */}
              <div className="space-y-2">
                <Label htmlFor="user_agent" className="flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  User Agent
                </Label>
                <Input
                  id="user_agent"
                  value={settings.user_agent}
                  onChange={(e) => updateSetting('user_agent', e.target.value)}
                  placeholder="Mozilla/5.0..."
                />
                <p className="text-sm text-muted-foreground">
                  Custom user agent string for browser requests
                </p>
              </div>

              <Separator />

              {/* Dark Mode */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Force Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode in browser by default
                  </p>
                </div>
                <Switch
                  checked={settings.dark_mode}
                  onCheckedChange={(checked) => updateSetting('dark_mode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Advanced Options
              </CardTitle>
              <CardDescription>
                Fine-tune browser behavior and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Headless */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Headless Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Run browser without visible window
                  </p>
                </div>
                <Switch
                  checked={settings.headless}
                  onCheckedChange={(checked) => updateSetting('headless', checked)}
                />
              </div>

              <Separator />

              {/* JavaScript */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    JavaScript Enabled
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow JavaScript execution on pages
                  </p>
                </div>
                <Switch
                  checked={settings.javascript_enabled}
                  onCheckedChange={(checked) => updateSetting('javascript_enabled', checked)}
                />
              </div>

              <Separator />

              {/* Images */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Load Images
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable image loading in browser
                  </p>
                </div>
                <Switch
                  checked={settings.images_enabled}
                  onCheckedChange={(checked) => updateSetting('images_enabled', checked)}
                />
              </div>

              <Separator />

              {/* Block Ads */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Block Ads
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable ad blocking (experimental)
                  </p>
                </div>
                <Switch
                  checked={settings.block_ads}
                  onCheckedChange={(checked) => updateSetting('block_ads', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                System Information
              </CardTitle>
              <CardDescription>
                View system status and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="text-sm text-muted-foreground">API Version</div>
                  <div className="text-lg font-semibold">2.0.0</div>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <div className="text-sm text-muted-foreground">Frontend Version</div>
                  <div className="text-lg font-semibold">2.0.0</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Available Browsers</Label>
                <div className="flex flex-wrap gap-2">
                  {browsers.map((browser) => (
                    <Badge 
                      key={browser.name} 
                      variant={browser.available ? 'default' : 'secondary'}
                    >
                      {browser.name.charAt(0).toUpperCase() + browser.name.slice(1)}
                      {browser.available && ` v${browser.version}`}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {resolvedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}