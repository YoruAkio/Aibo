import { Brain } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border bg-background/80 backdrop-blur-md mt-auto">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              aria-label="Aibo"
              className="size-10 rounded-lg bg-primary flex items-center justify-center"
            >
              <Brain className="size-6 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-foreground text-sm">Aibo</p>
              <p className="text-xs text-muted-foreground">Asisten AI cerdas</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {year} Aibo. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">Seleksi AVR 2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
