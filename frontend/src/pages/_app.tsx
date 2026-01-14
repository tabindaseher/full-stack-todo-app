import React from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/auth-context';
import { ThemeProvider } from '../context/theme-context';
import { ToastProvider } from '../components/ui/toast';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;