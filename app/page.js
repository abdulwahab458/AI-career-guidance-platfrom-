"use client"

import { cn } from "@/lib/utils"
import Hero from "@/components/Hero"
import Features from "@/components/Features"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="relative w-full bg-white dark:bg-black overflow-x-hidden">
      {/* 🟣 Background grid pattern */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

      {/* 🟡 Radial mask for fade effect */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_25%,black)]"></div>

      {/* 🌟 Floating gradient orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute top-20 -right-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-3xl" />

      {/* 🔵 Main content */}
      <main className="relative z-10 flex flex-col items-center mx-auto px-6 sm:px-10 py-24 sm:py-32 space-y-32">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl"
        >
          <Hero />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" className="text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Learn More
            </Button>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full max-w-6xl px-4 sm:px-6"
        >
          <Features />
        </motion.section>

        {/* 💬 Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full max-w-6xl text-center space-y-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
            Loved by professionals everywhere
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alicia W.",
                role: "Software Engineer",
                text: "This resume builder helped me land my dream job. It's clean, intuitive, and so fast to use!",
              },
              {
                name: "Jordan P.",
                role: "UI/UX Designer",
                text: "The dark mode and live preview are game-changers. Finally a resume tool that looks good and works great.",
              },
              {
                name: "Sam R.",
                role: "Data Analyst",
                text: "The Markdown editing and PDF export are smooth. It’s become my go-to for quick professional resumes.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 p-6 shadow-sm transition-all"
              >
                <p className="text-neutral-600 dark:text-neutral-300 italic mb-4">
                  “{t.text}”
                </p>
                <div className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                  {t.name}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {t.role}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 🚀 CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          <div className="flex justify-center mb-2">
            <Sparkles className="text-yellow-400 h-6 w-6 animate-pulse" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-clip-text">
            Ready to build your dream resume?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-lg max-w-2xl mx-auto">
            Join thousands of professionals who have already upgraded their career journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button size="lg" className="text-lg">
              Start Building
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Browse Templates
            </Button>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-200 dark:border-neutral-800 py-10 mt-16 w-full text-center text-sm text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()} Mentora — All rights reserved.
      </footer>
    </div>
  )
}
