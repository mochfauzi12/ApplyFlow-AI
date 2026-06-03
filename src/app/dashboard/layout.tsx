import { Sidebar } from "@/components/ui/sidebar"
import { MobileHeader } from "@/components/ui/mobile-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary w-full">
      <Sidebar className="hidden md:flex flex-shrink-0" />
      <div className="flex-1 overflow-auto flex flex-col w-full relative">
        <MobileHeader />
        <main className="p-4 md:p-8 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
