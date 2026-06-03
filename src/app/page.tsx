"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-20 flex items-center border-b border-border-light bg-bg-secondary/70 glass sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-2xl tracking-tighter text-primary">ApplyFlow</span>
          <span className="font-bold text-2xl tracking-tighter text-text-primary ml-1">AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors text-text-secondary" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors text-text-secondary" href="#how-it-works">
            How it Works
          </Link>
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48 xl:py-56 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
          
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <motion.div 
              className="flex flex-col items-center space-y-8 text-center"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <div className="space-y-4 max-w-3xl">
                <motion.h1 variants={itemVariants} className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none text-text-primary">
                  Apply To More Jobs In <span className="text-primary relative inline-block">
                    Less Time
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-10 -rotate-2" />
                  </span>
                </motion.h1>
                <motion.p variants={itemVariants} className="mx-auto max-w-[700px] text-text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Upload your CV once and let AI fill recruiter forms automatically while detecting missing information. Built for the modern job seeker.
                </motion.p>
              </div>
              <motion.div variants={itemVariants} className="space-x-4 flex items-center">
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-full px-8 font-semibold shadow-lg shadow-primary/20">Start For Free</Button>
                </Link>
                <Link href="#demo">
                  <Button variant="outline" size="lg" className="rounded-full px-8 bg-bg-secondary/50 backdrop-blur-sm">Watch Demo</Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
        <section id="features" className="w-full py-24 bg-bg-secondary">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary">Smart Resume Parsing</h3>
                <p className="text-text-secondary">Extract all your data from your CV instantly using advanced AI. We build your profile automatically.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a2 2 0 1 0 3-3z"/><path d="M3 4h8S3 11 3 16"/></svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary">Autofill Forms</h3>
                <p className="text-text-secondary">Our AI understands recruiter forms and matches them with your profile to autofill everything in seconds.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary">Missing Info Detection</h3>
                <p className="text-text-secondary">Never miss a required field. The system prompts you for any information missing from your profile.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border-light bg-bg-secondary">
        <p className="text-xs text-text-secondary">© 2026 ApplyFlow AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-text-secondary" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-text-secondary" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
