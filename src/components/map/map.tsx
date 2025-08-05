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



// Hook to get map events and update filtered houses & zoom
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

  // Set initial filtered houses on mount (full list)
  useEffect(() => {
    setFilteredHouses(houses);
  }, []);

  return (
    <div  style={{ display: "flex", height: "90vh", width: "100%" }}>
      {/* Map container */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={[35.6892, 51.389]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
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
                  <Tooltip
                    direction="top"
                    permanent
                    interactive
                    className="bg-amber-400"
                  >
                    {house.title}
                  </Tooltip>
                )}
              </Marker>
            ))}
          </MarkerClusterGroup>

          <MapEvents setFilteredHouses={setFilteredHouses} setZoom={setZoom} />
        </MapContainer>
      </div>

      {/* Right-side list */}
      <div
        style={{
          width: 300,
          borderLeft: "1px solid #ddd",
          overflowY: "auto",
          padding: 10,
          backgroundColor: "#fafafa",
        }}
      >
        <h3
        className="text-blue-500"
          style={{
            marginTop: 0,
            marginBottom: 10,
            borderBottom: "1px solid #ccc",
            paddingBottom: 5,
          }}
        >
          خانه‌های موجود ({filteredHouses.length})
        </h3>
        {filteredHouses.length === 0 && <p>خانه‌ای در این منطقه موجود نیست.</p>}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {filteredHouses.map((house) => (
            <li
              key={house.id}
              onClick={() => setModalHouse(house)}
              style={{
                cursor: "pointer",
                padding: "8px 5px",
                borderBottom: "1px solid #eee",
                borderRadius: 4,
                marginBottom: 5,
                backgroundColor:
                  modalHouse?.id === house.id ? "#e3f2fd" : "transparent",
              }}
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
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 8,
              width: "90%",
              maxWidth: 400,
              boxShadow: "0 0 15px rgba(0,0,0,0.3)",
            }}
          >
            <h2>{modalHouse.title}</h2>
            <p>{modalHouse.description}</p>

            <button
              onClick={() => {
                router.push(`/houses/${modalHouse.id}`);
              }}
              style={{
                marginTop: 15,
                padding: "8px 15px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              مشاهده اطلاعات بیشتر
            </button>

            <button
              onClick={() => setModalHouse(null)}
              style={{
                marginTop: 10,
                padding: "5px 10px",
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                float: "right",
              }}
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
