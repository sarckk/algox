import React, { ChangeEvent } from "react";
import { Selector } from "./Selector";
import { Buttons } from "./Buttons";
import { Board } from "./Board";
import { shuffle } from "../../utils/shuffle";

interface PuzzleSolverState {
    tiles: number[];
}

class PuzzleSolver extends React.Component<any, PuzzleSolverState> {
    constructor(props: any) {
        super(props);

        const initialDimension = 2;
        let tiles = [...Array(initialDimension ** 2).keys()];
        shuffle(tiles);

        this.state = {
            tiles,
        };

        this.generateNewTiles = this.generateNewTiles.bind(this);
        this.randomizeTiles = this.randomizeTiles.bind(this);
    }

    generateNewTiles(e: ChangeEvent<HTMLSelectElement>): void {
        const newDimension = Number(e.target.value);
        let tiles = [...Array(newDimension ** 2).keys()];

        this.setState({
            tiles: shuffle(tiles),
        });
    }

    randomizeTiles() {
        this.setState({
            tiles: shuffle(this.state.tiles),
        });
    }

    togglePause() {
        alert("Toggle pause");
    }

    restart() {
        alert("Restarting");
    }

    render() {
        return (
            <div className="flex flex-col items-center justify-center">
                <Selector onOptionChange={this.generateNewTiles} />
                <div className="flex flex-col items-center justify-center">
                    <Board tiles={this.state.tiles} />
                    <Buttons
                        firstBtnOnClick={this.randomizeTiles}
                        secondBtnOnClick={this.togglePause}
                        thirdBtnOnClick={this.restart}
                    />
                </div>
            </div>
        );
    }
}

export default PuzzleSolver;
