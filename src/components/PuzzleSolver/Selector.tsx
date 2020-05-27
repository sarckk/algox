import React, { ChangeEvent } from "react";

interface SelectorProps {
    onOptionChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const Selector = (props: SelectorProps): JSX.Element => {
    return (
        <div>
            Select dimension of puzzle:{" "}
            <div className="inline-block relative w-12 mb-4">
                <select
                    onChange={props.onOptionChange}
                    className="block appearance-none w-full bg-white hover:border-gray-500 px-2 pr-4 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n, idx) => (
                        <option key={idx} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
