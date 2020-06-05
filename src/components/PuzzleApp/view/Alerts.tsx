import React from "react";

interface AlertProps {
    color: string;
    iconName: string; // from material icons
    message: string;
}

const Alert = ({ color, iconName, message }: AlertProps) => (
    <div
        style={{ width: "150px" }}
        className={`bg-${color}-100 text-xs border border-${color}-400 text-${color}-700 px-2 py-1 rounded relative mt-4 flex items-center`}
        role="alert"
    >
        <i className="material-icons text-base mr-1">{iconName}</i>
        <span className="block sm:inline">{message}</span>
    </div>
);

const UnsolvableAlert = () => (
    <Alert color="red" iconName="error_outline" message="Board is unsolvable" />
);

const SolvableAlert = () => (
    <Alert color="blue" iconName="thumb_up" message="Board is solvable" />
);

const SolvedAlert = () => (
    <Alert color="green" iconName="done" message="Board solved" />
);

export { UnsolvableAlert, SolvableAlert, SolvedAlert };
