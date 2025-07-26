"use client";

import {
  IconBallpen,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandParsinta,
  IconBrandTwitter,
  IconBrandYoutube,
  IconDashboard,
  IconHeart,
  IconLibrary,
  IconMail,
  IconMapPin,
  IconMessageChatbot,
  IconPhone,
  IconReportSearch,
  IconScript,
  IconSend,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";
import type { HTMLAttributes } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export default function SiteFooter({
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { title: "Dashboard", href: "/dashboard", icon: IconDashboard },
    { title: "Courses", href: "/courses", icon: IconBrandParsinta },
    { title: "Tests", href: "/tests", icon: IconBallpen },
    { title: "Flashcards", href: "/sets", icon: IconScript },
  ];

  const learningResources = [
    { title: "Blogs", href: "/blogs", icon: IconReportSearch },
    { title: "AI Assistant", href: "/ai", icon: IconMessageChatbot },
    { title: "Test Collections", href: "/test-collections", icon: IconLibrary },
  ];

  const supportLinks = [
    { title: "Help Center", href: "/help" },
    { title: "Contact Us", href: "/contact" },
    { title: "FAQ", href: "/faq" },
    { title: "Community", href: "/community" },
  ];

  const legalLinks = [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Cookie Policy", href: "/cookies" },
    { title: "Accessibility", href: "/accessibility" },
  ];

  const socialLinks = [
    {
      icon: IconBrandFacebook,
      href: "https://facebook.com",
      label: "Facebook",
      color: "hover:bg-blue-500/10 hover:text-blue-600",
    },
    {
      icon: IconBrandTwitter,
      href: "https://twitter.com",
      label: "Twitter",
      color: "hover:bg-sky-500/10 hover:text-sky-600",
    },
    {
      icon: IconBrandInstagram,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:bg-pink-500/10 hover:text-pink-600",
    },
    {
      icon: IconBrandLinkedin,
      href: "https://linkedin.com",
      label: "LinkedIn",
      color: "hover:bg-blue-700/10 hover:text-blue-700",
    },
    {
      icon: IconBrandYoutube,
      href: "https://youtube.com",
      label: "YouTube",
      color: "hover:bg-red-500/10 hover:text-red-600",
    },
    {
      icon: IconBrandGithub,
      href: "https://github.com",
      label: "GitHub",
      color: "hover:bg-gray-500/10 hover:text-gray-600",
    },
  ];

  const features = [
    "AI-Powered Learning",
    "Interactive Courses",
    "Smart Flashcards",
    "Progress Tracking",
    "Community Driven",
    "Mobile Friendly",
  ];

  return (
    <footer
      {...props}
      className="relative mt-24 border-t border-slate-200/60 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:border-slate-800/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      {/* Decorative background elements */}
      <div className="bg-grid-slate-100/50 dark:bg-grid-slate-800/20 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      <div className="relative container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="mb-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Company Info & Newsletter - Enhanced */}
          <div className="lg:col-span-4">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <IconBrandParsinta className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                  EStudy
                </h3>
                <p className="text-muted-foreground text-xs font-medium">
                  English Learning Platform
                </p>
              </div>
            </div>

            <p className="mb-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Master English with intelligent flashcards, personalized learning
              paths, and comprehensive progress tracking.
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {" "}
                Learn smarter, not harder.
              </span>
            </p>

            {/* Enhanced Newsletter Signup */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IconSparkles className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                  Stay Updated
                </h4>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    className="border-slate-200 pr-10 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
                  />
                  <IconMail className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
                >
                  <IconSend className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                🎯 Get weekly learning tips and exclusive content
              </p>
            </div>
          </div>

          {/* Navigation Links - Enhanced */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:col-span-8">
            {/* Quick Links */}
            <div>
              <h4 className="mb-6 flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-800 uppercase dark:text-slate-200">
                <div className="h-1 w-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                Quick Links
              </h4>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-3 text-slate-600 transition-all duration-200 hover:translate-x-1 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                    >
                      <div className="rounded-lg bg-slate-100 p-1.5 transition-colors duration-200 group-hover:bg-blue-100 dark:bg-slate-800 dark:group-hover:bg-blue-900/30">
                        <link.icon className="h-4 w-4 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </div>
                      <span className="font-medium">{link.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Resources */}
            <div>
              <h4 className="mb-6 flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-800 uppercase dark:text-slate-200">
                <div className="h-1 w-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
                Resources
              </h4>
              <ul className="space-y-4">
                {learningResources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-3 text-slate-600 transition-all duration-200 hover:translate-x-1 hover:text-purple-600 dark:text-slate-300 dark:hover:text-purple-400"
                    >
                      <div className="rounded-lg bg-slate-100 p-1.5 transition-colors duration-200 group-hover:bg-purple-100 dark:bg-slate-800 dark:group-hover:bg-purple-900/30">
                        <link.icon className="h-4 w-4 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                      </div>
                      <span className="font-medium">{link.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="mb-6 flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-800 uppercase dark:text-slate-200">
                <div className="h-1 w-6 rounded-full bg-gradient-to-r from-green-600 to-teal-600" />
                Support
              </h4>
              <ul className="mb-6 space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block transform font-medium text-slate-600 duration-200 hover:translate-x-1 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                <p className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                  Legal
                </p>
                <ul className="space-y-2">
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-xs text-slate-500 transition-colors duration-200 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Contact Section */}
        <div className="mb-12 rounded-2xl border border-slate-200/60 bg-gradient-to-r from-blue-50 to-purple-50 p-8 shadow-sm dark:border-slate-700/60 dark:from-slate-800/50 dark:to-slate-800/30">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-2">
              <IconMail className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Get in Touch
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md transition-shadow duration-200 group-hover:shadow-lg dark:bg-slate-700">
                <IconMail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Email
                </p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  hello@estudy.com
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md transition-shadow duration-200 group-hover:shadow-lg dark:bg-slate-700">
                <IconPhone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Phone
                </p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md transition-shadow duration-200 group-hover:shadow-lg dark:bg-slate-700">
                <IconMapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Address
                </p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  San Francisco, CA
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-8 bg-slate-200 dark:bg-slate-700" />

        {/* Enhanced Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span>© {currentYear} EStudy. Made with</span>
            <IconHeart className="h-4 w-4 animate-pulse fill-current text-red-500" />
            <span>for English learners worldwide</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <span className="mr-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              Follow us:
            </span>
            <div className="flex items-center gap-1">
              {socialLinks.map((social) => (
                <Button
                  key={social.href}
                  variant="ghost"
                  size="sm"
                  className={`h-10 w-10 rounded-xl p-0 transition-all duration-200 ${social.color}`}
                  asChild
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Features Highlight */}
        <div className="mt-12 border-t border-slate-200/60 pt-8 dark:border-slate-700/60">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
              <IconSparkles className="h-4 w-4" />
              Advanced English Learning Platform
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {features.map((feature, index) => (
                <span
                  key={feature}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
