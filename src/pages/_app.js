import '@/styles/globals.css';
import { Bricolage_Grotesque, Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/contexts/theme-context';

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage-grotesque',
  subsets: ['latin'],
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const geistSans = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-geist-mono',
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <div
        className={`bg-background text-foreground antialiased ${bricolageGrotesque.variable} ${geistSans.variable} ${geistMono.variable} ${jetBrainsMono.variable}`}
      >
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
