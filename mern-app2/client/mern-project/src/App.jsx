import React, { useState } from "react";
import { FaPlus, FaVideo, FaBroadcastTower, FaEdit } from "react-icons/fa";

const App = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      {/* Create button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center bg-[#242526] text-white px-3 py-2 rounded-full hover:bg-[#3a3b3c] transition"
      >
        <FaPlus className="mr-1" />
        Create
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className=" mt-2 w-48 bg-[#242526] text-white rounded-xl shadow-lg py-2 z-50">
          <button className="flex items-center w-full px-4 py-2 hover:bg-[#3a3b3c] transition">
            <FaVideo className="mr-3" />
            Upload video
          </button>
          <button className="flex items-center w-full px-4 py-2 hover:bg-[#3a3b3c] transition">
            <FaBroadcastTower className="mr-3" />
            Go live
          </button>
          <button className="flex items-center w-full px-4 py-2 hover:bg-[#3a3b3c] transition">
            <FaEdit className="mr-3" />
            Create post
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

