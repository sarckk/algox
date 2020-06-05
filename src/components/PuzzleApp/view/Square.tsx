import React from "react";

interface SquareState {
    value: number;
    index: number;
    swapFn(index: number): void;
}

export const Square = (props: SquareState) => (
    <div
        className={`inline-flex justify-center text-sm items-center h-16 w-16 font-mono align-top ${
            props.value === 0 ? "" : "bg-white square"
        }`}
        onClick={() => props.swapFn(props.index)}
    >
        {props.value !== 0 && props.value}
    </div>
);
