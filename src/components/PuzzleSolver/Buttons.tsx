import React from "react";

interface ButtonsProps {
    firstBtnOnClick: () => void;
    secondBtnOnClick: () => void;
    thirdBtnOnClick: () => void;
}

export const Buttons = (props: ButtonsProps): JSX.Element => (
    <div className="flex flex-row mt-5 justify-center">
        <button onClick={props.firstBtnOnClick} className="control-btn">
            Randomize
        </button>
        <button onClick={props.secondBtnOnClick} className="control-btn">
            <i className="material-icons text-lg">pause</i> Pause
        </button>
        <button onClick={props.thirdBtnOnClick} className="control-btn">
            <i className="material-icons text-lg">replay</i> Restart
        </button>
    </div>
);
