"use client";

import { useMapEvents } from "react-leaflet";
import { House } from "./map/houses-data"; // یا مسیر درست تایپ‌ها

interface HouseMapEventsProps {
  setFilteredHouses: React.Dispatch<React.SetStateAction<House[]>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setModalHouse: React.Dispatch<React.SetStateAction<House | null>>;
  isMobile: boolean;
  allHouses: House[];
}

export default function HouseMapEvents({
  setFilteredHouses,
  setZoom,
  setModalHouse,
  isMobile,
  allHouses,
}: HouseMapEventsProps) {
  useMapEvents({
    moveend: (e) => {
      if (isMobile) return;
      const bounds = e.target.getBounds();
      const visibleHouses = allHouses.filter((h) =>
        bounds.contains([h.lat, h.lng])
      );
      setFilteredHouses(visibleHouses);
      setZoom(e.target.getZoom());
    },
    zoomend: (e) => {
      setZoom(e.target.getZoom());
      setModalHouse(null);
    },
    click: () => {
      setModalHouse(null);
    },
    load: (e) => {
      if (isMobile) return;
      const bounds = e.target.getBounds();
      const visibleHouses = allHouses.filter((h) =>
        bounds.contains([h.lat, h.lng])
      );
      setFilteredHouses(visibleHouses);
      setZoom(e.target.getZoom());
    },
  });

  return null;
}
