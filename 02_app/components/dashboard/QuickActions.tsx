"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, MessageCircle, PenLine, Compass } from "lucide-react";

interface QuickAction {
  href: string;
  icon: React.ElementType;
  label: string;
  description?: string;
}

const defaultActions: QuickAction[] = [
  {
    href: "/advisor?mode=chances",
    icon: TrendingUp,
    label: "Check Chances",
    description: "See where you stand",
  },
  {
    href: "/advisor",
    icon: MessageCircle,
    label: "Ask Advisor",
    description: "Get personalized help",
  },
  {
    href: "/advisor?mode=profile",
    icon: PenLine,
    label: "Update Profile",
    description: "Add new info",
  },
  {
    href: "/discover",
    icon: Compass,
    label: "Explore",
    description: "Find opportunities",
  },
];

interface QuickActionsProps {
  actions?: QuickAction[];
}

export function QuickActions({ actions = defaultActions }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {actions.map((action) => (
        <Link key={action.href} href={action.href}>
          <button className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-border-subtle rounded-full hover:border-accent-primary hover:bg-accent-surface/30 transition-all">
            <action.icon className="w-4 h-4 text-text-muted group-hover:text-accent-primary transition-colors" />
            <span className="text-sm font-medium text-text-main">{action.label}</span>
          </button>
        </Link>
      ))}
    </div>
  );
}
