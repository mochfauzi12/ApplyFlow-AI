import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, FileText, CheckCircle, Wand2 } from "lucide-react"
import { ResumeUploaderCard } from "./resume-uploader"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Welcome back, User</h1>
        <p className="text-text-secondary mt-1">Here is an overview of your application progress.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forms Assisted</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-text-secondary mt-1">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-info"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 hrs</div>
            <p className="text-xs text-text-secondary mt-1">Average 12 mins per form</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completeness</CardTitle>
            <FileText className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-text-secondary mt-1">2 missing fields detected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ResumeUploaderCard />

        <Link href="/dashboard/recruiter-forms" className="block h-full">
          <Card className="flex flex-col items-center justify-center p-8 text-center bg-primary/5 border-2 border-primary/20 hover:border-primary/50 transition-all cursor-pointer group shadow-sm h-full relative overflow-hidden">
            <div className="absolute top-4 left-4 bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-xs tracking-wider">
              STEP 2: AUTOMATE
            </div>
            <div className="rounded-full bg-primary/10 p-4 mb-4 group-hover:scale-110 transition-transform mt-4">
              <Wand2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold text-xl text-text-primary mb-2">Autofill New Form</h3>
            <p className="text-sm text-text-secondary mb-4">Upload a blank recruiter's form here and let the AI fill it out automatically using the data from Step 1.</p>
            <Button className="pointer-events-none">Start Autofill Process</Button>
          </Card>
        </Link>
      </div>
    </div>
  )
}
