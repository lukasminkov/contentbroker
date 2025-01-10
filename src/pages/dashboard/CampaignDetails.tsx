import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"

const CampaignDetails = () => {
  const { id } = useParams()
  
  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single()
      
      if (error) throw error
      return data
    },
  })

  if (isLoading) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{campaign.name}</h1>
        <Button asChild>
          <a href={`/dashboard/campaigns/${id}/apply`}>Apply Now</a>
        </Button>
      </div>

      <Card>
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={campaign.product_image_url} 
            alt={campaign.product_name}
            className="h-full w-full object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Brand</p>
              <CardTitle className="text-2xl">{campaign.brand_name}</CardTitle>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Product</p>
              <p className="text-lg font-medium">{campaign.product_name}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Retainer Range</p>
              <p className="text-lg font-medium text-emerald-500">
                ${campaign.retainer_min} - ${campaign.retainer_max}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Platform</p>
              <p className="text-lg font-medium">{campaign.platform}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-lg font-medium">{campaign.campaign_duration_days} days</p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">About the Campaign</h3>
            <p className="text-muted-foreground">{campaign.about}</p>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-medium">Requirements</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground">• {campaign.videos_per_day} videos per day</p>
              <p className="text-muted-foreground">
                • Applications open until {format(new Date(campaign.application_end_date), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CampaignDetails