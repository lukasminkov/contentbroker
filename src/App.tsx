import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Campaigns from "@/pages/dashboard/Campaigns"
import CampaignDetails from "@/pages/dashboard/CampaignDetails"
import CampaignApplication from "@/pages/dashboard/CampaignApplication"
import Home from "@/pages/dashboard/Home"

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
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="campaigns/:id" element={<CampaignDetails />} />
            <Route path="campaigns/:id/apply" element={<CampaignApplication />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App