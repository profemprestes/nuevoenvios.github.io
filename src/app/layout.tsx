import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SidebarNav from '@/components/layout/SidebarNav';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'NuevoEnvios',
  description: 'Plataforma de gestión de envíos y mensajería.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider defaultOpen={true}>
          <Header />
          <SidebarNav />
          <SidebarInset>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
            <Footer />
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
