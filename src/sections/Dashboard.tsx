import { useState, useEffect } from 'react';
import { 
  Camera, 
  Link2, 
  Monitor, 
  Clock, 
  Image as ImageIcon, 
  Download, 
  Loader2, 
  Check,
  Moon,
  Sun,
  Maximize2,
  Eye,
  EyeOff,
  Smartphone,
  Globe,
  Zap,
  Settings2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { api } from '@/services/api';
import type { ScreenshotRequest, ScreenshotResponse, ViewportPreset, UserAgent } from '@/types';
import { toast } from 'sonner';

const viewportPresets: ViewportPreset[] = [
  { name: 'Desktop HD', width: 1920, height: 1080 },
  { name: 'Desktop', width: 1366, height: 768 },
  { name: 'Laptop', width: 1440, height: 900 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Mobile Large', width: 414, height: 896 },
  { name: 'Mobile Medium', width: 375, height: 812 },
  { name: 'Mobile Small', width: 320, height: 568 },
];

const userAgents: UserAgent[] = [
  { name: 'Chrome (Windows)', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  { name: 'Chrome (Mac)', value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  { name: 'Firefox (Windows)', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0' },
  { name: 'Safari (Mac)', value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15' },
  { name: 'Edge (Windows)', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0' },
  { name: 'Mobile iPhone', value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1' },
  { name: 'Mobile Android', value: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' },
];

export function Dashboard() {
  const [url, setUrl] = useState('');
  const [viewportWidth, setViewportWidth] = useState(1920);
  const [viewportHeight, setViewportHeight] = useState(1080);
  const [fullPage, setFullPage] = useState(false);
  const [delay, setDelay] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState(90);
  const [userAgent, setUserAgent] = useState('');
  const [hideElements, setHideElements] = useState('');
  const [waitForSelector, setWaitForSelector] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScreenshotResponse | null>(null);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);

  // Load recent URLs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentUrls');
    if (saved) {
      setRecentUrls(JSON.parse(saved));
    }
  }, []);

  const saveRecentUrl = (url: string) => {
    const updated = [url, ...recentUrls.filter(u => u !== url)].slice(0, 5);
    setRecentUrls(updated);
    localStorage.setItem('recentUrls', JSON.stringify(updated));
  };

  const handleViewportPreset = (preset: ViewportPreset) => {
    setViewportWidth(preset.width);
    setViewportHeight(preset.height);
  };

  const handleCapture = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    // Add https:// if not present
    let processedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      processedUrl = `https://${url}`;
    }

    setLoading(true);
    setResult(null);

    try {
      const request: ScreenshotRequest = {
        url: processedUrl,
        viewport_width: viewportWidth,
        viewport_height: viewportHeight,
        full_page: fullPage,
        delay,
        user_agent: userAgent || undefined,
        dark_mode: darkMode,
        format,
        quality,
        hide_elements: hideElements ? hideElements.split(',').map(s => s.trim()) : undefined,
        wait_for_selector: waitForSelector || undefined,
      };

      const response = await api.takeScreenshot(request);
      
      if (response.success) {
        setResult(response);
        saveRecentUrl(processedUrl);
        toast.success('Screenshot captured successfully!');
      } else {
        toast.error(response.message || 'Failed to capture screenshot');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result?.image_base64 && result.filename) {
      const link = document.createElement('a');
      link.href = `data:image/${format};base64,${result.image_base64}`;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Capture the Web
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Take beautiful screenshots of any website with advanced browser controls and customization options.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
          {/* URL Input */}
          <Card className="border-border/50 shadow-xl shadow-primary/5 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link2 className="h-5 w-5 text-primary" />
                Website URL
              </CardTitle>
              <CardDescription>Enter the URL you want to capture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-10 h-12 text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleCapture()}
                />
              </div>
              
              {/* Recent URLs */}
              {recentUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground">Recent:</span>
                  {recentUrls.map((recentUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUrl(recentUrl)}
                      className="text-xs text-primary hover:underline truncate max-w-[200px]"
                    >
                      {recentUrl}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Viewport Settings */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Monitor className="h-5 w-5 text-primary" />
                Viewport
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Presets */}
              <div className="flex flex-wrap gap-2">
                {viewportPresets.map((preset) => (
                  <TooltipProvider key={preset.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewportPreset(preset)}
                          className="text-xs"
                        >
                          <Smartphone className="h-3 w-3 mr-1" />
                          {preset.name}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {preset.width} × {preset.height}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>

              {/* Custom Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Width (px)</Label>
                  <Input
                    type="number"
                    value={viewportWidth}
                    onChange={(e) => setViewportWidth(Number(e.target.value))}
                    min="320"
                    max="7680"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Height (px)</Label>
                  <Input
                    type="number"
                    value={viewportHeight}
                    onChange={(e) => setViewportHeight(Number(e.target.value))}
                    min="568"
                    max="4320"
                  />
                </div>
              </div>

              {/* Full Page Toggle */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Maximize2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Full Page</Label>
                    <p className="text-xs text-muted-foreground">Capture entire scrollable page</p>
                  </div>
                </div>
                <Switch checked={fullPage} onCheckedChange={setFullPage} />
              </div>
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-primary" />
                Quick Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Delay */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Delay (seconds)
                  </Label>
                  <span className="text-sm font-medium">{delay}s</span>
                </div>
                <Slider
                  value={[delay]}
                  onValueChange={(v) => setDelay(v[0])}
                  max={10}
                  step={1}
                />
              </div>

              <Separator />

              {/* Format */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Image Format
                </Label>
                <div className="flex gap-2">
                  {(['png', 'jpeg', 'webp'] as const).map((f) => (
                    <Button
                      key={f}
                      variant={format === f ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFormat(f)}
                      className="flex-1 capitalize"
                    >
                      {f}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quality (for jpeg/webp) */}
              {format !== 'png' && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Quality</Label>
                    <span className="text-sm font-medium">{quality}%</span>
                  </div>
                  <Slider
                    value={[quality]}
                    onValueChange={(v) => setQuality(v[0])}
                    max={100}
                    step={5}
                  />
                </div>
              )}

              {/* Dark Mode */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <Label className="font-medium">Dark Mode</Label>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader 
              className="pb-4 cursor-pointer"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" />
                  Advanced Settings
                </span>
                {showAdvanced ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
            </CardHeader>
            
            {showAdvanced && (
              <CardContent className="space-y-4 pt-0">
                {/* User Agent */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    User Agent
                  </Label>
                  <select
                    value={userAgent}
                    onChange={(e) => setUserAgent(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">Default (Chrome)</option>
                    {userAgents.map((ua) => (
                      <option key={ua.name} value={ua.value}>
                        {ua.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hide Elements */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4" />
                    Hide Elements (CSS selectors, comma separated)
                  </Label>
                  <Input
                    placeholder=".cookie-banner, .ads, #popup"
                    value={hideElements}
                    onChange={(e) => setHideElements(e.target.value)}
                  />
                </div>

                {/* Wait For Selector */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Wait For Element (CSS selector)
                  </Label>
                  <Input
                    placeholder=".main-content, #loaded"
                    value={waitForSelector}
                    onChange={(e) => setWaitForSelector(e.target.value)}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Capture Button */}
          <Button
            size="lg"
            onClick={handleCapture}
            disabled={loading}
            className="w-full h-14 text-lg font-semibold shadow-xl shadow-primary/25 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Capturing...
              </>
            ) : (
              <>
                <Camera className="h-5 w-5 mr-2" />
                Capture Screenshot
              </>
            )}
          </Button>
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-xl h-full min-h-[500px] flex flex-col">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Preview
                </CardTitle>
                {result?.success && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Check className="h-3 w-3" />
                      Captured
                    </Badge>
                    <Button size="sm" variant="outline" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center p-6 bg-muted/30">
              {loading ? (
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                    <Loader2 className="relative h-16 w-16 animate-spin text-primary mx-auto" />
                  </div>
                  <p className="text-muted-foreground">Capturing screenshot...</p>
                </div>
              ) : result?.success && result.image_base64 ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={`data:image/${format};base64,${result.image_base64}`}
                    alt="Screenshot"
                    className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl"
                  />
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                    <Camera className="relative h-20 w-20 text-muted-foreground/50 mx-auto" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-muted-foreground">No screenshot yet</p>
                    <p className="text-sm text-muted-foreground/70">Enter a URL and click capture</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result Info */}
          {result?.success && result.metadata && (
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Screenshot Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Viewport:</span>
                    <p className="font-medium">{result.metadata.viewport}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Format:</span>
                    <p className="font-medium uppercase">{result.metadata.format}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Full Page:</span>
                    <p className="font-medium">{result.metadata.full_page ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <p className="font-medium">{(result.metadata.size_bytes / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
