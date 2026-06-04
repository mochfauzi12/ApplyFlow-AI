"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, Variants } from "framer-motion"
import dynamic from "next/dynamic"

// Dynamically import ReactPlayer to prevent hydration mismatch on SSR
const ReactPlayer: any = dynamic(() => import("react-player"), { ssr: false })

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-primary/30">
      
      {/* 1. Fixed Video Background */}
      <div className="fixed inset-0 w-full h-full -z-50 pointer-events-none bg-black">
        <ReactPlayer
          url="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" // Placeholder Public HLS Video
          playing
          loop
          muted
          playsinline
          width="100%"
          height="100%"
          style={{ objectFit: "cover", position: "absolute", top: 0, left: 0 }}
          config={{
            file: {
              attributes: {
                style: { objectFit: 'cover', width: '100%', height: '100%' }
              }
            }
          } as any}
        />
        {/* Gradient Overlays for maximum text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      </div>

      {/* 2. Glassmorphic Header */}
      <header className="fixed top-0 w-full px-6 lg:px-12 h-20 flex items-center justify-between z-50 backdrop-blur-md bg-white/5 border-b border-white/10 transition-all duration-300">
        <Link className="flex items-center group" href="/">
          <span className="font-bold text-2xl tracking-tighter text-white drop-shadow-md group-hover:text-white/90 transition-colors">ApplyFlow</span>
          <span className="font-bold text-2xl tracking-tighter text-primary ml-1 drop-shadow-md group-hover:text-primary-hover transition-colors">AI</span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          <Link className="text-sm font-medium text-white/70 hover:text-white transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-white/70 hover:text-white transition-colors" href="#how-it-works">
            How it Works
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-full px-6">Sign In</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary-hover text-white border-0 shadow-[0_0_20px_rgba(124,58,237,0.3)] rounded-full px-6">Get Started</Button>
          </Link>
        </nav>
        {/* Mobile Header Buttons */}
        <div className="md:hidden flex items-center gap-4">
           <Link href="/dashboard">
            <Button size="sm" className="bg-primary text-white border-0 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.4)]">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* 3. Main Content - Hero (Bottom Left) */}
      <main className="relative z-10 w-full h-screen flex items-end pb-24 md:pb-32 px-6 lg:px-16">
        <motion.div 
          className="flex flex-col items-start space-y-6 text-left max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-md shadow-lg shadow-black/20">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-3 animate-pulse"></span>
            The New Standard in Recruiting
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-white drop-shadow-xl leading-[1.1]">
            Apply To More Jobs In <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-300">
              Less Time
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="max-w-[650px] text-white/70 text-lg md:text-xl leading-relaxed drop-shadow-md">
            Upload your CV once and let AI fill recruiter forms automatically while detecting missing information. Built for the modern job seeker.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 pt-6 w-full sm:w-auto">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-10 py-7 text-lg font-semibold bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300 border-0 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                Start For Free
              </Button>
            </Link>
            <Link href="#demo" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-10 py-7 text-lg font-medium border-white/20 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-300">
                Watch Demo
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* 4. Scrollable Features Content Over Video */}
      <div className="relative z-10 bg-black/70 backdrop-blur-[40px] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <section id="features" className="w-full py-32 px-6 lg:px-16 mx-auto container">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Why ApplyFlow?</h2>
            <p className="text-white/60 text-xl leading-relaxed">Stop wasting hours typing the same information. Let our AI handle the tedious parts of your job hunt so you can focus on the interviews.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
             {/* Feature 1 */}
             <div className="flex flex-col space-y-5 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 group">
               <div className="h-16 w-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
               </div>
               <h3 className="text-2xl font-bold text-white tracking-tight">Smart Parsing</h3>
               <p className="text-white/60 leading-relaxed">Extract all your data from your CV instantly using advanced AI. We build your profile automatically.</p>
             </div>
             {/* Feature 2 */}
             <div className="flex flex-col space-y-5 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 group">
               <div className="h-16 w-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a2 2 0 1 0 3-3z"/><path d="M3 4h8S3 11 3 16"/></svg>
               </div>
               <h3 className="text-2xl font-bold text-white tracking-tight">Autofill Forms</h3>
               <p className="text-white/60 leading-relaxed">Our AI understands recruiter forms and matches them with your profile to autofill everything in seconds.</p>
             </div>
             {/* Feature 3 */}
             <div className="flex flex-col space-y-5 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300 group">
               <div className="h-16 w-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                 <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
               </div>
               <h3 className="text-2xl font-bold text-white tracking-tight">Info Detection</h3>
               <p className="text-white/60 leading-relaxed">Never miss a required field. The system prompts you for any information missing from your profile.</p>
             </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10 bg-black/50">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tighter text-white">ApplyFlow</span>
              <span className="font-bold text-lg tracking-tighter text-primary">AI</span>
            </div>
            <p className="text-sm text-white/40">© 2026 ApplyFlow AI. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Twitter</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
