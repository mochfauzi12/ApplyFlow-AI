import { Sidebar } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 overflow-auto">
        <header className="flex h-16 items-center border-b border-border-light bg-bg-secondary px-6 md:hidden">
          <span className="font-bold text-xl tracking-tight text-primary">ApplyFlow</span>
          <span className="font-bold text-xl tracking-tight text-text-primary ml-1">AI</span>
        </header>
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
