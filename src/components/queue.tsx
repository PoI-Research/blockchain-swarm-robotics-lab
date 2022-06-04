import { FunctionComponent, ReactElement, useState } from "react";
import { RUN_EXPERIMENTS } from "../constants";
import { Experiment } from "../model";
import { socket } from "../utils";

interface QueueProps {
    queue: Experiment[];
    clearQueue: () => void;
    deleteAnExperiment: (id: number) => void;
}
export const Queue: FunctionComponent<QueueProps> = (props: QueueProps): ReactElement => {
    const { queue, clearQueue, deleteAnExperiment } = props;

    const [ repetitions, setRepetitions ] = useState<number>(15);

    const runExperiment = (): void => {
        socket.emit(RUN_EXPERIMENTS, repetitions);
    };

    const generateQueueElement = (experiment: Experiment, index: number): ReactElement => {
        return (
            <div key={ index }>
                <span>{ experiment?.decisionRule }</span>
                <span>{ experiment?.byzantineSwarmStyle }</span>
                <span>{ experiment?.consensusAlgorithm }</span>
                <span>{ experiment?.useClassicalApproach }</span>
                <span>{ experiment?.percentageOfBlackTiles }</span>
                <span>{ experiment?.numberOfByzantineRobots }</span>
                <span>{ experiment?.numberOfRobots }</span>
                <input type="button" value="Delete" onClick={ () => deleteAnExperiment(index) } />
            </div>
        );
    };

    return (
        <div>
            <input type="button" value="Clear Queue" onClick={ clearQueue } />
            { queue?.map((experiment: Experiment, index: number) => generateQueueElement(experiment, index)) }
            <input type="number" value={ repetitions } onChange={ (e) => setRepetitions(parseInt(e.target.value)) } />
            <input type="button" value="Run Experiment" onClick={ runExperiment } />
        </div>
    );
};
