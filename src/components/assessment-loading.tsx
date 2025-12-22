"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

export default function AssessmentLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-6 bg-gradient-to-b from-background via-background to-muted/10">
      <div className="max-w-md mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-3xl p-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-[var(--typecircle-green)]/10 border-2 border-[var(--typecircle-green)]/20"
          >
            <Brain className="w-10 h-10 text-[var(--typecircle-green)]" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold mb-4 text-foreground"
          >
            Analyzing Your Results
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mb-6"
          >
            Processing your responses to determine your Enneagram type...
          </motion.p>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring", bounce: 0.5 }}
            className="flex justify-center space-x-1"
          >
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}