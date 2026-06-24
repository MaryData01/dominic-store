import ReactGA from 'react-ga4';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './store/CartContext.jsx';
import { AuthProvider } from './store/AuthContext.jsx';
import { CurrencyProvider } from './store/CurrencyContext.jsx';
import { UserAuthProvider } from './store/UserAuthContext.jsx';

ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <UserAuthProvider>
            <AuthProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </AuthProvider>
          </UserAuthProvider>
        </CurrencyProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
