"use client";

import { motion } from "framer-motion";
import { MessageCircle, Users } from "lucide-react";

export default function MessageLoading() {
  return (
    <div className="h-screen bg-gradient-to-b from-background via-background to-muted/10 flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm p-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20 flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5 text-[var(--typecircle-green)]" />
          </motion.div>
          <div>
            <div className="h-5 bg-muted/20 rounded w-32 mb-1 animate-pulse" />
            <div className="h-3 bg-muted/20 rounded w-20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 space-y-4 overflow-hidden">
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Users className="w-12 h-12 text-[var(--typecircle-green)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Loading Messages
            </h3>
            <p className="text-muted-foreground">
              Connecting to the room and fetching conversation history...
            </p>
            <div className="flex justify-center space-x-1 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-[var(--typecircle-green)] rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Skeleton Messages */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 bg-muted/20 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-muted/20 rounded w-20 mb-2" />
              <div className="h-4 bg-muted/20 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm p-4">
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-muted/20 rounded-lg animate-pulse" />
          <div className="w-20 h-10 bg-muted/20 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}