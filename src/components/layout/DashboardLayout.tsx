import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, 
  SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, 
  SidebarTrigger, SidebarHeader } from "@/components/ui/sidebar"
import { Home, DollarSign, MessageSquare, BookOpen, List } from "lucide-react"
import { Outlet } from "react-router-dom"

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
  },
  {
    title: "Commissions",
    icon: DollarSign,
    path: "/dashboard/commissions"
  },
  {
    title: "Chat",
    icon: MessageSquare,
    path: "/dashboard/chat"
  },
  {
    title: "Resources",
    icon: BookOpen,
    path: "/dashboard/resources"
  }
]

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="relative flex h-14 items-center px-4">
            <div className="flex items-center gap-2">
              {/* Logo placeholder */}
              <div className="h-8 w-8 rounded bg-muted/20"></div>
              <span className="font-semibold group-data-[collapsible=icon]:hidden">ContentBroker</span>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 group-data-[collapsible=icon]:hidden">
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a href={item.path}>
                          <item.icon className="shrink-0" />
                          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
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