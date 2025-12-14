"use client";

import React, { useState, useEffect } from "react";
import { Plus, MessageCircle, Archive, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GoalCard } from "@/components/plan/GoalCard";
import { IdeasSuggestions } from "@/components/plan/IdeasSuggestions";
import Link from "next/link";
import { loadProfile, saveProfile, StudentProfile, Goal, Task } from "@/lib/profile";

// Mock goals data for the prototype
const MOCK_GOALS: Goal[] = [
  {
    id: "g1",
    title: "Apply to SIMR Summer Research",
    category: "research",
    status: "in_progress",
    targetDate: "Jan 15",
    description: "Stanford Institutes of Medicine Summer Research Program",
    tasks: [
      { id: "t1", title: "Research program requirements", completed: true },
      { id: "t2", title: "Draft Essay 1: 'Why Science?'", completed: true },
      { id: "t3", title: "Draft Essay 2: Research Interests", completed: false, dueDate: "Tomorrow" },
      { id: "t4", title: "Request transcript from counselor", completed: false, dueDate: "Jan 12" },
      { id: "t5", title: "Submit application", completed: false, dueDate: "Jan 15" },
    ],
  },
  {
    id: "g2",
    title: "Qualify for USAMO",
    category: "competition",
    status: "in_progress",
    targetDate: "Feb 8",
    tasks: [
      { id: "t6", title: "Take AMC 10/12 Practice Exam", completed: false },
      { id: "t7", title: "Review Number Theory", completed: false },
      { id: "t8", title: "Complete Art of Problem Solving chapter", completed: false },
    ],
  },
  {
    id: "g3",
    title: "Launch coding bootcamp for underserved students",
    category: "leadership",
    status: "planning",
    description: "Free weekend coding classes at local community center",
    tasks: [
      { id: "t9", title: "Find venue (community center)", completed: false },
      { id: "t10", title: "Create curriculum outline", completed: false },
      { id: "t11", title: "Recruit volunteer instructors", completed: false },
    ],
  },
  {
    id: "g4",
    title: "Build a personal finance app",
    category: "project",
    status: "parking_lot",
    description: "App to help students manage their money",
  },
  {
    id: "g5",
    title: "Look into Intel ISEF",
    category: "competition",
    status: "parking_lot",
    description: "International Science and Engineering Fair",
  },
  {
    id: "g6",
    title: "Complete college essay draft",
    category: "other",
    status: "completed",
    tasks: [
      { id: "t12", title: "Brainstorm topics", completed: true },
      { id: "t13", title: "Write first draft", completed: true },
      { id: "t14", title: "Get feedback from teacher", completed: true },
    ],
  },
];

export default function PlanPage() {
  const [profile, setProfile] = useState<StudentProfile>({});
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  // Load profile and goals
  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
    
    // Use profile goals or fall back to mock data
    if (loaded.goals && loaded.goals.length > 0) {
      setGoals(loaded.goals);
    } else {
      setGoals(MOCK_GOALS);
    }
    setIsLoaded(true);
  }, []);

  // Group goals by status
  const activeGoals = goals.filter(g => g.status === "in_progress");
  const plannedGoals = goals.filter(g => g.status === "planning");
  const parkingLotGoals = goals.filter(g => g.status === "parking_lot");
  const completedGoals = goals.filter(g => g.status === "completed");

  // Handlers
  const handleTaskToggle = (goalId: string, taskId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId && goal.tasks) {
        return {
          ...goal,
          tasks: goal.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        };
      }
      return goal;
    }));
  };

  const handleTaskAdd = (goalId: string, taskTitle: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const newTask: Task = {
          id: `t${Date.now()}`,
          title: taskTitle,
          completed: false,
        };
        return {
          ...goal,
          tasks: [...(goal.tasks || []), newTask],
        };
      }
      return goal;
    }));
  };

  const handleTitleChange = (goalId: string, newTitle: string) => {
    setGoals(prev => prev.map(goal =>
      goal.id === goalId ? { ...goal, title: newTitle } : goal
    ));
  };

  const handleStatusChange = (goalId: string, newStatus: Goal["status"]) => {
    setGoals(prev => prev.map(goal =>
      goal.id === goalId ? { ...goal, status: newStatus } : goal
    ));
  };

  const handleAddFromSuggestion = (title: string, category: Goal["category"], toParking: boolean) => {
    const newGoal: Goal = {
      id: `g${Date.now()}`,
      title,
      category,
      status: toParking ? "parking_lot" : "planning",
      tasks: [],
    };
    setGoals(prev => [...prev, newGoal]);
  };

  if (!isLoaded) {
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
          <p className="text-text-muted">Your goals, tasks, and ideas in one place.</p>
        </div>
        <Link href="/advisor?mode=planning">
          <Button>
            <Plus className="w-4 h-4" />
            Add Goal
          </Button>
        </Link>
      </div>

      {/* Subtle Chat Prompt */}
      <Link
        href="/advisor?mode=planning"
        className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-primary transition-colors mb-8 group"
      >
        <MessageCircle className="w-4 h-4" />
        <span>Need help with your goals? <span className="text-accent-primary group-hover:underline">Chat with your advisor →</span></span>
      </Link>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-accent-primary rounded-full" />
            <h2 className="font-display font-bold text-lg">Active</h2>
            <span className="text-sm text-text-muted">({activeGoals.length})</span>
          </div>
          <div className="space-y-4">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                defaultExpanded={true}
                onTaskToggle={handleTaskToggle}
                onTaskAdd={handleTaskAdd}
                onTitleChange={handleTitleChange}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </section>
      )}

      {/* Planned Goals */}
      {plannedGoals.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <h2 className="font-display font-bold text-lg">Planned</h2>
            <span className="text-sm text-text-muted">({plannedGoals.length})</span>
          </div>
          <div className="space-y-4">
            {plannedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                defaultExpanded={false}
                onTaskToggle={handleTaskToggle}
                onTaskAdd={handleTaskAdd}
                onTitleChange={handleTitleChange}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </section>
      )}

      {/* Parking Lot */}
      {parkingLotGoals.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Archive className="w-4 h-4 text-text-muted" />
            <h2 className="font-display font-bold text-lg">Parking Lot</h2>
            <span className="text-sm text-text-muted">({parkingLotGoals.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {parkingLotGoals.map((goal) => (
              <ParkingLotCard
                key={goal.id}
                goal={goal}
                onStatusChange={handleStatusChange}
              />
            ))}
            {/* Add to Parking Lot */}
            <Link
              href="/advisor?mode=planning"
              className="border border-dashed border-border-medium rounded-xl p-4 flex items-center justify-center gap-2 text-sm text-text-muted hover:border-accent-primary hover:text-accent-primary cursor-pointer transition-colors min-h-[100px]"
            >
              <Plus className="w-4 h-4" />
              Add Idea
            </Link>
          </div>
        </section>
      )}

      {/* Ideas & Suggestions */}
      <IdeasSuggestions
        profile={profile}
        onAddToParking={(suggestion) => handleAddFromSuggestion(suggestion.title, suggestion.category, true)}
        onStartPlanning={(suggestion) => handleAddFromSuggestion(suggestion.title, suggestion.category, false)}
      />

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <section className="mt-8 pt-8 border-t border-border-subtle">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 mb-4 text-text-muted hover:text-text-main transition-colors"
          >
            <div className="w-2 h-2 bg-success-text rounded-full" />
            <h2 className="font-display font-bold text-lg">Completed</h2>
            <span className="text-sm">({completedGoals.length})</span>
            {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showCompleted && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
              {completedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  defaultExpanded={false}
                  onTaskToggle={handleTaskToggle}
                  onTaskAdd={handleTaskAdd}
                  onTitleChange={handleTitleChange}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}

// Parking Lot Card - simpler display
function ParkingLotCard({ 
  goal, 
  onStatusChange 
}: { 
  goal: Goal;
  onStatusChange: (goalId: string, status: Goal["status"]) => void;
}) {
  const categoryIcons: Record<string, string> = {
    research: "🔬",
    competition: "🏆",
    leadership: "👥",
    project: "💡",
    other: "🎯",
  };

  return (
    <div className="bg-[#F9F8F6] border border-border-subtle rounded-xl p-4 hover:bg-white hover:shadow-card transition-all">
      <div className="flex items-start gap-2 mb-2">
        <span className="text-sm">{categoryIcons[goal.category]}</span>
        <h3 className="font-semibold text-sm text-text-main flex-1">{goal.title}</h3>
      </div>
      {goal.description && (
        <p className="text-xs text-text-muted mb-3 line-clamp-2">{goal.description}</p>
      )}
      <button
        onClick={() => onStatusChange(goal.id, "planning")}
        className="text-xs text-accent-primary hover:underline font-medium"
      >
        Start planning →
      </button>
    </div>
  );
}
