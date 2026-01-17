import React, { useState } from "react";

const Dropdown = ({taskName}) => {
  const [dropTrue, setDropTrue] = useState(false);

  return (
    <div className="w-full">
      {/* Container for the Header */}
      <div onClick={() => setDropTrue(!dropTrue)} className="cursor-pointer">
        <h2
          className={`flex bg-[#48B3AF] ml-2 mr-2 mt-4 pl-4 pt-4 pb-8 text-[20px] text-black transition-all duration-200
          ${dropTrue ? "rounded-t-lg" : "rounded-lg"}`}
        >
          <img
            src="images/arrow-down.png"
            className={`w-4 h-4 ml-2 mt-2 mr-3 transition-transform duration-200 ${dropTrue ? "rotate-180" : ""}`}
          />
          {taskName}
        </h2>
      </div>

      {/* The Dropdown Content */}
      {dropTrue && (
        <div
          className="bg-[#48B3AF] rounded-b-lg ml-2 mr-2 pl-4 pb-8 -mt-[1px] border-t border-blue-200/30"
          /* -mt-[1px] pulls the box up by 1 pixel to hide the white line/gap */
        >
          <h1 className="pb-4">Upload Picture!</h1>
          <img className="w-[340px] h-[210px] bg-black" />
        </div>
      )}
    </div>
  );
};

export default Dropdown;
