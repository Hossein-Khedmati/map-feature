"use client";

import React, { useState, useEffect, useRef } from "react";
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
import Image from "next/image";

const customHouseIcon = new L.Icon({
  iconUrl: "/map-marker-svgrepo-com.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const selectedHouseIcon = new L.Icon({
  iconUrl: "/map-marker-svgrepo-com.svg",
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});

function MapEvents({
  setFilteredHouses,
  setZoom,
  setModalHouse,
}: {
  setFilteredHouses: React.Dispatch<React.SetStateAction<House[]>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setModalHouse: React.Dispatch<React.SetStateAction<House | null>>;
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
      setModalHouse(null);
    },
    click: () => {
      setModalHouse(null);
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
  const [selectedHouseId, setSelectedHouseId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const router = useRouter();

  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    const filtered = houses.filter((house) =>
      house.city.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredHouses(filtered);
    setModalHouse(null);
    setSelectedHouseId(null);
  };

  const handleHouseSelect = (house: House) => {
    if (mapRef.current) {
      mapRef.current.flyTo([house.lat, house.lng], 16);
    }
    setSelectedHouseId(house.id);
    setModalHouse(null);
    if (isMobile) {
      setMobileView("map");
    }
  };

  useEffect(() => {
    setFilteredHouses(houses);
  }, []);

  return (
    <div className={`h-screen w-full ${isMobile ? "relative" : "flex"}`}>
      {/* Map section */}
      {(!isMobile || mobileView === "map") && (
        <div className="flex-1 relative h-full w-full">
          <MapContainer
            center={[35.6892, 51.389]}
            zoom={12}
            scrollWheelZoom={true}
            ref={mapRef}
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
                  icon={
                    house.id === selectedHouseId
                      ? selectedHouseIcon
                      : customHouseIcon
                  }
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      setModalHouse(house);
                      setSelectedHouseId(house.id);
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

            <MapEvents
              setFilteredHouses={setFilteredHouses}
              setZoom={setZoom}
              setModalHouse={setModalHouse}
            />
          </MapContainer>
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 401,
              background: "white",
              padding: "8px",
              borderRadius: "5px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            <input
              type="text"
              placeholder="جستجوی شهر..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: "250px",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
          </div>
          {/* Floating House Card */}
          {modalHouse && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-md">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Image
                  src={modalHouse.image}
                  alt={modalHouse.title}
                  className="w-full h-40 object-cover"
                  width={300}
                  height={300}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {modalHouse.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {modalHouse.description}
                  </p>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => router.push(`/houses/${modalHouse.id}`)}
                      className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      مشاهده بیشتر
                    </button>
                    <button
                      onClick={() => setModalHouse(null)}
                      className="text-sm text-gray-500 hover:text-red-500 transition"
                    >
                      بستن
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Right-side list */}
      {(!isMobile || mobileView === "list") && (
        <div
          className={`${
            isMobile ? "w-full h-full" : "w-80"
          } bg-gray-600 p-4 overflow-y-auto`}
        >
          <h3 className="text-lg font-semibold mb-4">
            خانه‌های موجود ({filteredHouses.length})
          </h3>
          {filteredHouses.length === 0 && (
            <p className="text-sm text-gray-500">
              خانه‌ای در این منطقه موجود نیست.
            </p>
          )}
          <ul className="space-y-2">
            {filteredHouses.map((house) => (
              <li
                key={house.id}
                className={`cursor-pointer p-2 rounded-md transition ${
                  house.id === selectedHouseId
                    ? "bg-blue-400 border border-blue-600"
                    : "hover:bg-blue-300"
                }`}
                onClick={() => handleHouseSelect(house)}
              >
                <h4 className="font-semibold">{house.title}</h4>
                <p className="text-sm text-gray-600">{house.price}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isMobile && (
        <button
          onClick={() => setMobileView(mobileView === "map" ? "list" : "map")}
          className="absolute bottom-5 right-5 z-[1000] bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg font-semibold"
        >
          {mobileView === "map" ? "لیست" : "نقشه"}
        </button>
      )}

      {/* Modal */}
      {/* {modalHouse && (
        <div
          onClick={() => setModalHouse(null)}
          className="fixed inset-0 bg-white/30 backdrop-blur-[1px] flex items-center justify-center z-[10000]"
        >
          <div>
            <Image alt="hi" src={modalHouse.image} width={300} height={300} />
          </div>
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
      )} */}
    </div>
  );
}
