import { FunctionComponent, ReactElement, useState } from "react";
import { getQueue } from "../apis";
import { Experiment } from "../model";
import { RUN_EXPERIMENTS } from "../constants";
import { socket } from "../utils";

interface QueueProps {
    queue: Experiment[];
}
export const Queue: FunctionComponent<QueueProps> = (props: QueueProps): ReactElement => {
    const { queue } = props;

    const [queueFromDB, setQueueFromDB] = useState<Experiment[]>([]);

    const importFromDB = (): void => {
        getQueue().then(response=>setQueueFromDB(response));
    }

    const runExperiment = (): void => {
        socket.emit(RUN_EXPERIMENTS, {...queue});
    }

    const generateQueueElement = (experiment: Experiment, index: number): ReactElement => {
        return (
                    <div key={index}>
                        <span>{ experiment.decisionRule }</span>
                        <span>{ experiment.byzantineSwarmStyle }</span>
                        <span>{ experiment.consensusAlgorithm }</span>
                        <span>{ experiment.useClassicalApproach }</span>
                        <span>{ experiment.percentageOfBlackTiles }</span>
                        <span>{ experiment.numberOfByzantineRobots }</span>
                        <span>{ experiment.numberOfRobots }</span>
                    </div>
                );
    }
    return (
        <div>
            <input type="button" value="Import" onClick={importFromDB} />
            { queue.map((experiment: Experiment, index: number) => generateQueueElement(experiment, index)) }
            {
                queueFromDB.map((experiment: Experiment, index: number) => generateQueueElement(experiment, index))
            }
            <input type="button" value="Run Experiment" onClick={runExperiment} />
        </div>
    );
};
