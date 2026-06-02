import Link from "next/link"
import { LayoutDashboard, FileText, UploadCloud, History, Settings, LogOut } from "lucide-react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={`flex h-full w-64 flex-col border-r border-border-light bg-bg-secondary ${className}`}>
      <div className="flex h-16 items-center px-6 border-b border-border-light">
        <Link className="flex items-center" href="/">
          <span className="font-bold text-xl tracking-tight text-primary">ApplyFlow</span>
          <span className="font-bold text-xl tracking-tight text-text-primary ml-1">AI</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-primary transition-all hover:bg-primary/15"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-text-secondary transition-all hover:text-text-primary hover:bg-bg-primary"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Candidate Profile</span>
          </Link>
          <Link
            href="/dashboard/forms"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-text-secondary transition-all hover:text-text-primary hover:bg-bg-primary"
          >
            <UploadCloud className="h-4 w-4" />
            <span className="text-sm font-medium">Recruiter Forms</span>
          </Link>
          <Link
            href="/dashboard/history"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-text-secondary transition-all hover:text-text-primary hover:bg-bg-primary"
          >
            <History className="h-4 w-4" />
            <span className="text-sm font-medium">Application History</span>
          </Link>
        </nav>
      </div>
      <div className="border-t border-border-light p-4">
        <nav className="grid gap-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-text-secondary transition-all hover:text-text-primary hover:bg-bg-primary"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-error transition-all hover:bg-error/10">
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
