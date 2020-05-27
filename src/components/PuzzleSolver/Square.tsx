import React from "react";

interface SquareState {
    value: number;
}

export const Square = (props: SquareState) => (
    <div className="inline-flex justify-center items-center h-12 w-12 border border-gray-500">
        {props.value}
    </div>
);
