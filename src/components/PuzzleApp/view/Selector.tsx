import React, { ChangeEvent } from "react";
import { AlgorithmType, HeuristicType } from "../../../utils/types";

interface SelectorProps {
    onDimensionChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    onAlgorithmChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    onHeuristicChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

interface DropdownProps {
    onOptionChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    optionValues: (AlgorithmType | HeuristicType | number)[];
    displayedValues: (string | number)[];
}

const Dropdown = (props: DropdownProps) => (
    <div className="inline-block relative mb-2">
        <select
            data-testid="select-dimension"
            onChange={props.onOptionChange}
            className="block appearance-none w-full bg-white hover:border-gray-500 pl-2 pr-6 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
            {props.optionValues.map((n, idx: number) => (
                <option key={idx} value={n}>
                    {props.displayedValues[idx]}
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
);

export const Selector = React.memo(
    (props: SelectorProps): JSX.Element => {
        return (
            <div className="text-sm">
                <div>
                    Select the dimension of puzzle:{" "}
                    <Dropdown
                        onOptionChange={props.onDimensionChange}
                        optionValues={[2, 3, 4, 5]}
                        displayedValues={["2", "3", "4", "5"]}
                    />
                </div>
                <div>
                    Algorithm:
                    <Dropdown
                        onOptionChange={props.onAlgorithmChange}
                        optionValues={[
                            AlgorithmType.A_STAR,
                            AlgorithmType.ID_A_STAR,
                        ]}
                        displayedValues={["A*", "IDA*"]}
                    />
                </div>
                <div className="mb-6">
                    Heuristic:
                    <Dropdown
                        onOptionChange={props.onHeuristicChange}
                        optionValues={[
                            HeuristicType.MANHATTAN,
                            HeuristicType.LINEAR_CONFLICT,
                            HeuristicType.WALKING_DISTANCE,
                            HeuristicType.PATTERN_DB,
                        ]}
                        displayedValues={[
                            "Manhattan",
                            "Manhattan + Linear Conflict",
                            "Walking Distance",
                            "Pattern Database",
                        ]}
                    />
                </div>
            </div>
        );
    }
);
