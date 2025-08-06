"use client";

import React from "react";

interface SearchBarProps {
  searchTerm: string;
  onChange: (term: string) => void;
}

export default function SearchBar({
  searchTerm,
  onChange,
}: SearchBarProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 401,
        background: "white",
        padding: "8px",
        borderRadius: "5px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        width: "270px",
      }}
    >
      <input
        type="text"
        placeholder="جستجوی نام خانه..."
        value={searchTerm}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "14px",
        }}
      />
    </div>
  );
}
