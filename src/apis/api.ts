import { Experiment, ExperimentData } from "../model";

const endpoint = process.env.REACT_APP_ENDPOINT;

export const getQueue = (): Promise<Experiment[]> => {
    return fetch(`${ endpoint }/queue`).then(async (response: Response) => {
        const queue = await response.json();

        return Promise.resolve(queue);
    });
};

export const getExperimentData = (): Promise<ExperimentData[]> => {
    return fetch(`${ endpoint }/experiment-data`).then(async (response: Response) => {
        const experimentData = await response.json();

        return Promise.resolve(experimentData);
    });
};

export const addExperiment = (experiment: Experiment): Promise<void> => {
    const config: RequestInit = {
        method: "POST",
        body: JSON.stringify(experiment),
        headers: {
            "Content-Type": "application/json"
        }
    };

    return fetch(`${ endpoint }/queue`, config).then(async (response: Response) => {
        return Promise.resolve();
    });
};

export const clearQueue = (): Promise<void> => {
    return fetch(`${ endpoint }/queue`, { method: "DELETE" }).then(async (response: Response) => {
        return Promise.resolve();
    });
};

export const deleteExperiment = (id: number): Promise<void> => {
    return fetch(`${ endpoint }/queue/${ id }`, { method: "DELETE" }).then(async (response: Response) => {
        return Promise.resolve();
    });
};

export const clearExperimentData = (): Promise<void> => {
    return fetch(`${ endpoint }/experiment-data`, { method: "DELETE" }).then(async (response: Response) => {
        return Promise.resolve();
    });
};

export const deleteExperimentData = (id: number): Promise<void> => {
    return fetch(`${ endpoint }/experiment-data/${ id }`, { method: "DELETE" }).then(async (response: Response) => {
        return Promise.resolve();
    });
};
