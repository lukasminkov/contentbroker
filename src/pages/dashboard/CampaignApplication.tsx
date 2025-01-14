import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

const CampaignApplication = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      console.log("Fetching campaign with ID:", id)
      
      if (!id) throw new Error("Campaign ID is required")
      
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single()
      
      if (error) {
        console.error("Error fetching campaign:", error)
        throw error
      }
      
      console.log("Fetched campaign:", data)
      return data
    },
    enabled: !!id,
  })

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("No session found")

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single()

      if (error) throw error
      return data
    }
  })

  if (campaignLoading || profileLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Campaign not found</p>
      </div>
    )
  }

  if (!profile?.profile_completed) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Apply for {campaign.name}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to complete your profile before applying for campaigns.
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/onboarding')}>
              Complete Profile Now
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Apply for {campaign.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Application form coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default CampaignApplication