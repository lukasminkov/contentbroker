import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, 
  SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, 
  SidebarTrigger, SidebarHeader } from "@/components/ui/sidebar"
import { Home, List } from "lucide-react"
import { Outlet, useLocation } from "react-router-dom"

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