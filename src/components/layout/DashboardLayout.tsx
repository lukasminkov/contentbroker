import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, 
  SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, 
  SidebarTrigger } from "@/components/ui/sidebar"
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
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild tooltip={item.title}>
                        <a href={item.path}>
                          <item.icon />
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
            <SidebarTrigger className="mb-4" />
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout