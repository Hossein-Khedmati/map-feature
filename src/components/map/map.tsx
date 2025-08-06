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
import Image from "next/image";

import "leaflet/dist/leaflet.css";
import { houses } from "./houses-data";
import type { House } from "./houses-data";
import HouseMapEvents from "../HouseMapEvents";
import HouseMarkers from "../HouseMarkers";
import HouseModal from "../HouseModal";
import CityFilter from "../CityFilter";
import SearchBar from "../SearchBar";
import HouseListDesktop from "../HouseListDesktop";
import HouseListMobile from "../HouseListMobile";
import MobileViewToggle from "@/components/MobileViewToggle";
import HouseFilters from "../HouseFilters";

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
  isMobile,
}: {
  setFilteredHouses: React.Dispatch<React.SetStateAction<House[]>>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setModalHouse: React.Dispatch<React.SetStateAction<House | null>>;
  isMobile: boolean;
}) {
  const map = useMapEvents({
    moveend: () => {
      if (isMobile) return; // on mobile do NOT filter by map bounds

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
      if (isMobile) return; // no bounds filtering on mobile

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
  const [mapFilteredHouses, setMapFilteredHouses] = useState<House[]>(houses);
  const [zoom, setZoom] = useState(12);
  const [modalHouse, setModalHouse] = useState<House | null>(null);
  const [selectedHouseId, setSelectedHouseId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | "">("");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const router = useRouter();

  const mapRef = useRef<L.Map | null>(null);

  // Unique cities for dropdown
  const uniqueCities = Array.from(new Set(houses.map((h) => h.city)));

  // Combined filter for mapFilteredHouses: filtered by map bounds + city + search
  // But mapFilteredHouses is actually houses inside current map bounds only.
  // On desktop, filter mapFilteredHouses by search + city.
  // On mobile map, no filtering by map bounds - mapFilteredHouses == houses filtered by city+search.

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Filter houses by city + search (used for mobile list and desktop list filtering)
  const filterByCityAndSearch = (
    houseList: House[],
    city: string,
    term: string
  ) => {
    let filtered = houseList;
    if (city) {
      filtered = filtered.filter((h) => h.city === city);
    }
    if (term) {
      filtered = filtered.filter((h) =>
        h.title.toLowerCase().includes(term.toLowerCase())
      );
    }
    return filtered;
  };

  // Desktop list: filtered houses = mapFilteredHouses filtered by city+search
  const desktopFilteredHouses = filterByCityAndSearch(
    mapFilteredHouses,
    selectedCity,
    searchTerm
  );

  // Mobile list: filtered houses = full houses filtered by city+search, independent from map
  const mobileFilteredHouses = filterByCityAndSearch(
    houses,
    selectedCity,
    searchTerm
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setModalHouse(null);
    setSelectedHouseId(null);
  };

  const handleCitySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setSelectedCity(city);
    setModalHouse(null);
    setSelectedHouseId(null);

    // Fly map to first house in city (if any)
    if (city === "") {
      if (mapRef.current) {
        mapRef.current.flyTo([35.6892, 51.389], 12);
      }
    } else {
      const cityHouse = houses.find((h) => h.city === city);
      if (cityHouse && mapRef.current) {
        mapRef.current.flyTo([cityHouse.lat, cityHouse.lng], 13);
      }
    }
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

  // Reset filtered houses on mount
  useEffect(() => {
    setMapFilteredHouses(houses);
  }, []);

  return (
    <>
    <HouseFilters
            cities={uniqueCities}
            filters={{ city: selectedCity, search: searchTerm }}
            onChange={({ city, search }) => {
              setSelectedCity(city);
              setSearchTerm(search);
              setModalHouse(null);
              setSelectedHouseId(null);

              // موقع انتخاب شهر، مپ رو ببر رو اون شهر
              if (city === "") {
                mapRef.current?.flyTo([35.6892, 51.389], 12);
              } else {
                const cityHouse = houses.find((h) => h.city === city);
                if (cityHouse && mapRef.current) {
                  mapRef.current.flyTo([cityHouse.lat, cityHouse.lng], 13);
                }
              }
            }}
          />
    <div className={`h-screen w-full ${isMobile ? "relative" : "flex"}`}>
    
      
        
      {(!isMobile || mobileView === "map") && (
        <div className="flex-1 relative h-full w-[100%]">
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

            <HouseMarkers
              houses={isMobile ? houses : desktopFilteredHouses}
              zoom={zoom}
              selectedHouseId={selectedHouseId}
              setModalHouse={setModalHouse}
              setSelectedHouseId={setSelectedHouseId}
              isMobile={isMobile}
            />

            <HouseMapEvents
              setFilteredHouses={setMapFilteredHouses}
              setZoom={setZoom}
              setModalHouse={setModalHouse}
              isMobile={isMobile}
              allHouses={houses}
            />
          </MapContainer>

          

          {/* Floating House Card */}
          {modalHouse && (
            <HouseModal
              house={modalHouse}
              onClose={() => setModalHouse(null)}
            />
          )}
        </div>
      )}

      {/* Desktop side list */}
      {(!isMobile || mobileView === "list") && !isMobile && (
        <HouseListDesktop
          houses={desktopFilteredHouses}
          onSelect={handleHouseSelect}
        />
      )}
      {/* Mobile list */}

      {isMobile && mobileView === "list" && (
        <HouseListMobile houses={mobileFilteredHouses} />
      )}

      {/* Mobile bottom bar to switch between map/list */}
      {isMobile && (
        <MobileViewToggle
          currentView={mobileView}
          onToggle={() =>
            setMobileView((prev) => (prev === "map" ? "list" : "map"))
          }
        />
      )}
    </div>
    </>
  );
}
