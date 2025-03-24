// app/layout.tsx
import './globals.css';
import { AuthProvider } from './context/AuthContext';

// Simple layout that just provides styles and fonts
// All content will be served from pages directory
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
        <link rel="preconnect" href="https://fastly.jsdelivr.net/gh/projectnoonnu/2405-3@1.1/Cafe24Decobox.woff2" />
        <link rel="preconnect" href="https://fastly.jsdelivr.net/gh/projectnoonnu/2405-3@1.1/Cafe24Decobox.woff2" crossOrigin="anonymous" />
        <link href="https://fastly.jsdelivr.net/gh/projectnoonnu/2405-3@1.1/Cafe24Decobox.woff2" rel="stylesheet" />
      </head>
      <body className="paper-texture">
        <AuthProvider>
          <div id="app-root">
            {/* This will never render content since pages directory handles routing */}
            {/* Pages directory content uses _app.tsx for layout */}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}