"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useRouter } from "next/navigation";

import "leaflet/dist/leaflet.css";
import { houses } from "./houses-data";
import type { House } from "./houses-data";
import HouseMapEvents from "../HouseMapEvents";
import HouseMarkers from "../HouseMarkers";
import HouseModal from "../HouseModal";
import HouseListDesktop from "../HouseListDesktop";
import HouseListMobile from "../HouseListMobile";
import MobileViewToggle from "@/components/MobileViewToggle";
import HouseFilters from "../HouseFilters";

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

  const uniqueCities = Array.from(new Set(houses.map((h) => h.city)));

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

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

  const desktopFilteredHouses = filterByCityAndSearch(
    mapFilteredHouses,
    selectedCity,
    searchTerm
  );

  const mobileFilteredHouses = filterByCityAndSearch(
    houses,
    selectedCity,
    searchTerm
  );

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

          if (city === "") {
            mapRef.current?.flyTo([32, 53], 5.2);
          } else {
            const cityHouse = houses.find((h) => h.city === city);
            if (cityHouse && mapRef.current) {
              mapRef.current.flyTo([cityHouse.lat, cityHouse.lng], 10);
            }
          }
        }}
      />
      <div className={`h-[calc(100vh-66px)] w-full ${isMobile ? "relative" : "flex"}`}>
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
