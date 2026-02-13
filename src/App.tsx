import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/sections/Dashboard';
import { Settings } from '@/sections/Settings';
import { HistoryPage } from '@/sections/History';
import type { Tab } from '@/types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'settings':
        return <Settings />;
      case 'history':
        return <HistoryPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </main>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            classNames: {
              toast: 'bg-background border-border shadow-lg',
              title: 'text-foreground',
              description: 'text-muted-foreground',
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
