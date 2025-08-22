import Link from "next/link"
import { Button } from "../components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to Secure AI WebUI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A modern web interface for secure document analysis and AI chat
        </p>
        <div className="space-x-4">
          <Link href="/auth/signin">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" size="lg">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
