"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { useRouter } from "next/navigation";

import "leaflet/dist/leaflet.css";
import { houses } from "./houses-data";
import type { House } from "./houses-data";

const customHouseIcon = new L.Icon({
  iconUrl: "/map-marker-svgrepo-com.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapEvents({
  setFilteredHouses,
  setZoom,
}: {
  setFilteredHouses: React.Dispatch<React.SetStateAction<House[]>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}) {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      const visibleHouses = houses.filter((h) =>
        bounds.contains([h.lat, h.lng])
      );
      setFilteredHouses(visibleHouses);
      setZoom(map.getZoom());
    },
    zoomend: () => {
      setZoom(map.getZoom());
    },
    load: () => {
      const bounds = map.getBounds();
      const visibleHouses = houses.filter((h) =>
        bounds.contains([h.lat, h.lng])
      );
      setFilteredHouses(visibleHouses);
      setZoom(map.getZoom());
    },
  });
  return null;
}

export default function MapFeature() {
  const [filteredHouses, setFilteredHouses] = useState<House[]>(houses);
  const [zoom, setZoom] = useState(12);
  const [modalHouse, setModalHouse] = useState<House | null>(null);
  const router = useRouter();

  useEffect(() => {
    setFilteredHouses(houses);
  }, []);

  return (
    <div className="flex h-screen w-full">
      {/* Map section */}
      <div className="flex-1 relative">
        <MapContainer
          center={[35.6892, 51.389]}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerClusterGroup chunkedLoading>
            {filteredHouses.map((house) => (
              <Marker
                key={house.id}
                position={[house.lat, house.lng]}
                icon={customHouseIcon}
                eventHandlers={{
                  click: () => {
                    setModalHouse(house);
                  },
                }}
              >
                {zoom >= 16 && (
                  <Tooltip direction="top" permanent interactive>
                    <span className="bg-red-500 px-2 py-1 rounded text-black text-sm font-medium">
                      {house.title}
                    </span>
                  </Tooltip>
                )}
              </Marker>
            ))}
          </MarkerClusterGroup>

          <MapEvents setFilteredHouses={setFilteredHouses} setZoom={setZoom} />
        </MapContainer>
      </div>

      {/* Right-side list */}
      <div className="w-72 border-l border-gray-300 overflow-y-auto p-4 bg-gray-700">
        <h3 className="text-blue-600 text-lg font-semibold border-b border-gray-300 pb-2 mb-3">
          خانه‌های موجود ({filteredHouses.length})
        </h3>
        {filteredHouses.length === 0 && (
          <p className="text-sm text-gray-500">خانه‌ای در این منطقه موجود نیست.</p>
        )}
        <ul className="space-y-2">
          {filteredHouses.map((house) => (
            <li
              key={house.id}
              onClick={() => setModalHouse(house)}
              className={`cursor-pointer px-3 py-2 rounded transition ${
                modalHouse?.id === house.id
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-500"
              }`}
            >
              {house.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {modalHouse && (
        <div
          onClick={() => setModalHouse(null)}
          className="fixed inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-[10000]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">{modalHouse.title}</h2>
            <p className="text-gray-700 mb-4">{modalHouse.description}</p>

            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  router.push(`/houses/${modalHouse.id}`);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                مشاهده اطلاعات بیشتر
              </button>

              <button
                onClick={() => setModalHouse(null)}
                className="text-gray-600 hover:text-gray-800 transition text-sm"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
