import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Brain } from 'lucide-react'

export default function Navbar() {
	return (
		<header className="fixed inset-x-0 top-4 z-50">
			<div className="mx-auto w-full max-w-5xl px-4">
				<div className="flex h-14 items-center justify-between rounded-full border border-border/60 bg-background/80 px-4 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<Link href="/" className="flex items-center gap-2">
						<div aria-label="Aibo" className="size-7 rounded-md bg-primary flex items-center justify-center">
							<Brain className="size-4 text-primary-foreground" />
						</div>
						<span className="text-lg font-semibold tracking-tight">Aibo</span>
					</Link>
					<nav className="hidden items-center gap-6 sm:flex text-sm text-muted-foreground">
						<Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
					</nav>
					<div className="flex items-center gap-2">
						<Button asChild>
							<Link href="/dashboard">Coba Sekarang</Link>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
