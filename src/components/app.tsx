import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
} from "react-router-dom";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";
import SortingVisualizer from "./SortingVisualizer/SortingVisualizer";
import PuzzleSolver from "./PuzzleSolver/PuzzleSolver";

export const listOfLinks = ["sorting", "pathfinding", "sliding-puzzle"];

export const App = () => (
    <Router>
        <div className="flex h-screen justify-center">
            <div className="flex py-20 w-7/12">
                <aside className="pr-10">
                    <h1 className="mb-1 text-2xl">
                        Algo<sup className="font-mono">x</sup>
                    </h1>
                    <div className="mb-6 text-xs">Algorithms visualised</div>
                    <ul className="side-ul text-sm">
                        {listOfLinks.map((link, i) => (
                            <li key={`link${i}`}>
                                <NavLink
                                    to={`/${link}`}
                                    activeClassName="current-link"
                                >
                                    {link}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="py-2 w-2/3">
                    <Switch>
                        <Route path="/sorting">
                            <SortingVisualizer />
                        </Route>
                        <Route path="/pathfinding">
                            <PathfindingVisualizer />
                        </Route>
                        <Route path="/sliding-puzzle">
                            <PuzzleSolver />
                        </Route>
                    </Switch>
                </main>
            </div>
        </div>
    </Router>
);
