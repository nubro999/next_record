import '../app/globals.css';
import type { AppProps } from 'next/app';
import Header from '../app/components/layout/Header';
import Sidebar from '../app/components/layout/Sidebar';
import Footer from '../app/components/layout/Footer';
import { AuthProvider } from '../app/context/AuthContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-gradient-gothic paper-texture">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 candle-light">
            <Component {...pageProps} />
          </main>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}