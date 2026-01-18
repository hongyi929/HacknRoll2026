"use client";

import Footer from "@/components/Footer";
import GoogleMaps from "@/components/GoogleMaps";
import Header from "@/components/Header";
import WaypointDisplay from "@/components/WaypointDisplay";
import { db } from "../lib/firebase"; // Ensure db is imported
import {
  getDoc,
  getDocs,
  doc,
  onSnapshot,
  setDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
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
const deg2rad = (deg) => deg * (Math.PI / 180);

// The client gets the API key from the environment variable `GEMINI_API_KEY`.

export default function Home() {
  const docRef = doc(db, "miniWaypoint", `testplayer-central_hub`);
  const [incompleteWaypoints, setIncompleteWaypoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState(null);
  const [regionDB, setRegionDB] = useState(null);

  const calculateDistance = (userPos, locationPos) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(userPos.lat - locationPos.lat);
    const dLon = deg2rad(userPos.lng - locationPos.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(locationPos.lat)) *
        Math.cos(deg2rad(userPos.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const [selectedRegion, setSelectedRegion] = useState(null);

  // What I need to do:
  // I need to attach a listener to every button. On button press to start region
  // Update the region value in the firestore database. At the same time pass regionChanged variable
  // state which is used to update the UI (setting up a listener is 10x more tedious)
  // This tracks all the regions.
  // Next: I need to track all the waypoints within the regions and the status.
  // I need to grab all the waypoint, for each waypoint grab the player-waypoint status, default as incomplete.
  // Create a new record if the record does not already exist.

  // I need to use the AI-generated data and add it into the miniWaypoint table.

  const regionList = ["north", "south", "east", "west", "central"];
  // Regions

  const fetchAllRegions = async () => {
    const querySnapshot = await getDocs(collection(db, "region"));

    const regionsData = querySnapshot.docs.map((doc) => ({
      id: doc.id, // The document ID (e.g., 'north')
      ...doc.data(), // The fields (name, location, etc.)
    }));

    console.log(regionsData);
    setRegionDB(regionsData);
  };

  const regions = {
  central: [
    {
      key: "central",
      name: "Central Region, SG",
      location: { lat: 1.3006, lng: 103.8448 },
      completed: false,
    },
    {
      key: "central_hub",
      name: "Orchard Road",
      location: { lat: 1.3048, lng: 103.8318 },
      completed: false,
    },
    {
      key: "fort_canning",
      name: "Fort Canning Park",
      location: { lat: 1.2953, lng: 103.8466 },
      completed: false,
    },
    {
      key: "somerset",
      name: "Somerset Skatepark",
      location: { lat: 1.3002, lng: 103.838 },
      completed: false,
    },
    {
      key: "emerald_hill",
      name: "Emerald Hill",
      location: { lat: 1.3039, lng: 103.8392 },
      completed: false,
    },
    {
      key: "newton",
      name: "Newton Food Centre",
      location: { lat: 1.3123, lng: 103.8379 },
      completed: false,
    },
    {
      key: "tanjong_pagar",
      name: "Tanjong Pagar",
      location: { lat: 1.2764, lng: 103.8439 },
      completed: false,
    },
  ],
  west: [
    {
      key: "west",
      name: "West Region, SG",
      location: { lat: 1.3328, lng: 103.7423 },
      completed: false,
    },
    {
      key: "nus_kent_ridge",
      name: "National University of Singapore",
      location: { lat: 1.2966, lng: 103.7764 },
      completed: false,
    },
    {
      key: "west_hub",
      name: "Jurong East",
      location: { lat: 1.3329, lng: 103.7436 },
      completed: false,
    },
    {
      key: "chinese_garden",
      name: "Chinese Garden",
      location: { lat: 1.3387, lng: 103.73 },
      completed: false,
    },
    {
      key: "pandan_reservoir",
      name: "Pandan Reservoir",
      location: { lat: 1.3175, lng: 103.7485 },
      completed: false,
    },
    {
      key: "imm",
      name: "IMM Mall",
      location: { lat: 1.3345, lng: 103.7468 },
      completed: false,
    },
    {
      key: "science_centre",
      name: "Science Centre",
      location: { lat: 1.3325, lng: 103.7348 },
      completed: false,
    },
    {
      key: "west_coast",
      name: "West Coast Park",
      location: { lat: 1.2985, lng: 103.7634 },
      completed: false,
    },
  ],
  north: [
    {
      key: "north",
      name: "North Region, SG",
      location: { lat: 1.436, lng: 103.7858 },
      completed: false,
    },
    {
      key: "north_hub",
      name: "Woodlands",
      location: { lat: 1.4368, lng: 103.7865 },
      completed: false,
    },
    {
      key: "admiralty_park",
      name: "Admiralty Park",
      location: { lat: 1.4442, lng: 103.7834 },
      completed: false,
    },
    {
      key: "causeway_point",
      name: "Causeway Point",
      location: { lat: 1.4361, lng: 103.7859 },
      completed: false,
    },
    {
      key: "marsiling_park",
      name: "Marsiling Park",
      location: { lat: 1.4385, lng: 103.7745 },
      completed: false,
    },
    {
      key: "waterfront",
      name: "Woodlands Waterfront",
      location: { lat: 1.4533, lng: 103.7806 },
      completed: false,
    },
    {
      key: "sembawang_park",
      name: "Sembawang Park",
      location: { lat: 1.4632, lng: 103.8365 },
      completed: false,
    },
  ],
  south: [
    {
      key: "south",
      name: "South Region, SG",
      location: { lat: 1.265, lng: 103.818 },
      completed: false,
    },
    {
      key: "south_hub",
      name: "HarbourFront",
      location: { lat: 1.2653, lng: 103.821 },
      completed: false,
    },
    {
      key: "keppel_bay",
      name: "Keppel Bay",
      location: { lat: 1.2635, lng: 103.813 },
      completed: false,
    },
    {
      key: "mount_faber",
      name: "Mount Faber Peak",
      location: { lat: 1.273, lng: 103.8185 },
      completed: false,
    },
    {
      key: "telok_blangah",
      name: "Telok Blangah Hill",
      location: { lat: 1.2785, lng: 103.8106 },
      completed: false,
    },
    {
      key: "vivocity",
      name: "VivoCity Promenade",
      location: { lat: 1.2642, lng: 103.8225 },
      completed: false,
    },
    {
      key: "sentosa_siloso",
      name: "Siloso Beach",
      location: { lat: 1.2592, lng: 103.8115 },
      completed: false,
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
      completed: false,
    },
    {
      key: "east_hub",
      name: "Tampines",
      location: { lat: 1.3525, lng: 103.9447 },
      completed: false,
    },
    {
      key: "sun_plaza",
      name: "Sun Plaza Park",
      location: { lat: 1.3592, lng: 103.9455 },
      completed: false,
    },
    {
      key: "eco_green",
      name: "Tampines Eco Green",
      location: { lat: 1.3597, lng: 103.9388 },
      completed: false,
    },
    {
      key: "bedok_res",
      name: "Bedok Reservoir",
      location: { lat: 1.3415, lng: 103.9325 },
      completed: false,
    },
    {
      key: "simei",
      name: "Simei Park",
      location: { lat: 1.3435, lng: 103.953 },
      completed: false,
    },
    {
      key: "pasir_ris",
      name: "Pasir Ris Park",
      location: { lat: 1.3756, lng: 103.9542 },
      completed: false,
    },
  ],
};

  useEffect(() => {
    const syncData = async () => {
      for (const [regionKey, waypointArray] of Object.entries(regions)) {
        for (const miniWaypoint of waypointArray) {
          if (regionList.includes(miniWaypoint.key)) {
            null;
          } else {
            const docRef = doc(db, "miniWaypoint", miniWaypoint.key);

            await setDoc(
              docRef,
              {
                key: miniWaypoint.key,
                name: miniWaypoint.name,
                location: miniWaypoint.location,
                region: regionKey, // This adds the "west", "east", etc. attribute
                lastUpdated: new Date(), // Good practice to track when you synced
                completed: false,
              },
              { merge: true },
            );
          }
        }

        // Use modular syntax for Client-side Firebase
      }
    };

    syncData();

    fetchAllRegions()

  }, []);

  // ADAM added - fetches incomplete waypoints
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPos(pos);
      });
    }

    const q = query(
      collection(db, "miniWaypoint"),
      where("completed", "==", false),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIncompleteWaypoints(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen h-full bg-white">
      <Header />
      <h1 className="text-2xl m-4 text-black font-bold">
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
          <RegionMarkers
            locations={regions}
            onRegionSelect={setSelectedRegion}
          />
        </Map>
      </APIProvider>
      <div className="p-4 text-black">
        <h3 className="font-bold text-xl">
          Current Region: {selectedRegion ? selectedRegion : "None Selected"}
        </h3>

        {(() => {
          const filteredWaypoints = selectedRegion
            ? incompleteWaypoints.filter(
                (wp) =>
                  wp.region === selectedRegion.split(",")[0].toLowerCase(),
              )
            : incompleteWaypoints;

          const regionCounts = {
            north: 7,
            south: 7,
            east: 7,
            west: 8,
            central: 7,
          };

          const totalInRegion = selectedRegion
            ? regionCounts[selectedRegion.split(",")[0].toLowerCase()] || 0
            : 31;

          return (
            <>
              <p className="font-semibold">
                {filteredWaypoints.length}/{totalInRegion} waypoints remaining
              </p>

              <h3 className="mt-4 font-bold text-xl">
                View remaining waypoints
              </h3>
              {loading ? (
                <p>Loading waypoints...</p>
              ) : filteredWaypoints.length > 0 ? (
                filteredWaypoints.map((waypoint) => (
                  <WaypointDisplay
                    key={waypoint.id}
                    title={waypoint.name}
                    distance={
                      userPos
                        ? calculateDistance(userPos, waypoint.location).toFixed(
                            2,
                          )
                        : "N/A"
                    }
                    waypoint={waypoint}
                  />
                ))
              ) : (
                <p>All waypoints completed!</p>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}

const RegionMarkers = ({ locations, onRegionSelect }) => {
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

  const regionCounts = {
    north: 6,
    south: 6,
    east: 6,
    west: 7,
    central: 6,
  };

  return (
    <>
      {Object.entries(locations).map(([regionValue, region]) => {
        return region.map((miniWaypoint, index) => {
          if (regions.includes(miniWaypoint.key)) {            
            return (
              <div key={`region-${miniWaypoint.key}`}>
                <AdvancedMarker
                  position={miniWaypoint.location}
                  onClick={() => {
                    handleRegionClick(miniWaypoint);
                    setRegionSelected(regionValue);
                    setMarker(miniWaypoint);
                    onRegionSelect(regionValue);
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

                      <p>
                        {`${regionCounts[regionValue]} waypoints available`}{" "}
                      </p>
                      <button
                        className="mt-4 py-2 px-3 bg-cyan-300 rounded-md cursor-pointer"
                        onClick={() => {
                          setMarker(null);
                          setRegionSelected(regionValue);
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
              <div key={`waypoint-${miniWaypoint.key}`}>
                <AdvancedMarker
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
                          const params = new URLSearchParams({
                            name: miniWaypoint.name,
                            lat: miniWaypoint.location.lat,
                            lng: miniWaypoint.location.lng,
                            key: miniWaypoint.key,
                          });
                          router.push(`/questview?${params.toString()}`);
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
