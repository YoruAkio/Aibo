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
      <Navbar />

      {/* @note hero section with enhanced background effects */}
      <main className="flex-1 relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 size-[80rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 right-1/3 size-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-l from-secondary/30 via-accent/20 to-transparent blur-3xl" />
          <div className="absolute top-1/2 left-1/4 size-[40rem] -translate-y-1/2 rounded-full bg-primary/5 blur-2xl" />
        </div>

        {/* @note hero content */}
        <section className="relative pt-20 pb-16 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/80 backdrop-blur-sm px-4 py-2 text-sm">
                <Sparkles className="size-4 text-primary" />
                <span className="text-muted-foreground">
                  Powered by Advanced AI
                </span>
                <Badge variant="secondary" className="text-xs">
                  Beta
                </Badge>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                  Obrolan Cerdas.
                  <br />
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Jawaban Cepat.
                  </span>
                </h1>

                <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
                  Aibo adalah asisten percakapan AI yang revolusioner. Dapatkan
                  jawaban instan, saran personal, dan solusi untuk semua
                  kebutuhan harian Anda.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="group px-8 py-3 text-base">
                    Mulai Percakapan
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-base"
                >
                  Lihat Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* @note features section with modern grid */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Mengapa Memilih Aibo?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Teknologi AI terdepan yang dirancang untuk memahami dan membantu
                Anda dengan cara yang natural.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-background/50">
                <CardContent className="p-8">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="size-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Percakapan Natural
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Berbicara dengan Aibo seperti berbicara dengan teman. AI
                    yang memahami konteks dan nuansa bahasa Indonesia.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-background/50">
                <CardContent className="p-8">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Zap className="size-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Respons Instan</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Dapatkan jawaban dalam hitungan detik. Infrastruktur cloud
                    yang andal memastikan kecepatan optimal.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-background/50">
                <CardContent className="p-8">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Shield className="size-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Privasi Terjamin
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Data Anda adalah milik Anda. Enkripsi end-to-end dan
                    kebijakan privasi yang ketat melindungi informasi Anda.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* @note cta section */}
        <section className="py-20 px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 p-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Siap Memulai Percakapan?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan pengguna yang sudah merasakan
                pengalaman AI terbaik dengan Aibo.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="px-8 py-3 text-base group">
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
