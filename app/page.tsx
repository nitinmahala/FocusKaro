"use client";

import { motion, Variants } from "framer-motion";
import { CheckCircle, Clock, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25, delayChildren: 0.2 },
    },
  };

  const item: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
          Boost Your Productivity
        </h1>
        <p className="text-lg md:text-xl text-gray-400">
          A simple, elegant dashboard to help you stay focused and organized.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
      >
        <FeatureCard
          variants={item}
          href="/tasks"
          icon={<CheckCircle className="h-12 w-12 mb-4 text-emerald-300" />}
          title="Task Tracker"
          description="Organize your tasks and track your progress"
          color="from-emerald-800/40 to-emerald-700/20"
          glow="shadow-emerald-400/30"
        />
        <FeatureCard
          variants={item}
          href="/timer"
          icon={<Clock className="h-12 w-12 mb-4 text-blue-300" />}
          title="Pomodoro Timer"
          description="Stay focused with timed work sessions"
          color="from-blue-800/40 to-blue-700/20"
          glow="shadow-blue-400/30"
        />
        <FeatureCard
          variants={item}
          href="/notes"
          icon={<FileText className="h-12 w-12 mb-4 text-purple-300" />}
          title="Notes"
          description="Capture your thoughts and ideas"
          color="from-purple-800/40 to-purple-700/20"
          glow="shadow-purple-400/30"
        />
      </motion.div>
    </div>
  );
}

interface FeatureCardProps {
  variants: Variants;
  href: string;
  icon: JSX.Element;
  title: string;
  description: string;
  color: string;
  glow?: string;
}

function FeatureCard({ variants, href, icon, title, description, color, glow }: FeatureCardProps) {
  return (
    <motion.div variants={variants}>
      <Link href={href} prefetch={false} className="block h-full">
        <div
          className={`flex flex-col items-center p-6 h-full rounded-xl border border-gray-700 bg-gradient-to-br ${color} backdrop-blur-md ${glow} shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105`}
        >
          {icon}
          <h2 className="text-xl font-semibold mb-2 text-white">{title}</h2>
          <p className="text-gray-400 mb-4 text-center">{description}</p>
          <Button variant="ghost" className="mt-auto group text-gray-300 hover:text-white">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
