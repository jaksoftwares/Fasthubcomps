import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { MessageCircle } from 'lucide-react';

// 👇 Place the font files inside: app/fonts/
const inter = localFont({
  src: [
    {
      path: './fonts/Inter-Regular.woff2', // relative to app/layout.tsx
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'FastHub Computers - Unlocking your IT needs',
  description:
    'Your one-stop shop for computers, laptops, phones and accessories. Professional repair services available.',
  keywords:
    'computers, laptops, phones, accessories, repairs, IT services, FastHub',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthModalProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                {/* Global WhatsApp Contact Button */}
                <a
                  href="https://wa.me/254715242502"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/40 transition-all md:bottom-6 md:right-6"
                  aria-label="Chat with us on WhatsApp"
                >
                  <MessageCircle className="h-6 w-6" />
                </a>
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </AuthModalProvider>
      </body>
    </html>
  );
}
