"use client";

import React from "react";

interface CityFilterProps {
  cities: string[];
  selectedCity: string;
  onChange: (city: string) => void;
}

export default function CityFilter({
  cities,
  selectedCity,
  onChange,
}: CityFilterProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 401,
        background: "white",
        padding: "6px 8px",
        borderRadius: "5px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      }}
    >
      <select
        value={selectedCity}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "6px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "14px",
          minWidth: "200px",
        }}
      >
        <option value="">انتخاب شهر (همه)</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
}
