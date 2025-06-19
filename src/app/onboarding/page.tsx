"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  Code,
  Globe,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  Search,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  options: Array<{
    id: string;
    title: string;
    description: string;
    icon: any;
  }>;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "role",
    title: "Who are you?",
    description:
      "Help us personalize your experience by telling us about your role.",
    options: [
      {
        id: "student",
        title: "Student",
        description: "I'm here to learn and grow my skills",
        icon: GraduationCap,
      },
      {
        id: "instructor",
        title: "Instructor",
        description: "I want to teach and share knowledge",
        icon: Users,
      },
    ],
  },
  {
    id: "discovery",
    title: "How did you find us?",
    description: "Help us understand how you discovered our platform.",
    options: [
      {
        id: "search",
        title: "Search Engine",
        description: "Found us through Google, Bing, or other search",
        icon: Search,
      },
      {
        id: "social",
        title: "Social Media",
        description: "Discovered us on social platforms",
        icon: Share2,
      },
      {
        id: "referral",
        title: "Friend or Colleague",
        description: "Someone recommended us to you",
        icon: Users,
      },
      {
        id: "review",
        title: "Review Site",
        description: "Found us through reviews or ratings",
        icon: Star,
      },
      {
        id: "blog",
        title: "Blog or Article",
        description: "Read about us in an article or blog post",
        icon: MessageCircle,
      },
      {
        id: "other",
        title: "Other",
        description: "Found us through another way",
        icon: Globe,
      },
    ],
  },
  {
    id: "useCase",
    title: "What will you use this for?",
    description:
      "Tell us about your primary use case so we can tailor your experience.",
    options: [
      {
        id: "learning",
        title: "Personal Learning",
        description: "Expanding my knowledge and skills",
        icon: BookOpen,
      },
      {
        id: "teaching",
        title: "Teaching Others",
        description: "Creating courses and educational content",
        icon: GraduationCap,
      },
      {
        id: "work",
        title: "Professional Work",
        description: "Using for work-related projects",
        icon: Briefcase,
      },
      {
        id: "development",
        title: "Software Development",
        description: "Building applications and coding projects",
        icon: Code,
      },
      {
        id: "collaboration",
        title: "Team Collaboration",
        description: "Working with colleagues and teams",
        icon: Users,
      },
      {
        id: "research",
        title: "Research & Innovation",
        description: "Exploring new ideas and concepts",
        icon: Lightbulb,
      },
    ],
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const transition = {
  x: { type: "spring" as const, stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

export default function Page() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isCompleting, setIsCompleting] = useState(false);

  const totalSteps = onboardingSteps.length;
  const progressValue = ((currentStep + 1) / totalSteps) * 100;
  const currentStepData = onboardingSteps[currentStep];
  const currentSelection = selections[currentStepData.id];

  const handleOptionSelect = (optionId: string) => {
    setSelections((prev) => ({
      ...prev,
      [currentStepData.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!currentSelection) return;

    setIsCompleting(true);

    try {
      // Simulate API call to save onboarding data
      const loadingToastId = toast.loading("Completing your setup...");

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would typically send the selections to your API
      console.log("Onboarding completed with selections:", selections);

      toast.dismiss(loadingToastId);
      toast.success("Welcome! Your account is ready to use.");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  const getGridCols = () => {
    const optionCount = currentStepData.options.length;
    if (optionCount <= 2) return "md:grid-cols-2";
    if (optionCount <= 4) return "md:grid-cols-2 lg:grid-cols-2";
    return "md:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Progress Section */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span>{Math.round(progressValue)}% complete</span>
          </div>
          <Progress value={progressValue} className="h-3" />
        </motion.div>

        {/* Content Container */}
        <div className="relative overflow-visible min-h-[400px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="space-y-8"
            >
              {/* Header */}
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                  {currentStepData.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {currentStepData.description}
                </p>
              </div>

              {/* Options Grid */}
              <div className={cn("grid gap-6 p-2", getGridCols())}>
                {currentStepData.options.map((option) => {
                  const Icon = option.icon;
                  const isSelected = currentSelection === option.id;

                  return (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                      className="transform-gpu"
                      style={{ transformOrigin: "center center" }}
                    >
                      <Card
                        className={cn(
                          "cursor-pointer transition-all hover:shadow-lg border-2",
                          isSelected
                            ? "ring-2 ring-primary bg-primary/5 shadow-md border-primary"
                            : "hover:bg-muted/50 border-border"
                        )}
                        onClick={() => handleOptionSelect(option.id)}
                      >
                        <CardContent className="flex flex-col items-center space-y-4 p-6">
                          <motion.div
                            className={cn(
                              "rounded-full p-3 transition-colors",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                            animate={{
                              scale: isSelected ? 1.1 : 1,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                          >
                            <Icon className="h-8 w-8" />
                          </motion.div>
                          <div className="text-center space-y-2">
                            <h3 className="font-semibold text-lg">
                              {option.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {option.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <motion.div
          className="flex justify-between pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="min-w-[100px]"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!currentSelection || isCompleting}
            className="min-w-[100px]"
          >
            {isCompleting
              ? "Completing..."
              : currentStep === totalSteps - 1
              ? "Complete Setup"
              : "Continue"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
