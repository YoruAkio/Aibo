import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  MessageCircle,
  BarChart3,
  Users,
  Brain,
  Star,
  Globe,
  Rocket,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />{' '}
      {/* @note hero section with cross-browser compatible background effects */}
      <main className="flex-1 relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute -top-40 left-1/2 w-80 h-80 sm:w-96 sm:h-96 lg:w-[80rem] lg:h-[80rem] -translate-x-1/2 rounded-full opacity-60"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, hsl(var(--primary) / 0.1) 50%, transparent 100%)',
              filter: 'blur(48px)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          <div
            className="absolute -bottom-40 right-1/3 w-60 h-60 sm:w-80 sm:h-80 lg:w-[60rem] lg:h-[60rem] -translate-x-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--secondary) / 0.3) 0%, hsl(var(--accent) / 0.2) 50%, transparent 100%)',
              filter: 'blur(48px)',
            }}
          />
          <div
            className="absolute top-1/2 left-1/4 w-40 h-40 sm:w-60 sm:h-60 lg:w-[40rem] lg:h-[40rem] -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--primary) / 0.05) 0%, transparent 70%)',
              filter: 'blur(32px)',
            }}
          />
        </div>

        {/* @note hero content */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center space-y-8">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-border/50 px-4 py-2 text-sm"
                style={{
                  backgroundColor: 'hsl(var(--background) / 0.8)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                <Sparkles className="size-4 text-primary" />
                <span className="text-muted-foreground">
                  Powered by Advanced AI
                </span>
                <Badge variant="secondary" className="text-xs">
                  Beta
                </Badge>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                  Obrolan Cerdas.
                  <br />
                  <span className="text-primary">Jawaban Cepat.</span>
                </h1>

                <p className="mx-auto max-w-xl text-lg text-muted-foreground leading-relaxed">
                  Aibo adalah asisten percakapan AI yang revolusioner. Dapatkan
                  jawaban instan, saran personal, dan solusi untuk semua
                  kebutuhan harian Anda.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/dashboard">
                  <Button size="default" className="group px-6 py-2">
                    Mulai Percakapan
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button variant="outline" size="default" className="px-6 py-2">
                  Lihat Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* @note features section with modern grid */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Mengapa Memilih Aibo?
              </h2>
              <p className="text-base text-muted-foreground max-w-xl mx-auto">
                Teknologi AI terdepan yang dirancang untuk memahami dan membantu
                Anda dengan cara yang natural.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                className="group hover:shadow-lg transition-all duration-300 border-0"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.5) 100%)',
                }}
              >
                <CardContent className="p-6">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="size-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Percakapan Natural
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Berbicara dengan Aibo seperti berbicara dengan teman. AI
                    yang memahami konteks dan nuansa bahasa Indonesia.
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group hover:shadow-lg transition-all duration-300 border-0"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.5) 100%)',
                }}
              >
                <CardContent className="p-6">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Zap className="size-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Respons Instan</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Dapatkan jawaban dalam hitungan detik. Infrastruktur cloud
                    yang andal memastikan kecepatan optimal.
                  </p>
                </CardContent>
              </Card>

              <Card
                className="group hover:shadow-lg transition-all duration-300 border-0"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.5) 100%)',
                }}
              >
                <CardContent className="p-6">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Shield className="size-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Privasi Terjamin
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Data Anda adalah milik Anda. Enkripsi end-to-end dan
                    kebijakan privasi yang ketat melindungi informasi Anda.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* @note cta section with cross-browser gradient */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="rounded-3xl border border-primary/20 p-8"
              style={{
                background:
                  'linear-gradient(to right, hsl(var(--primary) / 0.1) 0%, hsl(var(--primary) / 0.05) 50%, hsl(var(--primary) / 0.1) 100%)',
              }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Siap Memulai Percakapan?
              </h2>
              <p className="text-base text-muted-foreground mb-6 max-w-xl mx-auto">
                Bergabunglah dengan ribuan pengguna yang sudah merasakan
                pengalaman AI terbaik dengan Aibo.
              </p>
              <Link href="/dashboard">
                <Button size="default" className="px-6 py-2 group">
                  Coba Sekarang
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
