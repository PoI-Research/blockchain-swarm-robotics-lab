import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { clearQueue, deleteExperiment, getQueue } from "./apis";
import { ExperimentDataView, ExperimentForm, Queue } from "./components";
import { Experiment } from "./model/experiment";

export const App: FunctionComponent = (): ReactElement => {
    const [queue, setQueue] = useState<Experiment[]>([]);

    useEffect(() => {
        getQueue().then((response: Experiment[]) => setQueue(response));
    }, []);

    const addToQueue = (experiments: Experiment[]): void => {
        setQueue(experiments);
    };

    const clearExperiments = (): void => {
        clearQueue().then(() => getQueue().then((response: Experiment[]) => setQueue(response)));
    }

    const deleteAnExperiment = (id: number): void => {
        deleteExperiment(id).then(() => getQueue().then((response: Experiment[]) => setQueue(response)));
    }

    return (
        <>
            <ExperimentForm addToQueue={ addToQueue } />
            <Queue queue={ queue } clearQueue={ clearExperiments } deleteAnExperiment={ deleteAnExperiment } />
            <ExperimentDataView />
        </>
    );
};
