import React from "react";
import { SolverStatus } from "../controller/PuzzleSolver";

interface ButtonsProps {
    isSolvable: boolean;
    solverStatus: SolverStatus;
    randBtnOnClick: () => void;
    solveBtnOnClick: () => void;
    restartBtnOnClick: () => void;
}

export const Buttons = React.memo(
    (props: ButtonsProps): JSX.Element => {
        const disableInteraction: boolean =
            !props.isSolvable || props.solverStatus === SolverStatus.SOLVING;

        return (
            <div className="flex flex-row mt-5 justify-center">
                <button onClick={props.randBtnOnClick} className="control-btn">
                    Randomize
                </button>
                <button
                    disabled={disableInteraction}
                    onClick={props.solveBtnOnClick}
                    className="control-btn"
                >
                    <i className="material-icons text-lg">play_arrow</i> Solve
                </button>
                <button
                    disabled={disableInteraction}
                    onClick={props.restartBtnOnClick}
                    className="control-btn"
                >
                    <i className="material-icons text-lg">replay</i> Restart
                </button>
            </div>
        );
    }
);
