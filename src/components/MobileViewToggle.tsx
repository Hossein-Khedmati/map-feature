"use client";

import React from "react";

interface MobileViewToggleProps {
  currentView: "map" | "list";
  onToggle: () => void;
}

export default function MobileViewToggle({
  currentView,
  onToggle,
}: MobileViewToggleProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999] md:hidden">
      <button
        onClick={onToggle}
        className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        {currentView === "map" ? "نمایش لیست" : "نمایش نقشه"}
      </button>
    </div>
  );
}
