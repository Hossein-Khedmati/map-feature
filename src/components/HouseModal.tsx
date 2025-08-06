"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { House } from "./map/houses-data";

interface HouseModalProps {
  house: House;
  onClose: () => void;
}

export default function HouseModal({ house, onClose }: HouseModalProps) {
  const router = useRouter();

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Image
          src={house.image}
          alt={house.title}
          className="w-full h-40 object-cover"
          width={300}
          height={300}
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {house.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {house.description}
          </p>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => router.push(`/houses/${house.id}`)}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              مشاهده بیشتر
            </button>
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-red-500 transition"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
