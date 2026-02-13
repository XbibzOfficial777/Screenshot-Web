import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  History, 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  MoreVertical, 
  Globe, 
  Monitor,
  Calendar,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import type { Screenshot } from '@/types';

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'bg-green-500', label: 'Completed' },
  failed: { icon: AlertCircle, color: 'bg-red-500', label: 'Failed' },
  pending: { icon: Clock, color: 'bg-yellow-500', label: 'Pending' },
};

export function HistoryPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [screenshotToDelete, setScreenshotToDelete] = useState<Screenshot | null>(null);

  useEffect(() => {
    loadScreenshots();
  }, []);

  const loadScreenshots = async () => {
    setLoading(true);
    try {
      const response = await api.getHistory({ limit: 100 });
      setScreenshots(response.screenshots);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async (screenshot: Screenshot) => {
    if (screenshot.status !== 'completed') return;
    
    setSelectedScreenshot(screenshot);
    setPreviewOpen(true);
    
    try {
      const preview = await api.previewScreenshot(screenshot.id);
      setPreviewImage(preview.image);
    } catch (err) {
      console.error('Failed to load preview:', err);
    }
  };

  const handleDownload = async (screenshot: Screenshot) => {
    if (screenshot.status !== 'completed') return;
    
    try {
      const response = await api.downloadScreenshot(screenshot.id);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = screenshot.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  const handleDelete = async () => {
    if (!screenshotToDelete) return;
    
    try {
      await api.deleteScreenshot(screenshotToDelete.id);
      setScreenshots(prev => prev.filter(s => s.id !== screenshotToDelete.id));
      setDeleteDialogOpen(false);
      setScreenshotToDelete(null);
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const filteredScreenshots = screenshots.filter(screenshot =>
    screenshot.url.toLowerCase().includes(search.toLowerCase()) ||
    screenshot.filename.toLowerCase().includes(search.toLowerCase()) ||
    screenshot.browser.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            History
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all captured screenshots
          </p>
        </div>
        <Button variant="outline" onClick={loadScreenshots} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: screenshots.length, color: 'bg-blue-500' },
          { label: 'Completed', value: screenshots.filter(s => s.status === 'completed').length, color: 'bg-green-500' },
          { label: 'Failed', value: screenshots.filter(s => s.status === 'failed').length, color: 'bg-red-500' },
          { label: 'Pending', value: screenshots.filter(s => s.status === 'pending').length, color: 'bg-yellow-500' },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by URL, filename, or browser..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Screenshot History
          </CardTitle>
          <CardDescription>
            {filteredScreenshots.length} screenshots found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredScreenshots.length > 0 ? (
              <div className="space-y-2">
                {filteredScreenshots.map((screenshot) => {
                  const status = statusConfig[screenshot.status];
                  const StatusIcon = status.icon;
                  
                  return (
                    <div
                      key={screenshot.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-full ${status.color}/10 flex items-center justify-center flex-shrink-0`}>
                        <StatusIcon className={`w-5 h-5 ${status.color.replace('bg-', 'text-')}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <p className="font-medium truncate">{screenshot.url}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Monitor className="w-3 h-3" />
                            {screenshot.browser}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(screenshot.timestamp)}
                          </span>
                          {screenshot.status === 'completed' && (
                            <span>{formatFileSize(screenshot.file_size)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {screenshot.status === 'completed' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePreview(screenshot)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(screenshot)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setScreenshotToDelete(screenshot);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <History className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No screenshots found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {search ? 'Try adjusting your search' : 'Capture your first screenshot from the dashboard'}
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Screenshot Preview
            </DialogTitle>
            <DialogDescription>
              {selectedScreenshot?.url}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {previewImage ? (
              <img 
                src={previewImage} 
                alt="Screenshot preview" 
                className="w-full h-auto rounded-lg border"
              />
            ) : (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            {selectedScreenshot && (
              <Button onClick={() => handleDownload(selectedScreenshot)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Delete Screenshot
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this screenshot? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}