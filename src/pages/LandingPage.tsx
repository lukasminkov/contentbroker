import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, DollarSign, Users, Star, TrendingUp } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            contentbroker.io
          </h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/auth/creator">
              <Button variant="ghost">Creator Login</Button>
            </Link>
            <Link to="/auth/brand">
              <Button variant="ghost">Brand Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-400 to-pink-500 bg-clip-text text-transparent animate-fadeIn">
          Get paid (more) for your content.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-slideIn">
          Connect with top brands, negotiate better deals, and maximize your earning potential.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/auth/creator">
            <Button size="lg" className="group">
              Join as Creator
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/auth/brand">
            <Button size="lg" variant="secondary" className="group">
              Join as Brand
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Higher Earnings</h3>
            <p className="text-muted-foreground">
              Negotiate better rates and unlock premium brand partnerships.
            </p>
          </div>
          <div className="bg-card p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Brand Connections</h3>
            <p className="text-muted-foreground">
              Connect directly with brands looking for creators like you.
            </p>
          </div>
          <div className="bg-card p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Growth Tools</h3>
            <p className="text-muted-foreground">
              Access analytics and insights to grow your creator business.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-card rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-400/20 opacity-50" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to earn more?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already maximizing their earnings through our platform.
            </p>
            <Link to="/auth/creator">
              <Button size="lg" className="group">
                Get Started Now
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-muted">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">
            © 2024 Creator Connector. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage