import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, 
  SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, 
  SidebarTrigger, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar"
import { Home, List, Settings, CreditCard, User, AlertCircle } from "lucide-react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

const menuItems = [
  {
    title: "Home",
    icon: Home,
    path: "/dashboard"
  },
  {
    title: "Campaigns",
    icon: List,
    path: "/dashboard/campaigns"
  }
]

const DashboardLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Fetch user profile data
  const { data: profile, error: profileError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      console.log('Fetching profile data...')
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.log('No session found')
        throw new Error('No session')
      }

      console.log('Session found, fetching profile for user:', session.user.id)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        throw error
      }

      console.log('Profile data:', data)
      return data
    }
  })

  // If no profile exists, redirect to auth
  useEffect(() => {
    if (profileError || !profile) {
      console.log('No profile found, redirecting to auth')
      navigate('/auth/creator')
    }
  }, [profile, profileError, navigate])

  // Debug log for profile completion status
  useEffect(() => {
    if (profile) {
      console.log('Profile completion status:', {
        profile_completed: profile.profile_completed,
        typeof: typeof profile.profile_completed
      })
    }
  }, [profile])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background p-4">
        <Sidebar variant="floating" collapsible="icon" className="rounded-xl bg-card/95 shadow-xl">
          <SidebarHeader className="relative flex h-14 items-center">
            <div className="flex items-center gap-2 px-3">
              {/* Logo placeholder */}
              <div className="h-8 w-8 rounded bg-muted/20"></div>
              <span className="font-semibold group-data-[collapsible=icon]:hidden">ContentBroker</span>
            </div>
            <SidebarTrigger className="absolute right-2 top-1/2 -translate-y-1/2" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        tooltip={item.title}
                        className={location.pathname === item.path ? 
                          "relative bg-primary/10 text-primary before:absolute before:-left-3 before:top-1/2 before:h-7 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-primary" : ""}
                      >
                        <a href={item.path}>
                          <item.icon className="shrink-0" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-2">
            <div className="space-y-4">
              {/* Profile completion alert - Only show if profile is not completed */}
              {profile && profile.profile_completed === false && (
                <div className="px-3">
                  <Alert variant="destructive" className="bg-destructive/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Complete your profile to apply for campaigns
                      <Button
                        variant="link"
                        className="h-auto p-0 text-xs"
                        onClick={() => navigate('/onboarding')}
                      >
                        Complete Now
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              
              {/* Creator tier badge */}
              {profile && (
                <div className="px-3">
                  <Badge variant="outline" className="w-full justify-center py-1 font-semibold">
                    {profile.tier?.toUpperCase()} CREATOR
                  </Badge>
                </div>
              )}
              
              {/* Profile section */}
              {profile && (
                <div className="space-y-1">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Profile">
                        <a href="/dashboard/profile" className="!h-auto py-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={profile.profile_picture_url} />
                              <AvatarFallback className="bg-muted">
                                {profile.first_name?.[0]}
                                {profile.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-medium">
                                {profile.first_name} {profile.last_name}
                              </span>
                              <span className="text-xs text-muted-foreground">View profile</span>
                            </div>
                          </div>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Settings">
                        <a href="/dashboard/settings">
                          <Settings className="shrink-0" />
                          <span>Settings</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Billing">
                        <a href="/dashboard/billing">
                          <CreditCard className="shrink-0" />
                          <span>Billing</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </div>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout