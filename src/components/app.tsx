import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
} from "react-router-dom";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";
import PuzzleApp from "./PuzzleApp";
import ConvexHullSolver from "./ConvexHullSolver";

export const listOfLinks = ["convex-hull", "pathfinding", "sliding-puzzle"];

export const App = () => (
    <Router>
        <div className="flex h-screen justify-center">
            <div className="flex py-20 w-5/6">
                <aside className="pr-10 w-1/5">
                    <h1 className="mb-1 text-2xl">
                        Algo<sup className="font-mono">x</sup>
                    </h1>
                    <div className="mb-6 text-xs">Algorithms explorer</div>
                    <ul className="side-ul text-sm">
                        {listOfLinks.map((link, i) => (
                            <li key={`link${i}`}>
                                <NavLink
                                    to={`/${link}`}
                                    className="block"
                                    activeClassName="current-link"
                                >
                                    {link}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="py-2 px-4 w-4/5">
                    <Switch>
                        <Route path="/convex-hull">
                            <ConvexHullSolver />
                        </Route>
                        <Route path="/pathfinding">
                            <PathfindingVisualizer />
                        </Route>
                        <Route path="/sliding-puzzle">
                            <PuzzleApp />
                        </Route>
                    </Switch>
                </main>
            </div>
        </div>
    </Router>
);
