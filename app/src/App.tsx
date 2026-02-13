import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/useTheme';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/sections/Dashboard';
import { Settings } from '@/sections/Settings';
import { HistoryPage } from '@/sections/History';
import { Statistics } from '@/sections/Statistics';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/stats" element={<Statistics />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;