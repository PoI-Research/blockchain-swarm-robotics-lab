import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getExperimentData } from "../apis";
import { EXPERIMENT_DATA } from "../constants";
import { ExperimentData } from "../model";

const socket = io(process.env.REACT_APP_ENDPOINT as string);

export const ExperimentDataView: FunctionComponent = (): ReactElement => {
    const [ liveData, setLiveData ] = useState<ExperimentData[]>([]);

    useEffect(() => {
        socket.on("A", (a)=>console.log(a))
        getExperimentData()
            .then((response) => {
                setLiveData(response);
            })
            .finally(() => {
                socket.on(EXPERIMENT_DATA, (data: ExperimentData) => {
                    console.log(data);
                    setLiveData((liveData) => {
                        liveData.push(data);

                        return liveData;
                    });
                });
            });

        return () => {
            //socket.off(EXPERIMENT_DATA);
        };
    }, []);

    return (
        <div>
            { liveData.map((experimentData: ExperimentData, index: number) => (
                <div key={ index } >
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
                </div>
            )) }
        </div>
    );
};
