import React from "react";

interface ButtonProps {
    clickFn: () => void;
    txt: string;
    icon?: string;
    disabled?: boolean;
    additionalClass?: string;
}

export const Button = ({
    clickFn,
    txt,
    icon,
    disabled,
    additionalClass,
}: ButtonProps) => (
    <button
        disabled={disabled}
        onClick={clickFn}
        className={`control-btn ${additionalClass}`}
    >
        {icon && <i className="material-icons text-lg">{icon}</i>}
        {txt}
    </button>
);
