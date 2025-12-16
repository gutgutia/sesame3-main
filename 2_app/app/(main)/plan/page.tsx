"use client";

import React, { useState } from "react";
import { Plus, MessageCircle, Archive, Sparkles, ChevronDown, ChevronUp, Check, Target, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/context/ProfileContext";

// =============================================================================
// TYPES
// =============================================================================

interface Goal {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string | null;
  targetDate: string | null;
  description: string | null;
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    dueDate: string | null;
  }>;
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function PlanPage() {
  const [showCompleted, setShowCompleted] = useState(false);
  
  // Use global profile context
  const { profile, isLoading, refreshProfile } = useProfile();
  
  // Extract goals from profile
  const goals: Goal[] = (profile?.goals || []).map(g => ({
    id: g.id,
    title: g.title,
    category: g.category || "general",
    status: g.status || "planning",
    priority: null,
    targetDate: null,
    description: null,
    tasks: (g.tasks || []).map(t => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
      dueDate: null,
    })),
  }));
  
  const refreshGoals = () => {
    refreshProfile();
  };

  // Group goals by status
  const activeGoals = goals.filter(g => g.status === "in_progress");
  const planningGoals = goals.filter(g => g.status === "planning");
  const parkingLotGoals = goals.filter(g => g.status === "parking_lot");
  const completedGoals = goals.filter(g => g.status === "completed");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-text-main mb-2">Your Plan</h1>
          <p className="text-text-muted">Goals, tasks, and your path forward.</p>
        </div>
        <Link href="/advisor?mode=planning">
          <Button>
            <Sparkles className="w-4 h-4" />
            Brainstorm Goals
          </Button>
        </Link>
      </div>

      {/* Subtle Chat Prompt */}
      <Link 
        href="/advisor?mode=planning" 
        className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-primary transition-colors mb-6 group"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Need help setting goals? <span className="text-accent-primary group-hover:underline">Chat with your advisor →</span></span>
      </Link>

      {goals.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-accent-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-accent-primary" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">No goals yet</h2>
          <p className="text-text-muted mb-4">Start by setting some goals — summer programs, competitions, or projects.</p>
          <Link href="/advisor?mode=planning">
            <Button>
              <Plus className="w-4 h-4" />
              Add Your First Goal
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <GoalSection title="In Progress" goals={activeGoals} onRefresh={refreshGoals} />
          )}

          {/* Planning Goals */}
          {planningGoals.length > 0 && (
            <GoalSection title="Planning" goals={planningGoals} onRefresh={refreshGoals} />
          )}

          {/* Parking Lot */}
          {parkingLotGoals.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Archive className="w-5 h-5 text-text-muted" />
                <h2 className="font-display font-bold text-lg text-text-muted">Parking Lot</h2>
                <span className="text-xs text-text-light">({parkingLotGoals.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parkingLotGoals.map(goal => (
                  <GoalCard key={goal.id} goal={goal} minimal onRefresh={refreshGoals} />
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completedGoals.length > 0 && (
            <div>
              <button 
                onClick={() => setShowCompleted(!showCompleted)}
                className="flex items-center gap-2 mb-4 text-text-muted hover:text-text-main transition-colors"
              >
                {showCompleted ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                <span className="font-display font-bold text-lg">Completed</span>
                <span className="text-xs text-text-light">({completedGoals.length})</span>
              </button>
              
              {showCompleted && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedGoals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} completed onRefresh={refreshGoals} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// =============================================================================
// COMPONENTS
// =============================================================================

function GoalSection({ title, goals, onRefresh }: { title: string; goals: Goal[]; onRefresh: () => void }) {
  return (
    <div>
      <h2 className="font-display font-bold text-lg text-text-main mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} onRefresh={onRefresh} />
        ))}
      </div>
    </div>
  );
}

function GoalCard({ 
  goal, 
  minimal = false, 
  completed = false,
  onRefresh 
}: { 
  goal: Goal; 
  minimal?: boolean; 
  completed?: boolean;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(!minimal && !completed);

  const completedTasks = goal.tasks.filter(t => t.completed).length;
  const totalTasks = goal.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const toggleTask = async (taskId: string, completed: boolean) => {
    await fetch(`/api/profile/goals/${goal.id}/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    onRefresh();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "research": return "🔬";
      case "competition": return "🏆";
      case "leadership": return "👥";
      case "project": return "🚀";
      case "application": return "📝";
      default: return "🎯";
    }
  };

  return (
    <Card className={cn(
      "p-5 transition-all",
      completed && "opacity-60",
      minimal && "bg-bg-sidebar"
    )}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
          <div>
            <h3 className={cn(
              "font-display font-bold",
              completed && "line-through text-text-muted"
            )}>
              {goal.title}
            </h3>
            {goal.targetDate && (
              <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                <Calendar className="w-3 h-3" />
                {goal.targetDate}
              </div>
            )}
          </div>
        </div>
        {goal.tasks.length > 0 && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-text-muted hover:text-text-main"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Progress bar */}
      {totalTasks > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-text-muted mb-1">
            <span>{completedTasks} of {totalTasks} tasks</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-bg-sidebar rounded-full h-2">
            <div 
              className="bg-accent-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tasks */}
      {expanded && goal.tasks.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-border-subtle">
          {goal.tasks.map(task => (
            <label 
              key={task.id}
              className="flex items-center gap-3 py-1.5 cursor-pointer group"
            >
              <button
                onClick={() => toggleTask(task.id, !task.completed)}
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                  task.completed 
                    ? "bg-accent-primary border-accent-primary text-white" 
                    : "border-border-medium hover:border-accent-primary"
                )}
              >
                {task.completed && <Check className="w-3 h-3" />}
              </button>
              <span className={cn(
                "text-sm flex-1",
                task.completed && "line-through text-text-muted"
              )}>
                {task.title}
              </span>
              {task.dueDate && (
                <span className="text-xs text-text-light">{task.dueDate}</span>
              )}
            </label>
          ))}
        </div>
      )}
    </Card>
  );
}
