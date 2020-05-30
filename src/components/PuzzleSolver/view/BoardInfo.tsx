import React from "react";
import { UnsolvableAlert, SolvableAlert, SolvedAlert } from "./Alerts";
import { ProgressBar } from "./ProgressBar";
import { SolverStatus } from "../controller/PuzzleSolver";

interface StatsProps {
    msTaken: number;
    isSolvable: boolean;
    solverStatus: SolverStatus;
    inversions: number;
    manhattan: number;
    numSteps: number;
}

export const BoardInfo = React.memo((props: StatsProps) => {
    const isIdle: boolean = props.solverStatus === SolverStatus.IDLE;
    const isSolving: boolean = props.solverStatus === SolverStatus.SOLVING;
    const isSolved: boolean = props.solverStatus === SolverStatus.SOLVED;

    return (
        <div className="">
            <div className="text-normal font-bold mb-3">Board Info</div>
            <div className="text-xs">
                <ul>
                    <li className="text-green-600 font-semibold">
                        {props.msTaken !== null &&
                            (props.msTaken === 0
                                ? "Solution found almost instantly"
                                : `Solution found in ${props.msTaken / 1000}s`)}
                    </li>
                    <li>Current inversion: {props.inversions}</li>
                    <li>Current Manhattan distance: {props.manhattan} </li>
                    <li>
                        {(isSolving || isSolved) &&
                            `Step count: ${props.numSteps}`}
                    </li>
                </ul>
            </div>
            {isSolved && <SolvedAlert />}
            {isSolving && <ProgressBar stepsRemaining={props.manhattan} />}
            {isIdle &&
                (props.isSolvable ? <SolvableAlert /> : <UnsolvableAlert />)}
        </div>
    );
});
