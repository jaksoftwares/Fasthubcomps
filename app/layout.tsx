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
                  href="https://wa.me/254715242502?text=Hello%20FastHub%20Computers%2C%20I%20would%20like%20to%20inquire%20about%20your%20products%20and%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-lg shadow-[#25D366]/40 transition-all md:bottom-6 md:right-6"
                  aria-label="Chat with us on WhatsApp"
                >
                  {/* WhatsApp logo-style icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M16 3C9.383 3 4 8.383 4 15c0 2.125.563 4.145 1.625 5.957L4 29l8.27-1.597C13.969 27.77 14.977 28 16 28c6.617 0 12-5.383 12-12S22.617 3 16 3zm0 2c5.539 0 10 4.461 10 10s-4.461 10-10 10c-.918 0-1.824-.129-2.691-.383l-.488-.145-.5.098L7 25l1.41-5.148.148-.535-.285-.492C7.465 17.676 7 16.352 7 15c0-5.539 4.461-10 10-10zm-4.105 5c-.258 0-.676.098-1.031.492-.355.395-1.355 1.324-1.355 3.23 0 1.906 1.387 3.75 1.582 4.004.195.254 2.617 4.18 6.465 5.688 3.199 1.262 3.852 1.012 4.547.945.695-.066 2.242-.91 2.559-1.793.316-.883.316-1.64.223-1.801-.094-.16-.355-.254-.742-.445-.387-.192-2.285-1.129-2.637-1.258-.352-.129-.609-.192-.867.192-.258.383-.996 1.258-1.219 1.512-.223.254-.445.287-.832.096-.387-.191-1.637-.602-3.119-1.918-1.152-1.027-1.93-2.297-2.153-2.68-.223-.383-.023-.59.168-.781.172-.172.383-.445.574-.668.191-.223.254-.383.383-.637.129-.254.066-.477-.032-.668-.097-.191-.86-2.141-1.211-2.93-.313-.703-.637-.719-.895-.727z"
                    />
                  </svg>
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
