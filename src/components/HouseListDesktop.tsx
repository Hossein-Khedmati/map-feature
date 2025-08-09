"use client";

import React from "react";
import Image from "next/image";
import { House } from "./map/houses-data";

interface HouseListDesktopProps {
  houses: House[];
  onSelect: (house: House) => void;
}

export default function HouseListDesktop({
  houses,
  onSelect,
}: HouseListDesktopProps) {
  return (
    <div className="w-[30%] bg-[#3395D1ea] p-4 overflow-y-auto">
      <h3 dir="rtl" className="text-lg font-semibold mb-4">
        خانه‌های موجود ({houses.length})
      </h3>
      {houses.length === 0 && (
        <p dir="rtl" className="text-sm text-gray-200">خانه‌ای در این منطقه موجود نیست.</p>
      )}
      <ul dir="rtl" className="grid grid-cols-1 gap-4">
        {houses.map((house) => (
          <li
            key={house.id}
            onClick={() => onSelect(house)}
            className="bg-white rounded-lg cursor-pointer overflow-hidden shadow-md hover:shadow-xl transition"
          >
            <Image
              src={house.image}
              alt={house.title}
              className="w-full h-36 object-cover"
              width={400}
              height={300}
            />
            <div className="p-2">
              <h4 className="font-semibold text-gray-700">{house.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-2">
                {house.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
