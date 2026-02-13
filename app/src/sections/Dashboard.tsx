import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Camera, 
  Loader2, 
  Download, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  Globe,
  Monitor,
  Clock,
  Maximize2,
  Smartphone,
  Tablet,
  Laptop,
  RefreshCw
} from 'lucide-react';
import type { Screenshot, Settings } from '@/types';

const presetSizes = [
  { name: 'Desktop HD', width: 1920, height: 1080, icon: Laptop },
  { name: 'Desktop', width: 1366, height: 768, icon: Monitor },
  { name: 'Tablet', width: 768, height: 1024, icon: Tablet },
  { name: 'Mobile', width: 375, height: 667, icon: Smartphone },
];

const browsers = [
  { value: 'chrome', label: 'Chrome', color: 'bg-blue-500' },
  { value: 'firefox', label: 'Firefox', color: 'bg-orange-500' },
  { value: 'edge', label: 'Edge', color: 'bg-cyan-500' },
  { value: 'safari', label: 'Safari', color: 'bg-blue-400' },
];

export function Dashboard() {
  const [url, setUrl] = useState('');
  const [settings, setSettings] = useState<Partial<Settings>>({
    browser: 'chrome',
    window_width: 1920,
    window_height: 1080,
    full_page: true,
    delay: 0,
    dark_mode: false,
  });
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState<Screenshot | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentScreenshots, setRecentScreenshots] = useState<Screenshot[]>([]);

  useEffect(() => {
    loadRecentScreenshots();
  }, []);

  const loadRecentScreenshots = async () => {
    try {
      const response = await api.getHistory({ limit: 5 });
      setRecentScreenshots(response.screenshots.filter(s => s.status === 'completed'));
    } catch (err) {
      console.error('Failed to load recent screenshots:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setScreenshot(null);
    setPreview(null);

    try {
      const response = await api.createScreenshot({
        url: url.startsWith('http') ? url : `https://${url}`,
        ...settings,
      });
      setScreenshot(response);
      
      const previewData = await api.previewScreenshot(response.id);
      setPreview(previewData.image);
      
      loadRecentScreenshots();
    } catch (err: any) {
      setError(err.message || 'Failed to capture screenshot');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!screenshot) return;
    
    try {
      const response = await api.downloadScreenshot(screenshot.id);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = screenshot.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  const applyPreset = (width: number, height: number) => {
    setSettings(prev => ({ ...prev, window_width: width, window_height: height }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Capture screenshots of any website with advanced settings
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          API Connected
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="border-border/50 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Capture Screenshot
            </CardTitle>
            <CardDescription>
              Enter a URL and configure capture settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website URL
                </Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12"
                />
              </div>

              <Tabs defaultValue="browser" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="browser">Browser</TabsTrigger>
                  <TabsTrigger value="size">Size</TabsTrigger>
                  <TabsTrigger value="options">Options</TabsTrigger>
                </TabsList>

                <TabsContent value="browser" className="space-y-4 pt-4">
                  <Label>Select Browser</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {browsers.map((browser) => (
                      <button
                        key={browser.value}
                        type="button"
                        onClick={() => setSettings(prev => ({ ...prev, browser: browser.value }))}
                        className={`
                          flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                          ${settings.browser === browser.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                          }
                        `}
                      >
                        <div className={`w-4 h-4 rounded-full ${browser.color}`} />
                        <span className="font-medium">{browser.label}</span>
                      </button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="size" className="space-y-4 pt-4">
                  <Label>Presets</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {presetSizes.map((preset) => {
                      const Icon = preset.icon;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyPreset(preset.width, preset.height)}
                          className={`
                            flex items-center gap-3 p-4 rounded-lg border-2 transition-all
                            ${settings.window_width === preset.width && settings.window_height === preset.height
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                            }
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          <div className="text-left">
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {preset.width} × {preset.height}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Width (px)</Label>
                      <Input
                        type="number"
                        value={settings.window_width}
                        onChange={(e) => setSettings(prev => ({ ...prev, window_width: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (px)</Label>
                      <Input
                        type="number"
                        value={settings.window_height}
                        onChange={(e) => setSettings(prev => ({ ...prev, window_height: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="options" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                          <Maximize2 className="w-4 h-4" />
                          Full Page
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Capture entire page, not just viewport
                        </p>
                      </div>
                      <Switch
                        checked={settings.full_page}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, full_page: checked }))}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Delay: {settings.delay}s
                      </Label>
                      <Slider
                        value={[settings.delay || 0]}
                        onValueChange={([value]) => setSettings(prev => ({ ...prev, delay: value }))}
                        max={10}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">
                        Wait time before capturing
                      </p>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Dark Mode
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Force dark mode in browser
                        </p>
                      </div>
                      <Switch
                        checked={settings.dark_mode}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dark_mode: checked }))}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold"
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-2" />
                    Capture Screenshot
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Preview
              </CardTitle>
              <CardDescription>
                Screenshot preview will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {preview ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-border/50 bg-muted">
                    <img 
                      src={preview} 
                      alt="Screenshot preview" 
                      className="w-full h-auto max-h-[400px] object-contain"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <h3 className="text-lg font-semibold text-destructive">Capture Failed</h3>
                  <p className="text-muted-foreground mt-2 max-w-xs">{error}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border/50 rounded-lg">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Camera className="w-10 h-10 text-primary/50" />
                  </div>
                  <h3 className="text-lg font-semibold text-muted-foreground">No Preview</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter a URL and click capture to see preview
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Recent Captures
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={loadRecentScreenshots}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {recentScreenshots.length > 0 ? (
                  <div className="space-y-2">
                    {recentScreenshots.map((shot) => (
                      <div 
                        key={shot.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded bg-background flex items-center justify-center flex-shrink-0">
                            <Globe className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{shot.url}</p>
                            <p className="text-xs text-muted-foreground">
                              {shot.browser} • {shot.width}×{shot.height}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={async () => {
                            const response = await api.downloadScreenshot(shot.id);
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = shot.filename;
                            link.click();
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-sm text-muted-foreground">No recent captures</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}