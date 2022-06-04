import { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { clearExperimentData, deleteExperimentData, getExperimentData } from "../apis";
import { EXPERIMENT_DATA } from "../constants";
import { ExperimentData } from "../model";
import { socket } from "../utils";

export const ExperimentDataView: FunctionComponent = (): ReactElement => {
    const [ liveData, setLiveData ] = useState<ExperimentData[]>([]);
    const init = useRef(true);

    useEffect(() => {
        getExperimentData()
            .then((response) => {
                setLiveData(response);
            })
            .finally(() => {
                if (init.current) {
                    socket.on(EXPERIMENT_DATA, (data: ExperimentData) => {
                        setLiveData((liveData) => {
                            const newData = [ ...liveData, data ];

                            return newData;
                        });
                    });

                    init.current = false;
                }
            });

        return () => {
            socket.off(EXPERIMENT_DATA);
        };
    }, []);

    const clearData = (): void => {
        clearExperimentData().then(() => getExperimentData().then((response) => setLiveData(response)));
    };

    const deleteExperiment = (id: number) => {
        deleteExperimentData(id).then(() => getExperimentData().then((response) => setLiveData(response)));
    };

    return (
        <div>
            <input type="button" value="Clear Data" onClick={ clearData } />
            { liveData.map((experimentData: ExperimentData, index: number) => (
                <div key={ index }>
                    <span>{ experimentData.decisionRule }</span>
                    <span>{ experimentData.byzantineSwarmStyle }</span>
                    <span>{ experimentData.consensusAlgorithm }</span>
                    <span>{ experimentData.isClassical }</span>
                    <span>{ experimentData.percentageOfBlackTiles }</span>
                    <span>{ experimentData.numberOfByzantineRobots }</span>
                    <span>{ experimentData.numberOfRobots }</span>
                    <span>{ experimentData.secondsTaken }</span>
                    <span>{ experimentData.numberOfBlacks }</span>
                    <span>{ experimentData.numberOfWhites }</span>
                    <input type="button" value="Delete" onClick={ () => deleteExperiment(index) } />
                </div>
            )) }
        </div>
    );
};
