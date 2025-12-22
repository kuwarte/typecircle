"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function RoomsLoading() {
  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background via-background to-muted/10">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-8 mb-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--typecircle-green)]/5 via-transparent to-blue-500/5 pointer-events-none" />
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20"
            >
              <MessageCircle className="w-8 h-8 text-[var(--typecircle-green)]" />
            </motion.div>
            <h1 className="text-3xl font-semibold mb-4 text-foreground">
              Loading Community Rooms
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Fetching available rooms and your communities...
            </p>
            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-[var(--typecircle-green)] rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>

        <div className="space-y-16">
          <div>
            <div className="h-6 bg-muted/20 rounded w-32 mb-6 animate-pulse" />
            <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-muted/20 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted/20 rounded w-20 mb-3" />
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-muted/20 rounded w-16" />
                    <div className="h-6 bg-muted/20 rounded w-12" />
                  </div>
                  <div className="h-8 bg-muted/20 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}