import { motion } from "motion/react";

export function InitWelcomeMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full items-center justify-center p-8"
    >
      <div className="space-y-4 text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="border-primary h-8 w-8 rounded-full border-2 border-t-transparent"
          />
        </motion.div>
        <h2 className="text-2xl font-semibold">How can I help you today?</h2>
        <p className="text-muted-foreground max-w-md">
          Start a conversation by clicking the microphone button below.
        </p>
      </div>
    </motion.div>
  );
}
