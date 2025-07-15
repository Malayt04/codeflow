"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./button";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-transparent absolute top-0 left-0 right-0 z-20"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
              <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
              CodeFlow
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              AI-Powered Builder
            </span>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          {/* Pricing Link */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/pricing">
              <Button
                variant="ghost"
                className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Pricing
              </Button>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {theme === "light" ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SunIcon className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MoonIcon className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300" />

              <span className="sr-only">Toggle theme</span>
            </Button>
          </motion.div>

          <SignedOut>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <SignInButton>
                <Button
                  variant="ghost"
                  className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </Button>
              </SignInButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <SignInButton>
                <Button className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Sign Up
                </Button>
              </SignInButton>
            </motion.div>
          </SignedOut>
          <SignedIn>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <UserButton />
            </motion.div>
          </SignedIn>
        </div>
      </div>
    </motion.header>
  );
}
