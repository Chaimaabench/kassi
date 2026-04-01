import type {Metadata} from 'next';
import { siteLogoPath } from '@/lib/site-assets';
import './globals.css';

export const metadata: Metadata = {
  title: 'KASSI | Premium Mugs',
  description: 'Elevate your every sip with KASSI premium mugs.',
  icons: {
    icon: siteLogoPath,
    shortcut: siteLogoPath,
    apple: siteLogoPath,
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-cream text-charcoal selection:bg-terracotta selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
