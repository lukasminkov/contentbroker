import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Campaigns from "@/pages/dashboard/Campaigns"
import CampaignDetails from "@/pages/dashboard/CampaignDetails"
import CampaignApplication from "@/pages/dashboard/CampaignApplication"
import Home from "@/pages/dashboard/Home"
import LandingPage from "@/pages/LandingPage"
import Creator from "@/pages/auth/Creator"
import OnboardingForm from "@/components/onboarding/OnboardingForm"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/creator" element={<Creator />} />
              <Route path="/onboarding" element={<OnboardingForm />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Home />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="campaigns/:id" element={<CampaignDetails />} />
                <Route path="campaigns/:id/apply" element={<CampaignApplication />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App