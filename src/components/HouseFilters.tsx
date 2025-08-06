
"use client";
import React from "react";

type HouseFiltersProps = {
  cities: string[];
  filters: {
    city: string;
    search: string;
  };
  onChange: (newFilters: HouseFiltersProps["filters"]) => void;
};

export default function HouseFilters({ cities, filters, onChange }: HouseFiltersProps) {
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, city: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  return (
    <div className=" relative  bg-gray-400 p-3 rounded shadow flex justify-end gap-2">
      <select value={filters.city} onChange={handleCityChange} className="p-2 border rounded">
        <option value="">همه شهرها</option>
        {cities.map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="جستجو بر اساس نام"
        value={filters.search}
        onChange={handleSearchChange}
        className="p-2 border rounded"
      />
    </div>
  );
}
