import React from "react";

interface ProgressBarProps {
    message: string;
    color: string;
}

const ProgressBar = ({ message, color }: ProgressBarProps) => {
    return (
        <div
            style={{ width: "150px" }}
            className={`bg-${color}-100 text-xs border border-${color}-400 text-${color}-700 px-2 py-1 rounded relative mt-4 flex items-center`}
            role="alert"
        >
            <i className="material-icons text-base mr-1">timelapse</i>
            <div className="block sm:inline">
                {message}
                <span className="dot first-dot">.</span>
                <span className="dot second-dot">.</span>
                <span className="dot third-dot">.</span>
            </div>
        </div>
    );
};

const SolvingProgressBar = () => (
    <ProgressBar message="Solving board" color="orange" />
);

const AnimatingProgressBar = () => (
    <ProgressBar message="Now animating" color="gray" />
);

export { SolvingProgressBar, AnimatingProgressBar };
