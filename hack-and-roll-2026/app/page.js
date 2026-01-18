"use client";

import Footer from "@/components/Footer";
import GoogleMaps from "@/components/GoogleMaps";
import Header from "@/components/Header";
import WaypointDisplay from "@/components/WaypointDisplay";
import { db } from "../lib/firebase"; // Ensure db is imported
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.

export default function Home() {
  const docRef = doc(db, "miniWaypoint", `testplayer-central_hub`);

  // What I need to do:
  // I need to attach a listener to every button. On button press to start region
  // Update the region value in the firestore database. At the same time pass regionChanged variable
  // state which is used to update the UI (setting up a listener is 10x more tedious)
  // This tracks all the regions.
  // Next: I need to track all the waypoints within the regions and the status.
  // I need to grab all the waypoint, for each waypoint grab the player-waypoint status, default as incomplete.
  // Create a new record if the record does not already exist.

  // I need to use the AI-generated data and add it into the miniWaypoint table.

  // Regions
  const regions = {
    central: [
      {
        key: "central",
        name: "Central Region, SG",
        location: { lat: 1.3006, lng: 103.8448 },
      },
      {
        key: "central_hub",
        name: "Orchard Road",
        location: { lat: 1.3048, lng: 103.8318 },
      },
      {
        key: "fort_canning",
        name: "Fort Canning Park",
        location: { lat: 1.2953, lng: 103.8466 },
      },
      {
        key: "somerset",
        name: "Somerset Skatepark",
        location: { lat: 1.3002, lng: 103.838 },
      },
      {
        key: "emerald_hill",
        name: "Emerald Hill",
        location: { lat: 1.3039, lng: 103.8392 },
      },
      {
        key: "newton",
        name: "Newton Food Centre",
        location: { lat: 1.3123, lng: 103.8379 },
      },
      {
        key: "tanjong_pagar",
        name: "Tanjong Pagar",
        location: { lat: 1.2764, lng: 103.8439 },
      },
    ],
    west: [
      {
        key: "west",
        name: "West Region, SG",
        location: { lat: 1.3328, lng: 103.7423 },
      },
      {
        key: "west_hub",
        name: "Jurong East",
        location: { lat: 1.3329, lng: 103.7436 },
      },
      {
        key: "chinese_garden",
        name: "Chinese Garden",
        location: { lat: 1.3387, lng: 103.73 },
      },
      {
        key: "pandan_reservoir",
        name: "Pandan Reservoir",
        location: { lat: 1.3175, lng: 103.7485 },
      },
      {
        key: "imm",
        name: "IMM Mall",
        location: { lat: 1.3345, lng: 103.7468 },
      },
      {
        key: "science_centre",
        name: "Science Centre",
        location: { lat: 1.3325, lng: 103.7348 },
      },
      {
        key: "west_coast",
        name: "West Coast Park",
        location: { lat: 1.2985, lng: 103.7634 },
      },
    ],
    north: [
      {
        key: "north",
        name: "North Region, SG",
        location: { lat: 1.436, lng: 103.7858 },
      },
      {
        key: "north_hub",
        name: "Woodlands",
        location: { lat: 1.4368, lng: 103.7865 },
      },
      {
        key: "admiralty_park",
        name: "Admiralty Park",
        location: { lat: 1.4442, lng: 103.7834 },
      },
      {
        key: "causeway_point",
        name: "Causeway Point",
        location: { lat: 1.4361, lng: 103.7859 },
      },
      {
        key: "marsiling_park",
        name: "Marsiling Park",
        location: { lat: 1.4385, lng: 103.7745 },
      },
      {
        key: "waterfront",
        name: "Woodlands Waterfront",
        location: { lat: 1.4533, lng: 103.7806 },
      },
      {
        key: "sembawang_park",
        name: "Sembawang Park",
        location: { lat: 1.4632, lng: 103.8365 },
      },
    ],
    south: [
      {
        key: "south",
        name: "South Region, SG",
        location: { lat: 1.265, lng: 103.818 },
      },
      {
        key: "south_hub",
        name: "HarbourFront",
        location: { lat: 1.2653, lng: 103.821 },
      },
      {
        key: "keppel_bay",
        name: "Keppel Bay",
        location: { lat: 1.2635, lng: 103.813 },
      },
      {
        key: "mount_faber",
        name: "Mount Faber Peak",
        location: { lat: 1.273, lng: 103.8185 },
      },
      {
        key: "telok_blangah",
        name: "Telok Blangah Hill",
        location: { lat: 1.2785, lng: 103.8106 },
      },
      {
        key: "vivocity",
        name: "VivoCity Promenade",
        location: { lat: 1.2642, lng: 103.8225 },
      },
      {
        key: "sentosa_siloso",
        name: "Siloso Beach",
        location: { lat: 1.2592, lng: 103.8115 },
      },
    ],
    east: [
      {
        key: "east",
        name: "East Region, SG",
        location: {
          lat: 1.3528,
          lng: 103.9445,
        },
      },
      {
        key: "east_hub",
        name: "Tampines",
        location: { lat: 1.3525, lng: 103.9447 },
      },
      {
        key: "sun_plaza",
        name: "Sun Plaza Park",
        location: { lat: 1.3592, lng: 103.9455 },
      },
      {
        key: "eco_green",
        name: "Tampines Eco Green",
        location: { lat: 1.3597, lng: 103.9388 },
      },
      {
        key: "bedok_res",
        name: "Bedok Reservoir",
        location: { lat: 1.3415, lng: 103.9325 },
      },
      {
        key: "simei",
        name: "Simei Park",
        location: { lat: 1.3435, lng: 103.953 },
      },
      {
        key: "pasir_ris",
        name: "Pasir Ris Park",
        location: { lat: 1.3756, lng: 103.9542 },
      },
    ],
  };

  const locations = [
    { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
    { key: "tarongaZoo", location: { lat: -33.8472767, lng: 151.2188164 } },
    { key: "manlyBeach", location: { lat: -33.8209738, lng: 151.2563253 } },
    { key: "hyderPark", location: { lat: -33.8690081, lng: 151.2052393 } },
    { key: "theRocks", location: { lat: -33.8587568, lng: 151.2058246 } },
    { key: "circularQuay", location: { lat: -33.858761, lng: 151.2055688 } },
    { key: "harbourBridge", location: { lat: -33.852228, lng: 151.2038374 } },
    { key: "kingsCross", location: { lat: -33.8737375, lng: 151.222569 } },
    { key: "botanicGardens", location: { lat: -33.864167, lng: 151.216387 } },
    { key: "museumOfSydney", location: { lat: -33.8636005, lng: 151.2092542 } },
    { key: "maritimeMuseum", location: { lat: -33.869395, lng: 151.198648 } },
    {
      key: "kingStreetWharf",
      location: { lat: -33.8665445, lng: 151.1989808 },
    },
    { key: "aquarium", location: { lat: -33.869627, lng: 151.202146 } },
    { key: "darlingHarbour", location: { lat: -33.87488, lng: 151.1987113 } },
    { key: "barangaroo", location: { lat: -33.8605523, lng: 151.1972205 } },
  ];

  useEffect(() => {
    const syncData = async () => {
      for (const waypoint of Object.values(regions)) {
        for (const miniWaypoint of waypoint) {
          await setDoc(doc(db, "miniWaypoint", miniWaypoint.key), {miniWaypoint});
        }

        // Use modular syntax for Client-side Firebase
      }
    };

    syncData();
  }, []);

  return (
    <div className="min-h-screen h-full bg-white">
      <Header />
      <h1
        className="text-2xl m-4 text-black font-bold"
        onClick={() => {
          createWaypoints;
        }}
      >
        Get started with a waypoint
      </h1>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
        <Map
          style={{ width: "100vw", height: "40vh" }}
          defaultCenter={{ lat: 1.364, lng: 103.8 }}
          defaultZoom={10.7}
          gestureHandling="greedy"
          disableDefaultUI
          mapId={"6f4a75fc1d628b7c8c817bc6"}
        >
          <RegionMarkers locations={regions} />
        </Map>
      </APIProvider>
      <div className="p-4 text-black">
        <h3 className="font-bold text-xl">Current Region: North Region, SG</h3>
        <p>0/6 waypoints completed</p>

        <h3 className="mt-4 font-bold text-xl">View remaining waypoints</h3>
        <WaypointDisplay title="Ayer Rajah" distance={2} />
        <WaypointDisplay title="West Coast" distance={3.2} />
        <WaypointDisplay title="Ayer Rajah" distance={2} />
        <WaypointDisplay title="West Coast" distance={3.2} />
        <WaypointDisplay title="Ayer Rajah" distance={2} />
        <WaypointDisplay title="West Coast" distance={3.2} />
        <div className="mt-16"></div>
      </div>

      <Footer />
    </div>
  );
}

const RegionMarkers = ({ locations }) => {
  let router = useRouter();
  const [regionSelected, setRegionSelected] = useState(null);
  const [marker, setMarker] = useState(null);
  const map = useMap();

  const regions = ["west", "south", "central", "east", "north"];

  function handleRegionClick(miniWaypoint) {
    map.panTo(miniWaypoint.location);
    setTimeout(() => {
      map.setZoom(12.5);
    }, 300);
  }

  function handleMiniClick(miniWaypoint) {
    map.panTo(miniWaypoint.location);
    setTimeout(() => {
      map.setZoom(14);
    }, 300);
  }

  return (
    <>
      {Object.entries(locations).map(([regionValue, region]) => {
        return region.map((miniWaypoint) => {
          if (regions.includes(miniWaypoint.key)) {
            return (
              <div>
                <AdvancedMarker
                  key={miniWaypoint.name}
                  position={miniWaypoint.location}
                  onClick={() => {
                    handleRegionClick(miniWaypoint);
                    setMarker(miniWaypoint);
                  }}
                >
                  <Pin
                    scale={1.5}
                    background={"#FF0000"}
                    glyphColor={"#000"}
                    borderColor={"#000"}
                  ></Pin>
                </AdvancedMarker>
                {marker?.key == miniWaypoint.key && (
                  <InfoWindow
                    position={miniWaypoint.location}
                    onCloseClick={() => setMarker(null)}
                    headerDisabled={true}
                  >
                    <div className="p-2 w-[200px] relative text-black">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg  font-bold">
                          {miniWaypoint.name}
                        </h2>
                        <img
                          onClick={() => {
                            setMarker(null);
                          }}
                          src="images/close.png"
                          className="max-h-[14px] cursor-pointer"
                        />
                      </div>

                      <p>6 waypoints available</p>
                      <button
                        className="mt-4 py-2 px-3 bg-cyan-300 rounded-md cursor-pointer"
                        onClick={() => {
                          setMarker(null);
                          setRegionSelected(region[0].key);
                          map.setZoom(13.5);
                        }}
                      >
                        Begin Journey
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </div>
            );
          } else if (regionSelected == regionValue) {
            return (
              <div>
                <AdvancedMarker
                  key={miniWaypoint.name}
                  position={miniWaypoint.location}
                  onClick={() => {
                    handleMiniClick(miniWaypoint);
                    setMarker(miniWaypoint);
                  }}
                >
                  <Pin
                    background={"#FFFF00"}
                    glyphColor={"#000"}
                    borderColor={"#000"}
                  ></Pin>
                </AdvancedMarker>
                {marker?.key == miniWaypoint.key && (
                  <InfoWindow
                    position={miniWaypoint.location}
                    onCloseClick={() => setMarker(null)}
                    headerDisabled={true}
                  >
                    <div className="p-2 w-[200px] relative text-black">
                      <div className="flex justify-between items-center">
                        <h2 className="text-[18px] font-bold">
                          {miniWaypoint.name}
                        </h2>
                        <img
                          onClick={() => {
                            setMarker(null);
                          }}
                          src="images/close.png"
                          className="max-h-[14px] cursor-pointer"
                        />
                      </div>

                      <p>From {region[0].name}</p>
                      <button
                        className="px-3 py-2 bg-blue-400 font-bold mt-2 rounded-lg"
                        onClick={() => {
                          router.push("/questview");
                        }}
                      >
                        Begin quest
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </div>
            );
          }
        });
      })}
    </>
  );
};
