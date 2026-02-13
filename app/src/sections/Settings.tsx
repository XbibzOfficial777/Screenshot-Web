import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Chrome, Firefox, Edge, Safari, Save } from 'lucide-react';
import type { Settings } from '@/types';

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.getSettings();
      setSettings(response.settings);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await api.updateSettings(settings);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-muted-foreground">Failed to load settings</p>
        <Button variant="outline" onClick={loadSettings} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure screenshot capture defaults
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Default Browser</CardTitle>
          <CardDescription>Select which browser to use for screenshots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'chrome', label: 'Chrome', icon: Chrome },
              { id: 'firefox', label: 'Firefox', icon: Firefox },
              { id: 'edge', label: 'Edge', icon: Edge },
              { id: 'safari', label: 'Safari', icon: Safari },
            ].map((browser) => {
              const Icon = browser.icon;
              return (
                <button
                  key={browser.id}
                  onClick={() => setSettings({ ...settings, default_browser: browser.id })}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                    ${settings.default_browser === browser.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <Icon className="w-8 h-8" />
                  <span className="font-medium">{browser.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Viewport</CardTitle>
          <CardDescription>Set default width and height for screenshots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Width (px)</Label>
              <input
                type="number"
                value={settings.default_width}
                onChange={(e) => setSettings({ ...settings, default_width: parseInt(e.target.value) })}
                className="w-full p-2 border rounded bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label>Height (px)</Label>
              <input
                type="number"
                value={settings.default_height}
                onChange={(e) => setSettings({ ...settings, default_height: parseInt(e.target.value) })}
                className="w-full p-2 border rounded bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Other Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Full page screenshot</Label>
              <p className="text-sm text-muted-foreground">Capture entire page by default</p>
            </div>
            <Switch
              checked={settings.default_full_page}
              onCheckedChange={(checked) => setSettings({ ...settings, default_full_page: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label>Default delay (seconds)</Label>
            <Slider
              value={[settings.default_delay || 0]}
              onValueChange={([value]) => setSettings({ ...settings, default_delay: value })}
              max={10}
              step={1}
            />
            <span className="text-sm">{settings.default_delay}s</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}