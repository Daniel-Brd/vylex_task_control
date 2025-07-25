import { BrowserRouter } from 'react-router';
import { AppRouter } from './routing/app-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/entities/session';
import { Toaster } from '@/shared/ui';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="app-container">
            <main className="content">
              <Toaster position="top-center" />
              <AppRouter />
            </main>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
