
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth-neon';
import AIAssistant from '@/components/ai/AIAssistant';

export const metadata: Metadata = {
  title: 'HYHAN - Blockchain Education & Scholarship Platform',
  description: 'Advanced blockchain-powered education platform with AI-driven scholarship matching, comprehensive user verification system, and decentralized credentials.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Anton+SC&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased magical-bg" suppressHydrationWarning>
        <AuthProvider>
            <div className="min-h-screen relative">
              {children}
              <AIAssistant />
              <Toaster />
            </div>
        </AuthProvider>
      </body>
    </html>
  );
}
