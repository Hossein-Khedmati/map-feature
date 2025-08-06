"use client";

import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { House } from "./map/houses-data";

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

interface HouseMarkersProps {
  houses: House[];
  zoom: number;
  selectedHouseId: number | null;
  setModalHouse: (house: House | null) => void;
  setSelectedHouseId: (id: number | null) => void;
  isMobile: boolean;
}

export default function HouseMarkers({
  houses,
  zoom,
  selectedHouseId,
  setModalHouse,
  setSelectedHouseId,
  isMobile,
}: HouseMarkersProps) {
  return (
    <MarkerClusterGroup chunkedLoading>
      {houses.map((house) => (
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
  );
}
