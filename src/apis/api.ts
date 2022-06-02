import { Experiment, ExperimentData } from "../model";

const endpoint = process.env.REACT_APP_ENDPOINT;

export const getQueue = (): Promise<Experiment[]> => {
    return fetch(`${ endpoint }/queue`).then(async (response: Response) => {
        const queue = await response.json();
        console.log(queue);

        return Promise.resolve(queue);
    });
}

export const getExperimentData = (): Promise<ExperimentData[]> => {
    return fetch(`${ endpoint }/experiment-data`).then(async (response: Response) => {
        const queue = await response.json();
        console.log(queue);

        return Promise.resolve(queue);
    });
};
