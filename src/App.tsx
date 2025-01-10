import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Campaigns from "@/pages/dashboard/Campaigns"
import CampaignDetails from "@/pages/dashboard/CampaignDetails"
import CampaignApplication from "@/pages/dashboard/CampaignApplication"
import Home from "@/pages/dashboard/Home"

function App() {
  return (
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
  )
}

export default App