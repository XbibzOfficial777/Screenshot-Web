import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Globe, 
  HardDrive,
  TrendingUp,
  Loader2
} from 'lucide-react';
import type { Stats } from '@/types';

export function Statistics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.getStats();
      setStats(response);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold">Failed to load statistics</h3>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  const successRate = stats.total_screenshots > 0 
    ? Math.round((stats.completed / stats.total_screenshots) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Statistics
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of screenshot activity and performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Screenshots</p>
                <p className="text-3xl font-bold mt-1">{stats.total_screenshots}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Camera className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold mt-1">{successRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <Progress value={successRate} className="mt-4" />
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Domains</p>
                <p className="text-3xl font-bold mt-1">{stats.unique_domains}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-3xl font-bold mt-1">{stats.total_size_mb} MB</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Status Breakdown
            </CardTitle>
            <CardDescription>
              Distribution of screenshot statuses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Completed</span>
                </div>
                <span className="text-sm font-semibold">{stats.completed}</span>
              </div>
              <Progress 
                value={stats.total_screenshots > 0 ? (stats.completed / stats.total_screenshots) * 100 : 0} 
                className="h-2 bg-green-500/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Failed</span>
                </div>
                <span className="text-sm font-semibold">{stats.failed}</span>
              </div>
              <Progress 
                value={stats.total_screenshots > 0 ? (stats.failed / stats.total_screenshots) * 100 : 0} 
                className="h-2 bg-red-500/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">Pending</span>
                </div>
                <span className="text-sm font-semibold">{stats.pending}</span>
              </div>
              <Progress 
                value={stats.total_screenshots > 0 ? (stats.pending / stats.total_screenshots) * 100 : 0} 
                className="h-2 bg-yellow-500/20"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Top Domains
            </CardTitle>
            <CardDescription>
              Most frequently captured websites
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.domains.length > 0 ? (
              <div className="space-y-3">
                {stats.domains.map((domain, index) => (
                  <div
                    key={domain}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium truncate flex-1">{domain}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <Globe className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No domains captured yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-primary" />
            Storage Information
          </CardTitle>
          <CardDescription>
            Screenshot storage usage details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Size</p>
              <p className="text-2xl font-bold">{stats.total_size_mb} MB</p>
              <p className="text-xs text-muted-foreground">{stats.total_size_bytes.toLocaleString()} bytes</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average per Screenshot</p>
              <p className="text-2xl font-bold">
                {stats.completed > 0 
                  ? (stats.total_size_mb / stats.completed).toFixed(2) 
                  : '0'} MB
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Files</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}