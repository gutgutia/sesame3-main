"use client";

import React, { useState } from "react";
import { 
  Check, X, GraduationCap, PenTool, Trophy, Users, 
  BookOpen, FlaskConical, School, Target, User 
} from "lucide-react";
import { cn } from "@/lib/utils";

export type WidgetType = 
  | "gpa" 
  | "sat" 
  | "act" 
  | "activity" 
  | "award" 
  | "course"
  | "program"
  | "goal" 
  | "school"
  | "profile";

interface ConfirmationWidgetProps {
  type: WidgetType;
  data: Record<string, unknown>;
  onConfirm: (data: Record<string, unknown>) => void;
  onDismiss: () => void;
}

const icons: Record<WidgetType, React.ElementType> = {
  gpa: GraduationCap,
  sat: PenTool,
  act: PenTool,
  activity: Users,
  award: Trophy,
  course: BookOpen,
  program: FlaskConical,
  goal: Target,
  school: School,
  profile: User,
};

const titles: Record<WidgetType, string> = {
  gpa: "GPA",
  sat: "SAT Score",
  act: "ACT Score",
  activity: "Activity",
  award: "Award",
  course: "Course",
  program: "Program",
  goal: "Goal",
  school: "School",
  profile: "Profile Info",
};

export function ConfirmationWidget({ type, data, onConfirm, onDismiss }: ConfirmationWidgetProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(data);
  
  const Icon = icons[type] || GraduationCap;
  const title = titles[type] || "Confirm";
  
  const updateField = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    onConfirm(formData);
  };

  return (
    <div className="bg-accent-surface/50 border border-accent-border rounded-xl p-4 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full max-w-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-accent-primary" />
          <span className="text-sm font-bold text-accent-primary uppercase tracking-wider">
            Confirm {title}
          </span>
        </div>
        <button 
          onClick={onDismiss}
          className="p-1 hover:bg-white rounded transition-colors text-text-muted"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Form Fields based on type */}
      <div className="space-y-3">
        {type === "gpa" && (
          <GPAFields data={formData} onChange={updateField} />
        )}
        
        {type === "sat" && (
          <SATFields data={formData} onChange={updateField} />
        )}
        
        {type === "act" && (
          <ACTFields data={formData} onChange={updateField} />
        )}
        
        {type === "activity" && (
          <ActivityFields data={formData} onChange={updateField} />
        )}
        
        {type === "award" && (
          <AwardFields data={formData} onChange={updateField} />
        )}
        
        {type === "course" && (
          <CourseFields data={formData} onChange={updateField} />
        )}
        
        {type === "program" && (
          <ProgramFields data={formData} onChange={updateField} />
        )}
        
        {type === "goal" && (
          <GoalFields data={formData} onChange={updateField} />
        )}
        
        {type === "school" && (
          <SchoolFields data={formData} onChange={updateField} />
        )}
        
        {type === "profile" && (
          <ProfileFields data={formData} onChange={updateField} />
        )}
      </div>
      
      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleConfirm}
          className="flex-1 bg-accent-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onDismiss}
          className="px-4 py-2.5 bg-white border border-border-medium rounded-lg text-sm font-medium text-text-muted hover:text-text-main transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

// Field Components

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs text-text-muted mb-1">
      {children}
      {optional && <span className="ml-1 text-text-muted/60">(optional)</span>}
    </label>
  );
}

function TextField({ 
  value, 
  onChange, 
  placeholder,
  type = "text" 
}: { 
  value: string | number | undefined; 
  onChange: (val: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "date";
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white border border-border-medium rounded-lg px-3 py-2 text-sm text-text-main focus:border-accent-primary outline-none"
    />
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string | undefined;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white border border-border-medium rounded-lg px-3 py-2 text-sm text-text-main focus:border-accent-primary outline-none"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

// GPA Fields
function GPAFields({ data, onChange }: { data: Record<string, unknown>; onChange: (field: string, value: unknown) => void }) {
  return (
    <>
      <div>
        <FieldLabel>Unweighted GPA</FieldLabel>
        <TextField
          type="number"
          value={data.gpaUnweighted as number}
          onChange={(v) => onChange("gpaUnweighted", parseFloat(v) || undefined)}
          placeholder="e.g., 3.9"
        />
      </div>
      <div>
        <FieldLabel optional>Weighted GPA</FieldLabel>
        <TextField
          type="number"
          value={data.gpaWeighted as number}
          onChange={(v) => onChange("gpaWeighted", parseFloat(v) || undefined)}
          placeholder="e.g., 4.3"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel optional>Class Rank</FieldLabel>
          <TextField
            type="number"
            value={data.classRank as number}
            onChange={(v) => onChange("classRank", parseInt(v) || undefined)}
            placeholder="e.g., 5"
          />
        </div>
        <div>
          <FieldLabel optional>Class Size</FieldLabel>
          <TextField
            type="number"
            value={data.classSize as number}
            onChange={(v) => onChange("classSize", parseInt(v) || undefined)}
            placeholder="e.g., 450"
          />
        </div>
      </div>
    </>
  );
}

// SAT Fields
function SATFields({ data, onChange }: { data: Record<string, unknown>; onChange: (field: string, value: unknown) => void }) {
  return (
    <>
      <div>
        <FieldLabel>Total Score</FieldLabel>
        <TextField
          type="number"
          value={data.satTotal as number}
          onChange={(v) => onChange("satTotal", parseInt(v) || undefined)}
          placeholder="e.g., 1520"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel optional>Math</FieldLabel>
          <TextField
            type="number"
            value={data.satMath as number}
            onChange={(v) => onChange("satMath", parseInt(v) || undefined)}
            placeholder="200-800"
          />
        </div>
        <div>
          <FieldLabel optional>Reading/Writing</FieldLabel>
          <TextField
            type="number"
            value={data.satReading as number}
            onChange={(v) => onChange("satReading", parseInt(v) || undefined)}
            placeholder="200-800"
          />
        </div>
      </div>
      <div>
        <FieldLabel optional>Test Date</FieldLabel>
        <TextField
          type="date"
          value={data.satDate as string}
          onChange={(v) => onChange("satDate", v || undefined)}
        />
      </div>
    </>
  );
}

// ACT Fields
function ACTFields({ data, onChange }: { data: Record<string, unknown>; onChange: (field: string, value: unknown) => void }) {
  return (
    <>
      <div>
        <FieldLabel>Composite Score</FieldLabel>
        <TextField
          type="number"
          value={data.actComposite as number}
          onChange={(v) => onChange("actComposite", parseInt(v) || undefined)}
          placeholder="e.g., 34"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel optional>English</FieldLabel>
          <TextField
            type="number"
            value={data.actEnglish as number}
            onChange={(v) => onChange("actEnglish", parseInt(v) || undefined)}
            placeholder="1-36"
          />
        </div>
        <div>
          <FieldLabel optional>Math</FieldLabel>
          <TextField
            type="number"
            value={data.actMath as number}
            onChange={(v) => onChange("actMath", parseInt(v) || undefined)}
            placeholder="1-36"
          />
        </div>
        <div>
          <FieldLabel optional>Reading</FieldLabel>
          <TextField
            type="number"
            value={data.actReading as number}
            onChange={(v) => onChange("actReading", parseInt(v) || undefined)}
            placeholder="1-36"
          />
        </div>
        <div>
          <FieldLabel optional>Science</FieldLabel>
          <TextField
            type="number"
            value={data.actScience as number}
            onChange={(v) => onChange("actScience", parseInt(v) || undefined)}
            placeholder="1-36"
          />
        </div>
      </div>
    </>
  );
}

// Activity Fields
function ActivityFields({ data, onChange }: { data: Record<string, unknown>; onChange: (field: string, value: unknown) => void }) {
  return (
    <>
      <div>
        <FieldLabel>Role/Position</FieldLabel>
        <TextField
          value={data.title as string}
          onChange={(v) => onChange("title", v)}
          placeholder="e.g., President, Captain, Volunteer"
        />
      </div>
      <div>
        <FieldLabel>Organization</FieldLabel>
        <TextField
          value={data.organization as string}
          onChange={(v) => onChange("organization", v)}
          placeholder="e.g., Robotics Club, Debate Team"
        />
      </div>
      <div>
        <FieldLabel optional>Category</FieldLabel>
        <SelectField
          value={data.category as string}
          onChange={(v) => onChange("category", v)}
          placeholder="Select category"
          options={[
            { value: "club", label: "Club" },
            { value: "sport", label: "Sport" },
            { value: "arts", label: "Arts" },
            { value: "volunteer", label: "Volunteer" },
            { value: "work", label: "Work" },
            { value: "family", label: "Family Responsibility" },
            { value: "other", label: "Other" },
          ]}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isLeadership"
          checked={data.isLeadership as boolean ?? false}
          onChange={(e) => onChange("isLeadership", e.target.checked)}
          className="rounded border-border-medium"
        />
        <label htmlFor="isLeadership" className="text-sm text-text-main">
          This is a leadership role
        </label>
      </div>
      <div>
        <FieldLabel optional>Description</FieldLabel>
        <textarea
          value={data.description as string ?? ""}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="What did you do? What was your impact?"
          className="w-full bg-white border border-border-medium rounded-lg px-3 py-2 text-sm text-text-main focus:border-accent-primary outline-none resize-none h-20"
        />
      </div>
    </>
  );
}

// Award Fields
function AwardFields({ data, onChange }: { data: Record<string, unknown>; onChange: (field: string, value: unknown) => void }) {
  return (
    <>
      <div>
        <FieldLabel>Award Name</FieldLabel>
        <TextField
          value={data.title as string}
          onChange={(v) => onChange("title", v)}
          placeholder="e.g., AIME Qualifier, National Merit Semifinalist"
        />
      </div>
      <div>
        <FieldLabel>Level</FieldLabel>
        <SelectField
          value={data.level as string}
          onChange={(v) => onChange("level", v)}
          placeholder="Select level"
          options={[
            { value: "school", label: "School" },
            { value: "regional", label: "Regional" },
            { value: "state", label: "State" },
            { value: "national", label: "National" },
            { value: "international", label: "International" },
          ]}
        />
      </div>
      <div>
        <FieldLabel optional>Year</FieldLabel>
        <TextField
          type="number"
          value={data.year as number}
          onChange={(v) => onChange("year", parseInt(v) || undefined)}
          placeholder="e.g., 2024"
        />
      </div>
      <div>
        <FieldLabel optional>Description</FieldLabel>
        <TextField
          value={data.description as string}
          onChange={(v) => onChange("description", v)}
          placeholder="Brief description"
        />
      </div>
    </>
  );
}

// Course Fields
function CourseFields({ data, onChange }: { data: Record<string, unknown>; onChange: (field: string, value: unknown) => void }) {
  return (
    <>
      <div>
        <FieldLabel>Course Name</FieldLabel>
        <TextField
          value={data.name as string}
          onChange={(v) => onChange("name", v)}
          placeholder="e.g., AP Calculus BC"
        />
      </div>
      <div>
        <FieldLabel>Status</FieldLabel>
        <SelectField
          value={data.status as string}
          onChange={(v) => onChange("status", v)}
          placeholder="Select status"
          options={[
            { value: "completed", label: "Completed" },
            { value: "in_progress", label: "Currently Taking" },
            { value: "planned", label: "Planning to Take" },
          ]}
        />
      </div>
      <div>
        <FieldLabel optional>Level</FieldLabel>
        <SelectField
          value={data.level as string}
          onChange={(v) => onChange("level", v)}
          placeholder="Select level"
          options={[
            { value: "regular", label: "Regular" },
            { value: "honors", label: "Honors" },
            { value: "ap", label: "AP" },
            { value: "ib", label: "IB" },
            { value: "college", label: "Dual Enrollment" },
          ]}
        />
      </div>
      {data.status === "completed" && (
        <div>
          <FieldLabel optional>Grade</FieldLabel>
          <TextField
            value={data.grade as string}
            onChange={(v) => onChange("grade", v)}
            placeholder="e.g., A, A-, B+"
          />
        </div>
      )}
    </>
  );
}

// Program Fields
function ProgramFields({ data, onChange }: { data: Record<string, unknown>; onChange: (field: string, value: unknown) => void }) {
  return (
    <>
      <div>
        <FieldLabel>Program Name</FieldLabel>
        <TextField
          value={data.name as string}
          onChange={(v) => onChange("name", v)}
          placeholder="e.g., Stanford SIMR, RSI"
        />
      </div>
      <div>
        <FieldLabel optional>Organization</FieldLabel>
        <TextField
          value={data.organization as string}
          onChange={(v) => onChange("organization", v)}
          placeholder="e.g., Stanford, MIT"
        />
      </div>
      <div>
        <FieldLabel>Status</FieldLabel>
        <SelectField
          value={data.status as string}
          onChange={(v) => onChange("status", v)}
          placeholder="Select status"
          options={[
            { value: "interested", label: "Interested" },
            { value: "applying", label: "Applying" },
            { value: "applied", label: "Applied" },
            { value: "accepted", label: "Accepted" },
            { value: "attending", label: "Attending" },
            { value: "completed", label: "Completed" },
          ]}
        />
      </div>
    </>
  );
}

// Goal Fields
function GoalFields({ data, onChange }: { data: Record<string, unknown>; onChange: (field: string, value: unknown) => void }) {
  return (
    <>
      <div>
        <FieldLabel>Goal</FieldLabel>
        <TextField
          value={data.title as string}
          onChange={(v) => onChange("title", v)}
          placeholder="What do you want to achieve?"
        />
      </div>
      <div>
        <FieldLabel>Category</FieldLabel>
        <SelectField
          value={data.category as string}
          onChange={(v) => onChange("category", v)}
          placeholder="Select category"
          options={[
            { value: "research", label: "Research" },
            { value: "competition", label: "Competition" },
            { value: "leadership", label: "Leadership" },
            { value: "project", label: "Project" },
            { value: "academic", label: "Academic" },
            { value: "application", label: "Application" },
            { value: "other", label: "Other" },
          ]}
        />
      </div>
      <div>
        <FieldLabel optional>Target Date</FieldLabel>
        <TextField
          type="date"
          value={data.targetDate as string}
          onChange={(v) => onChange("targetDate", v)}
        />
      </div>
    </>
  );
}

// School Fields
function SchoolFields({ data, onChange }: { data: Record<string, unknown>; onChange: (field: string, value: unknown) => void }) {
  return (
    <>
      <div>
        <FieldLabel>School Name</FieldLabel>
        <TextField
          value={data.schoolName as string}
          onChange={(v) => onChange("schoolName", v)}
          placeholder="e.g., Stanford University"
        />
      </div>
      <div>
        <FieldLabel>Category</FieldLabel>
        <SelectField
          value={data.tier as string}
          onChange={(v) => onChange("tier", v)}
          placeholder="How would you categorize this school?"
          options={[
            { value: "dream", label: "Dream School" },
            { value: "reach", label: "Reach" },
            { value: "target", label: "Target" },
            { value: "safety", label: "Safety" },
          ]}
        />
      </div>
      <div>
        <FieldLabel optional>Why interested?</FieldLabel>
        <TextField
          value={data.whyInterested as string}
          onChange={(v) => onChange("whyInterested", v)}
          placeholder="What draws you to this school?"
        />
      </div>
    </>
  );
}

// Profile Fields
function ProfileFields({ data, onChange }: { data: Record<string, unknown>; onChange: (field: string, value: unknown) => void }) {
  return (
    <>
      <div>
        <FieldLabel>First Name</FieldLabel>
        <TextField
          value={data.firstName as string}
          onChange={(v) => onChange("firstName", v)}
          placeholder="Your first name"
        />
      </div>
      <div>
        <FieldLabel optional>Preferred Name</FieldLabel>
        <TextField
          value={data.preferredName as string}
          onChange={(v) => onChange("preferredName", v)}
          placeholder="What should I call you?"
        />
      </div>
      <div>
        <FieldLabel>Grade</FieldLabel>
        <SelectField
          value={data.grade as string}
          onChange={(v) => onChange("grade", v)}
          placeholder="Select grade"
          options={[
            { value: "9th", label: "9th Grade (Freshman)" },
            { value: "10th", label: "10th Grade (Sophomore)" },
            { value: "11th", label: "11th Grade (Junior)" },
            { value: "12th", label: "12th Grade (Senior)" },
            { value: "gap_year", label: "Gap Year" },
          ]}
        />
      </div>
      <div>
        <FieldLabel optional>High School</FieldLabel>
        <TextField
          value={data.highSchoolName as string}
          onChange={(v) => onChange("highSchoolName", v)}
          placeholder="Your high school name"
        />
      </div>
    </>
  );
}
