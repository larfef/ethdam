import React from "react";

const Menu = () => {
  return (
    <div className="w-full bg-gradient-to-r from-gray-800 to-gray-900 h-16 flex items-center justify-between px-6 shadow-md fixed top-0 z-50">
      <div className="text-white font-black text-3xl tracking-wide uppercase">
        B3TTY
      </div>
      <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500">
        Connect Wallet
      </button>
    </div>
  );
};

export default Menu;
