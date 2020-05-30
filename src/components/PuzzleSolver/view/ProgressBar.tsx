import React from "react";

interface ProgressBarProps {
    stepsRemaining: number;
}

export const ProgressBar = (props: ProgressBarProps) => {
    return (
        <div
            style={{ width: "150px" }}
            className={`bg-gray-100 text-xs border border-gray-400 text-gray-700 px-2 py-1 rounded relative mt-4 flex items-center`}
            role="alert"
        >
            <i className="material-icons text-base mr-1">timelapse</i>
            <div className="block sm:inline">
                Now animating
                <span className="dot first-dot">.</span>
                <span className="dot second-dot">.</span>
                <span className="dot third-dot">.</span>
            </div>
        </div>
    );
};
