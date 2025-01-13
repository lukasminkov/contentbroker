import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, 
  SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, 
  SidebarTrigger, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar"
import { Home, List, Settings, CreditCard, User } from "lucide-react"
import { Outlet, useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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

  // Fetch user profile data
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No session')

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (error) throw error
      return data
    }
  })

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
              {/* Creator tier badge */}
              <div className="px-3">
                <Badge variant="outline" className="w-full justify-center py-1 font-semibold">
                  {profile?.tier?.toUpperCase()} CREATOR
                </Badge>
              </div>
              
              {/* Profile section */}
              <div className="space-y-1">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Profile">
                      <a href="/dashboard/profile" className="!h-auto py-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profile?.profile_picture_url} />
                            <AvatarFallback className="bg-muted">
                              {profile?.first_name?.[0]}
                              {profile?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">
                              {profile?.first_name} {profile?.last_name}
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