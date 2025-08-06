"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { House } from "./map/houses-data";

interface HouseListMobileProps {
  houses: House[];
}

export default function HouseListMobile({ houses }: HouseListMobileProps) {
  const router = useRouter();

  return (
    <div className="absolute inset-0 overflow-y-auto bg-white p-4 z-[998]">
      <h3 className="text-lg font-semibold mb-4">
        خانه‌های موجود ({houses.length})
      </h3>
      {houses.length === 0 && (
        <p className="text-sm text-gray-500">خانه‌ای در این منطقه موجود نیست.</p>
      )}
      <ul className="grid grid-cols-1 gap-4">
        {houses.map((house) => (
          <li
            key={house.id}
            onClick={() => router.push(`/houses/${house.id}`)}
            className="bg-white rounded-lg cursor-pointer overflow-hidden shadow-md hover:shadow-xl transition"
          >
            <Image
              src={house.image}
              alt={house.title}
              className="w-full h-40 object-cover"
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
