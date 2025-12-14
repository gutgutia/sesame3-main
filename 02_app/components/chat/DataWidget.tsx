"use client";

import React, { useState } from "react";
import { Check, X, GraduationCap, PenTool, Trophy, Users, FlaskConical, School, Target } from "lucide-react";
import { cn } from "@/lib/utils";

type WidgetType = "gpa" | "sat" | "act" | "activity" | "award" | "school" | "goal";

interface DataWidgetProps {
  type: WidgetType;
  data: {
    label: string;
    value?: string | number;
    isWeighted?: boolean;
    isLeadership?: boolean;
    level?: string;
    title?: string;
    name?: string;
    category?: string;
  };
  status: "draft" | "saved" | "dismissed";
  onConfirm: (data: any) => void;
  onDismiss: () => void;
}

const icons: Record<WidgetType, any> = {
  gpa: GraduationCap,
  sat: PenTool,
  act: PenTool,
  activity: Users,
  award: Trophy,
  school: School,
  goal: Target,
};

const categoryLabels: Record<WidgetType, string> = {
  gpa: "Academics",
  sat: "Testing",
  act: "Testing",
  activity: "Activities",
  award: "Awards",
  school: "Schools",
  goal: "Goals",
};

export function DataWidget({ type, data, status, onConfirm, onDismiss }: DataWidgetProps) {
  const [editedValue, setEditedValue] = useState(data.value?.toString() || data.title || data.name || "");
  const [editedLabel, setEditedLabel] = useState(data.label);
  
  const Icon = icons[type] || GraduationCap;
  const category = categoryLabels[type] || "Profile";
  
  // Saved state
  if (status === "saved") {
    return (
      <div className="bg-success-bg border border-[#BBF7D0] rounded-xl p-4 mt-3 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center gap-2 text-success-text font-semibold text-sm">
          <Check className="w-4 h-4" />
          Added to {category}
        </div>
        <div className="flex items-center gap-2 mt-2 bg-white/60 rounded-lg p-2 px-3">
          <Icon className="w-4 h-4 text-text-muted" />
          <span className="text-text-muted text-xs uppercase font-bold tracking-wider flex-1">{data.label}</span>
          <span className="font-mono font-bold text-text-main">{data.value || data.title || data.name}</span>
        </div>
      </div>
    );
  }
  
  // Dismissed state
  if (status === "dismissed") {
    return null;
  }
  
  // Draft state - editable
  return (
    <div className="bg-accent-surface/50 border border-accent-border rounded-xl p-4 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-accent-primary" />
          <span className="text-xs font-bold text-accent-primary uppercase tracking-wider">Confirm {category}</span>
        </div>
        <button 
          onClick={onDismiss}
          className="p-1 hover:bg-white rounded transition-colors text-text-muted"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Value input based on type */}
      {(type === "gpa" || type === "sat" || type === "act") && (
        <div className="mb-3">
          <label className="block text-xs text-text-muted mb-1">
            {type === "gpa" ? "GPA Value" : "Score"}
          </label>
          <input
            type={type === "gpa" ? "text" : "number"}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="w-full bg-white border border-border-medium rounded-lg px-3 py-2 text-sm font-mono font-semibold text-text-main focus:border-accent-primary outline-none"
            placeholder={type === "gpa" ? "e.g., 3.9" : type === "sat" ? "e.g., 1520" : "e.g., 34"}
          />
          {type === "gpa" && data.isWeighted !== undefined && (
            <div className="mt-1 text-xs text-text-muted">
              {data.isWeighted ? "Weighted" : "Unweighted"} GPA
            </div>
          )}
        </div>
      )}
      
      {(type === "activity" || type === "award") && (
        <div className="mb-3">
          <label className="block text-xs text-text-muted mb-1">
            {type === "activity" ? "Activity Description" : "Award Name"}
          </label>
          <input
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="w-full bg-white border border-border-medium rounded-lg px-3 py-2 text-sm text-text-main focus:border-accent-primary outline-none"
          />
          {type === "activity" && data.isLeadership && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-accent-primary">
              <Check className="w-3 h-3" />
              Leadership role detected
            </div>
          )}
          {type === "award" && data.level && (
            <div className="mt-2 text-xs text-text-muted">
              Level: <span className="font-medium capitalize">{data.level}</span>
            </div>
          )}
        </div>
      )}
      
      {type === "school" && (
        <div className="mb-3">
          <label className="block text-xs text-text-muted mb-1">School Name</label>
          <input
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="w-full bg-white border border-border-medium rounded-lg px-3 py-2 text-sm font-semibold text-text-main focus:border-accent-primary outline-none"
          />
        </div>
      )}

      {type === "goal" && (
        <div className="mb-3">
          <label className="block text-xs text-text-muted mb-1">Goal Description</label>
          <input
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="w-full bg-white border border-border-medium rounded-lg px-3 py-2 text-sm text-text-main focus:border-accent-primary outline-none"
          />
          {data.category && (
            <div className="mt-2 text-xs text-text-muted">
              Category: <span className="font-medium capitalize">{data.category}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={() => {
            const updatedData = { ...data };
            if (type === "gpa") {
              updatedData.value = parseFloat(editedValue) || data.value;
            } else if (type === "sat" || type === "act") {
              updatedData.value = parseInt(editedValue) || data.value;
            } else if (type === "activity" || type === "award" || type === "goal") {
              updatedData.title = editedValue;
            } else if (type === "school") {
              updatedData.name = editedValue;
            }
            onConfirm(updatedData);
          }}
          className="flex-1 bg-accent-primary text-white py-2 rounded-lg text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          Confirm & Save
        </button>
        <button
          onClick={onDismiss}
          className="px-4 py-2 bg-white border border-border-medium rounded-lg text-sm font-medium text-text-muted hover:text-text-main transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
