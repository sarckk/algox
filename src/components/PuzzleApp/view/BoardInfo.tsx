import React from "react";
import { UnsolvableAlert, SolvableAlert, SolvedAlert } from "./Alerts";
import { SolverStatus } from "..";
import { SolvingProgressBar, AnimatingProgressBar } from "./ProgressBars";
import { Move } from "../model/Move";

interface StatsProps {
    msTaken: number;
    isSolvable: boolean;
    solverStatus: SolverStatus;
    inversions: number;
    numSteps: number;
    hScore: number;
    moves: Move[];
    numNodesExplored: number;
}

export const BoardInfo = React.memo((props: StatsProps) => {
    const isIdle: boolean = props.solverStatus === SolverStatus.IDLE;
    const isSolving: boolean = props.solverStatus === SolverStatus.SOLVING;
    const isAnimating: boolean = props.solverStatus === SolverStatus.ANIMATING;
    const isSolved: boolean = props.solverStatus === SolverStatus.SOLVED;

    return (
        <div className="px-6 ml-10 w-64">
            <div className="text-normal font-bold mb-3">Board Info</div>
            <div className="text-xs">
                <ul className="board-info-ul">
                    <li className="text-green-600 font-semibold">
                        {props.msTaken !== null &&
                            (props.msTaken === 0
                                ? "Solution found almost instantly"
                                : `Solution found in ${props.msTaken / 1000}s`)}
                    </li>
                    <li>Current inversion: {props.inversions}</li>
                    <li>Current h: {props.hScore}</li>
                    {!!props.numSteps && (
                        <li>{`# of moves: ${props.numSteps}`}</li>
                    )}
                    {!!props.numNodesExplored && (
                        <li>
                            {`# of nodes explored: ${props.numNodesExplored}`}
                        </li>
                    )}
                    {props.moves && (
                        <li>
                            <div>Solution path:</div>
                            {props.moves.map((m, i) => {
                                if (i === props.moves.length - 1) {
                                    return <span key={i}>{m.toString()}</span>;
                                }
                                return (
                                    <span key={i}>{`${m.toString()}, `}</span>
                                );
                            })}
                        </li>
                    )}
                </ul>
            </div>
            {isSolved && <SolvedAlert />}
            {isSolving && <SolvingProgressBar />}
            {isAnimating && <AnimatingProgressBar />}
            {isIdle &&
                (props.isSolvable ? <SolvableAlert /> : <UnsolvableAlert />)}
        </div>
    );
});
