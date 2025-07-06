

import {  Home, IdCardLanyard,  ListCheck, ListChecks, LogOut, UserRoundCheck, } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Employees",
    url: "/dashboard/employee",
    icon: IdCardLanyard,
  },
  {
    title: "Tasks",
    url: "/dashboard/task",
    icon: ListChecks,
  },
  {
    title: "Attendance Logs",
    url: "/dashboard/attendance-logs",
    icon: UserRoundCheck,
  },
  {
    title: "Logout",
    icon: LogOut,
    logout:true
  },
]

export function AppSidebar() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = () => {
      logout();
      router.push("/login");
    };


  return (
    <Sidebar variant="sidebar" >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold border-b p-8 mb-5">POSHLAKSH</SidebarGroupLabel>
          <SidebarGroupContent >
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.logout ? (
                      <button onClick={handleLogout} className="flex  text-xl items-center text-red-500 py-6 gap-4 w-full">
                        <item.icon  />
                        <span>{item.title}</span>
                      </button>
                    ) : (
                      <a href={item.url}  className="flex text-xl items-center py-6 gap-4">
                        <item.icon  />
                        <span>{item.title}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}