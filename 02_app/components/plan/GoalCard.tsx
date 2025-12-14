"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Check, Plus, MessageCircle, Calendar, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Goal, Task } from "@/lib/profile";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  goal: Goal;
  defaultExpanded?: boolean;
  onTaskToggle?: (goalId: string, taskId: string) => void;
  onTaskAdd?: (goalId: string, taskTitle: string) => void;
  onTitleChange?: (goalId: string, newTitle: string) => void;
  onStatusChange?: (goalId: string, newStatus: Goal["status"]) => void;
}

const categoryIcons: Record<string, string> = {
  research: "🔬",
  competition: "🏆",
  leadership: "👥",
  project: "💡",
  other: "🎯",
};

const statusLabels: Record<Goal["status"], string> = {
  parking_lot: "Parking Lot",
  planning: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
};

const statusColors: Record<Goal["status"], string> = {
  parking_lot: "bg-gray-100 text-gray-600",
  planning: "bg-blue-50 text-blue-600",
  in_progress: "bg-accent-surface text-accent-primary",
  completed: "bg-success-bg text-success-text",
};

export function GoalCard({
  goal,
  defaultExpanded = false,
  onTaskToggle,
  onTaskAdd,
  onTitleChange,
  onStatusChange,
}: GoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(goal.title);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const tasks = goal.tasks || [];
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== goal.title) {
      onTitleChange?.(goal.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onTaskAdd?.(goal.id, newTaskTitle.trim());
      setNewTaskTitle("");
    }
  };

  const handleStatusChange = (newStatus: Goal["status"]) => {
    onStatusChange?.(goal.id, newStatus);
    setShowStatusMenu(false);
  };

  return (
    <div className="bg-white border border-border-subtle rounded-xl overflow-hidden hover:shadow-card transition-shadow">
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          {/* Category Icon */}
          <div className="text-xl mt-0.5">{categoryIcons[goal.category]}</div>

          {/* Title & Meta */}
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                  if (e.key === "Escape") {
                    setEditedTitle(goal.title);
                    setIsEditingTitle(false);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="font-display font-bold text-lg w-full bg-transparent border-b-2 border-accent-primary outline-none"
                autoFocus
              />
            ) : (
              <h3
                className="font-display font-bold text-lg text-text-main truncate hover:text-accent-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                title="Click to rename"
              >
                {goal.title}
              </h3>
            )}

            <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
              <span className="capitalize">{goal.category}</span>
              {goal.targetDate && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {goal.targetDate}
                  </span>
                </>
              )}
              {totalTasks > 0 && (
                <>
                  <span>•</span>
                  <span>
                    {completedTasks}/{totalTasks} tasks
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Status Badge & Expand */}
          <div className="flex items-center gap-2">
            {/* Status Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStatusMenu(!showStatusMenu);
                }}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold",
                  statusColors[goal.status]
                )}
              >
                {statusLabels[goal.status]}
              </button>

              {showStatusMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-border-subtle rounded-lg shadow-lg py-1 z-20 min-w-[140px]">
                  {(["parking_lot", "planning", "in_progress", "completed"] as Goal["status"][]).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(status);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-bg-sidebar transition-colors",
                          goal.status === status && "bg-bg-sidebar font-medium"
                        )}
                      >
                        {statusLabels[status]}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Expand Toggle */}
            <button className="p-1 text-text-muted hover:text-text-main transition-colors">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar (if has tasks) */}
        {totalTasks > 0 && (
          <div className="mt-3 ml-9">
            <div className="h-1.5 bg-bg-sidebar rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border-subtle p-4 bg-[#FAFAF9] animate-in slide-in-from-top-2 duration-200">
          {/* Tasks */}
          <div className="mb-4">
            <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
              Tasks
            </div>

            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => onTaskToggle?.(goal.id, task.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted italic">No tasks yet</p>
            )}

            {/* Add Task Input */}
            <form onSubmit={handleAddTask} className="mt-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Add a task..."
                  className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-text-light"
                />
                {newTaskTitle.trim() && (
                  <button
                    type="submit"
                    className="text-xs text-accent-primary font-medium hover:underline"
                  >
                    Add
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-3 border-t border-border-subtle">
            <Link
              href={`/advisor?goal=${goal.id}`}
              className="flex items-center gap-1.5 text-sm text-accent-primary font-medium hover:underline"
            >
              <MessageCircle className="w-4 h-4" />
              Chat about this goal
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskItem({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <div
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer group"
      onClick={onToggle}
    >
      <div
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
          task.completed
            ? "bg-accent-primary border-accent-primary"
            : "border-border-medium group-hover:border-accent-primary"
        )}
      >
        {task.completed && <Check className="w-3 h-3 text-white" />}
      </div>
      <span
        className={cn(
          "text-sm flex-1",
          task.completed ? "text-text-muted line-through" : "text-text-main"
        )}
      >
        {task.title}
      </span>
      {task.dueDate && (
        <span className="text-xs text-text-muted">{task.dueDate}</span>
      )}
    </div>
  );
}
