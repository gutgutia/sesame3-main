"use client";

/**
 * DevSwitcher
 * Development-only component to switch between test user personas.
 * Shows in bottom-left corner during development.
 */

import React, { useState, useEffect } from "react";
import { ChevronUp, User, RefreshCw } from "lucide-react";

// Test user personas
const TEST_USERS = [
  { id: "test-user-new", name: "Alex (New)", description: "Just signed up" },
  { id: "test-user-onboarded", name: "Jordan (Onboarded)", description: "Basic info complete" },
  { id: "test-user-building", name: "Sarah (Building)", description: "Partial profile" },
  { id: "test-user-complete", name: "Max (Complete)", description: "Full profile" },
];

export function DevSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load current user from API on mount
  useEffect(() => {
    fetch("/api/dev/user")
      .then(res => res.json())
      .then(data => setCurrentUserId(data.userId))
      .catch(() => {});
  }, []);

  // Find current user info
  const currentUser = TEST_USERS.find(u => u.id === currentUserId);

  const switchUser = async (userId: string) => {
    setIsLoading(true);
    
    // Set via API (creates cookie)
    await fetch("/api/dev/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    
    setCurrentUserId(userId);
    
    // Refresh the page to apply the new user
    window.location.reload();
  };

  const clearUser = async () => {
    await fetch("/api/dev/user", { method: "DELETE" });
    setCurrentUserId(null);
    window.location.reload();
  };

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Collapsed state */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <User className="w-3 h-3" />
          <span>{currentUser?.name || "Default User"}</span>
          <ChevronUp className="w-3 h-3" />
        </button>
      )}

      {/* Expanded state */}
      {isOpen && (
        <div className="bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden w-64">
          {/* Header */}
          <div className="px-3 py-2 border-b border-gray-700 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Dev: Switch User
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* User list */}
          <div className="p-2 space-y-1">
            {TEST_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => switchUser(user.id)}
                disabled={isLoading}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  currentUserId === user.id
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-400">{user.description}</div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-gray-700 flex gap-2">
            <button
              onClick={clearUser}
              className="flex-1 text-xs text-gray-400 hover:text-white py-1"
            >
              Clear (use default)
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-gray-400 hover:text-white p-1"
              title="Refresh page"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
