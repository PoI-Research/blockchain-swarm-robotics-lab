import React, { FunctionComponent, ReactElement, useState } from "react";
import { ExperimentDataView, ExperimentForm, Queue } from "./components";
import { Experiment } from "./model/experiment";

export const App: FunctionComponent = (): ReactElement => {
    const [queue, setQueue] = useState<Experiment[]>([]);

    const addToQueue = (experiment: Experiment) => {
        setQueue((queue) => {
            const newQueue = [ ...queue, experiment ];

            return newQueue;
        });
    };

    return (
        <>
            <ExperimentForm addToQueue={addToQueue} />
            <Queue queue={ queue } />
            <ExperimentDataView />
        </>
    );
};
