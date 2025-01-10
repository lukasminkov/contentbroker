import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { DollarSign, Video, Sparkles, Gift } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const categories = [
  "All",
  "Fashion",
  "Beauty",
  "Technology",
  "Home",
  "Food",
  "Health",
  "Other"
]

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'tiktok shop':
    case 'tiktok':
      return <Video className="h-5 w-5" />
    case 'instagram':
      return <Instagram className="h-5 w-5" />
    default:
      return null
  }
}

const CampaignCard = ({ campaign }: { campaign: any }) => {
  console.log("Campaign data:", campaign)
  const totalCommission = campaign.base_commission + campaign.commission_boost

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={campaign.product_image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f"} 
          alt={campaign.product_name}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader className="space-y-3">
        <div className="flex flex-col space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{campaign.brand_name}</CardTitle>
              <p className="text-sm text-muted-foreground">{campaign.product_name}</p>
            </div>
            <div className="flex flex-col gap-2 ml-2 shrink-0">
              <Badge 
                variant={campaign.campaign_type === 'retainer' ? 'default' : 'secondary'}
                className={campaign.campaign_type === 'incentive' ? 'bg-orange-500 hover:bg-orange-600' : ''}
              >
                {campaign.campaign_type === 'retainer' ? (
                  <DollarSign className="mr-1 h-3 w-3" />
                ) : (
                  <Sparkles className="mr-1 h-3 w-3" />
                )}
                {campaign.campaign_type === 'retainer' ? 'Retainer' : 'Incentive'}
              </Badge>
              {campaign.free_samples && (
                <Badge variant="outline" className="bg-accent/10">
                  <Gift className="mr-1 h-3 w-3" />
                  Free Sample
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Commission</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{totalCommission}%</span>
              {campaign.commission_boost > 0 && (
                <span className="text-sm text-emerald-500">
                  (+{campaign.commission_boost}%)
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between min-h-[24px]">
            <span className="text-sm text-muted-foreground">
              {campaign.campaign_type === 'retainer' 
                ? 'Retainer' 
                : 'Prizes'}
            </span>
            <span className="font-medium text-emerald-500">
              {campaign.campaign_type === 'retainer' 
                ? `$${campaign.retainer_min} - $${campaign.retainer_max}`
                : campaign.prizes ? 'Yes' : 'No'
              }
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Platform</span>
            {getPlatformIcon(campaign.platform)}
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Deliverables</h4>
            <div className="space-y-2">
              <div className="bg-muted/20 p-2 rounded-md">
                <p className="text-sm font-medium">
                  {campaign.videos_per_day} video{campaign.videos_per_day > 1 ? 's' : ''} per day
                </p>
                <p className="text-xs text-muted-foreground">
                  For {campaign.campaign_duration_days} days (Total: {campaign.videos_per_day * campaign.campaign_duration_days} videos)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            asChild 
            variant="outline" 
            className="flex-1 bg-transparent hover:bg-transparent hover:text-primary transition-colors"
          >
            <a href={`/dashboard/campaigns/${campaign.id}`}>Learn More</a>
          </Button>
          <Button asChild className="flex-1">
            <a href={`/dashboard/campaigns/${campaign.id}/apply`}>Apply</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const Campaigns = () => {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")

  const { data: campaignsData, isLoading } = useQuery({
    queryKey: ["campaigns", search, category],
    queryFn: async () => {
      console.log("Fetching campaigns with:", { search, category })
      let query = supabase
        .from("campaigns")
        .select(`
          *,
          deliverables (
            id,
            title,
            description,
            due_date,
            status
          )
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false })

      if (search) {
        query = query.or(`brand_name.ilike.%${search}%,product_name.ilike.%${search}%`)
      }

      if (category !== "All") {
        query = query.eq("category", category)
      }

      const { data, error } = await query
      
      if (error) {
        console.error("Error fetching campaigns:", error)
        throw error
      }
      
      console.log("Fetched campaigns with deliverables:", data)
      return data
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 md:max-w-sm">
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video w-full bg-muted" />
              <CardHeader>
                <div className="h-6 w-2/3 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 w-full rounded bg-muted" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : campaignsData?.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-card/50">
          <p className="text-center text-muted-foreground">
            No campaigns found. Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaignsData?.map((campaign) => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Campaigns
