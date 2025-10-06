import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import { WishlistProvider } from '@/contexts/WishlistContext';

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
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </AuthModalProvider>
      </body>
    </html>
  );
}
