import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'SPURT LOCAL - Hyper-Local Sports Matchmaking in Delhi & Greater Noida',
  description: 'Join verified local match lobbies for Cricket, Football, Badminton & Table Tennis in under 60 seconds. Created by Yashwant Sonkar.',
  authors: [{ name: 'Yashwant Sonkar' }],
  creator: 'Yashwant Sonkar',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-[#070D18] text-slate-100 min-h-screen selection:bg-orange-500 selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
