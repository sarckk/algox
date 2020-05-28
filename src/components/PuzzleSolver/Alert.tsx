import React from "react";

export const Alert = () => (
    <div
        className="bg-red-100 text-xs border border-red-400 text-red-700 px-2 py-1 rounded relative mt-4 flex items-center"
        role="alert"
    >
        <i className="material-icons text-base mr-1">error_outline</i>
        <span className="block sm:inline">Board is unsolvable</span>
    </div>
);
