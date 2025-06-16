"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import isAuthenticated from "@/components/utils/authUtils";
import { BookOpen, Brain, Target, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Interactive Flash Cards",
      description:
        "Create and study with smart flash cards that adapt to your learning pace.",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Smart Learning",
      description:
        "AI-powered system tracks your progress and focuses on areas that need improvement.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal Tracking",
      description:
        "Set learning goals and track your progress with detailed analytics and insights.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Quick Review",
      description:
        "Efficient spaced repetition system helps you retain information longer.",
    },
  ];

  return (
    <div className="min-h-screen bg-card">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 text-sm font-medium">
            🚀 Learn Smarter, Not Harder
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            E-Study
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Master English vocabulary with intelligent flash cards, personalized
            learning paths, and comprehensive progress tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href={isAuth ? "/dashboard" : "/login"}>Get Started →</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 text-blue-300">{feature.icon}</div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-gray-300">Vocabulary Words</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-gray-300">Retention Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-300">Learning Access</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who have improved their English
            vocabulary with E-Study's proven learning system.
          </p>
          <Button asChild size="lg" className="text-lg px-10 py-4">
            <Link href="/dashboard">Start Learning Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
