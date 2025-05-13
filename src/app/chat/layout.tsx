import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-muted/5">
        <AppSidebar />
        <main className="flex-1 h-full overflow-hidden relative">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
