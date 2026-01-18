import { useRouter } from "next/navigation";
import React from "react";

const WaypointDisplay = ({ title, distance }) => {
    let router = useRouter();
  return (
    <div className="mb-4 p-4 border-2 rounded-xl flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p>• 3 quests available</p>
        {distance ? <p>• {distance} km away</p> : null}
      </div>
      <button onClick={()=> {router.push("/questview")}} className="mr-2 px-3 py-2 h-full bg-blue-400 rounded-md font-semibold">Start Now</button>
    </div>
  );
};

export default WaypointDisplay;
