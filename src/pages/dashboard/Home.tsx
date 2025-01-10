import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Users, ArrowRight } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Link } from "react-router-dom"

interface Campaign {
  id: string
  name: string
  status: string
  amount: number
  transaction_type: string
  created_at: string
}

const Home = () => {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Campaign[]
    }
  })

  const totalRetainers = campaigns?.reduce((sum, campaign) => 
    campaign.transaction_type === 'retainer' ? sum + Number(campaign.amount) : sum, 0) || 0

  const activeCampaigns = campaigns?.filter(c => c.status === 'ongoing') || []

  // Get featured campaigns for preview
  const featuredCampaigns = campaigns?.slice(0, 4) || []

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Retainers</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRetainers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Active monthly retainers
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently running campaigns
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              Joined this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center text-muted-foreground">Loading campaigns...</div>
            ) : activeCampaigns.length === 0 ? (
              <div className="text-center text-muted-foreground">No active campaigns</div>
            ) : (
              activeCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{campaign.name}</p>
                    <Badge 
                      variant={campaign.status === 'ongoing' ? 'default' : 'secondary'}
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${Number(campaign.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Find Campaigns */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Find Campaigns</CardTitle>
          <Link to="/dashboard/campaigns">
            <Button variant="ghost" className="text-primary hover:text-primary-hover">
              Explore All Campaigns <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCampaigns.map((campaign) => (
              <div key={campaign.id} className="group relative rounded-lg border p-4 hover:border-primary transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${campaign.id}`} />
                    <AvatarFallback>CP</AvatarFallback>
                  </Avatar>
                  <div className="truncate">
                    <h4 className="font-medium truncate">{campaign.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${Number(campaign.amount).toLocaleString()} / month
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="absolute top-2 right-2">
                  {campaign.transaction_type}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Connect with creators and find new campaign opportunities
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Home