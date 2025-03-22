// app/layout.tsx
import './globals.css';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>RecorD - Mystic Chronicles</title>
        <meta name="description" content="Document your thoughts in a gothic fantasy realm" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Cinzel:wght@400;500;600;700&family=Eczar:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="paper-texture">
        <AuthProvider>
          <div className="flex min-h-screen flex-col bg-gradient-gothic">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-6 candle-light">{children}</main>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}