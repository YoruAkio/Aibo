import '@/styles/globals.css';
import { Bricolage_Grotesque, Geist } from 'next/font/google';
import { ThemeProvider } from '@/contexts/theme-context';

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const geistSans = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <div
        className={`font-sans bg-background text-foreground ${bricolageGrotesque.className} ${geistSans.className} font-sans`}
      >
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
