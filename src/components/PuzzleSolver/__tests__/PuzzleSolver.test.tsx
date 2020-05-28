import React from "react";
import PuzzleSolver from "../PuzzleSolver";
import { render, fireEvent } from "@testing-library/react";

describe("Puzzle solver", () => {
    it("Renders selector text", () => {
        const component = render(<PuzzleSolver />);
        expect(component.container).toHaveTextContent(
            "Select the dimension of puzzle:"
        );
    });

    it("Selecting new dimension renders corresponding board", () => {
        const { getByTestId } = render(<PuzzleSolver />);

        const select = getByTestId("select-dimension");
        fireEvent.change(select, { target: { value: 5 } });

        const board = getByTestId("board");
        expect(board.children.length).toBe(25);
    });
});
