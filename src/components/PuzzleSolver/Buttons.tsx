import React from "react";

interface ButtonsProps {
    paused: boolean;
    randBtnOnClick: () => void;
    solveBtnOnClick: () => void;
    pauseBtnOnClick: () => void;
    restartBtnOnClick: () => void;
}

export const Buttons = (props: ButtonsProps): JSX.Element => (
    <div className="flex flex-row mt-5 justify-center">
        <button onClick={props.randBtnOnClick} className="control-btn">
            Randomize
        </button>
        {props.paused ? (
            <button onClick={props.solveBtnOnClick} className="control-btn">
                <i className="material-icons text-lg">play_arrow</i> Solve
            </button>
        ) : (
            <button onClick={props.pauseBtnOnClick} className="control-btn">
                <i className="material-icons text-lg">pause</i> Pause
            </button>
        )}
        <button onClick={props.restartBtnOnClick} className="control-btn">
            <i className="material-icons text-lg">replay</i> Restart
        </button>
    </div>
);
