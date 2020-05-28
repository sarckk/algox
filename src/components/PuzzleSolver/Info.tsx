import React from "react";

export const Info = () => (
    <div
        className="bg-green-100 text-xs border border-green-400 text-green-700 px-2 py-1 rounded relative mt-4 flex items-center"
        role="info"
    >
        <i className="material-icons text-base mr-1">done</i>
        <span className="block sm:inline">Board is solved</span>
    </div>
);
