import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="fixed top-3 sm:top-4 md:top-4 lg:top-6 right-3 sm:right-4 md:right-4 lg:right-6 z-50 flex items-center gap-2 sm:gap-3 md:gap-4">
        <Link
          href="/about"
          className="text-xs sm:text-xs md:text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          About Caregene
        </Link>
        <Button
          asChild
          size="sm"
          variant="ghost"
          className="p-1.5 sm:p-2 md:p-2 lg:p-2.5 hover:bg-accent"
          title="Sign in"
        >
          <Link href="/signin">
            <User className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-5 lg:w-5" />
          </Link>
        </Button>
      </div>
      <main className="ml-0 sm:ml-12 md:ml-12 lg:ml-14 xl:ml-16">
        <HeroSection />
      </main>
    </div>
  )
}
