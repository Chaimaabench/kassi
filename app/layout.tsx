import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KASSI | Premium Mugs',
  description: 'Elevate your every sip with KASSI premium mugs.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased bg-cream text-charcoal selection:bg-terracotta selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
