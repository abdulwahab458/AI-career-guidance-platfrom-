import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

const Noquiz = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-6">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 8 }}
        className="relative"
      >
        <div className="absolute -inset-6 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg">
          <Brain className="h-10 w-10" />
        </div>
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent"
      >
        No quizzes taken yet
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground max-w-md"
      >
        Start your first quiz and track your progress as you improve your skills.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/interprep/mock">
          <Button size="lg" className="mt-4 text-lg">
            <Sparkles className="mr-2 h-5 w-5" />
            Start Quiz Now
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

export default Noquiz
