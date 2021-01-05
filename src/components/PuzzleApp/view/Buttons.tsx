import React from "react";
import { SolverStatus } from "..";
import { Button } from "../../../utils/shared/Button";

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
                <Button clickFn={props.randBtnOnClick} txt="Randomize" />
                <Button
                    clickFn={props.solveBtnOnClick}
                    txt="Solve"
                    icon="play_arrow"
                    disabled={disableInteraction}
                />
                <Button
                    clickFn={props.restartBtnOnClick}
                    txt="Restart"
                    icon="replay"
                    disabled={disableInteraction}
                />
            </div>
        );
    }
);
