import { DeleteForever, Download } from "@mui/icons-material";
import {
    Box,
    Button,
    Divider,
    IconButton,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { clearExperimentData, deleteExperimentData, downloadCSV, getExperimentData } from "../apis";
import { BYZANTINE_SWARM_STYLE, CONSENSUS_ALGORITHM, DECISION_RULE, EXPERIMENT_DATA } from "../constants";
import { Experiment, ExperimentData } from "../model";
import { socket } from "../utils";

interface ExperimentDataViewProps {
    queue: Experiment[];
    repetitions: number;
    isRunning: boolean;
    setIsRunningToTrue: () => void;
}

export const ExperimentDataView: FunctionComponent<ExperimentDataViewProps> = (
    props: ExperimentDataViewProps
): ReactElement => {
    const { queue, repetitions, isRunning, setIsRunningToTrue } = props;

    const [ liveData, setLiveData ] = useState<ExperimentData[]>([]);
    const [ receivedDataRows, setReceivedDataRows ] = useState<number>(0);

    const totalData = useMemo(() => {
        return repetitions * queue?.length;
    }, [ repetitions, queue ]);

    useEffect(() => {
        if (!isRunning) {
            setReceivedDataRows(0);
        }
    }, [ isRunning ]);

    useEffect(() => {
        if (!setIsRunningToTrue) {
            return;
        }

        getExperimentData()
            .then((response) => {
                setLiveData(response);
            })
            .finally(() => {
                socket.off(EXPERIMENT_DATA);
                socket.on(EXPERIMENT_DATA, (data: ExperimentData) => {
                    setIsRunningToTrue();
                    setReceivedDataRows((rows) => rows + 1);
                    setLiveData((liveData) => {
                        const newData = [ ...liveData, data ];

                        return newData;
                    });
                });
            });

        return () => {
            socket.off(EXPERIMENT_DATA);
        };
    }, [ setIsRunningToTrue ]);

    const clearData = (): void => {
        clearExperimentData().then(() => getExperimentData().then((response) => setLiveData(response)));
    };

    const deleteExperiment = (id: number) => {
        deleteExperimentData(id).then(() => getExperimentData().then((response) => setLiveData(response)));
    };

    const download = (): void => {
        downloadCSV().then((response) => {
            const blob = new Blob([ response ], { type: "text/csv" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "experiment-data.csv";
            link.click();
        });
    };

    const getDecisionRule = (rule: DECISION_RULE): string => {
        switch (rule) {
            case DECISION_RULE.DC:
                return "DC";
            case DECISION_RULE.DMMD:
                return "DMMD";
            case DECISION_RULE.DMVD:
                return "DMVD";
        }
    };

    const getByzantineSwarmStyle = (style: BYZANTINE_SWARM_STYLE): string => {
        switch (style) {
            case BYZANTINE_SWARM_STYLE.BLACK_BYZANTINE_ROBOTS:
                return "Black Only";
            case BYZANTINE_SWARM_STYLE.WHITE_BYZANTINE_ROBOTS:
                return "White Only";
            case BYZANTINE_SWARM_STYLE.BLACK_WHITE_BYZANTINE_ROBOTS:
                return "Black and White";
            default:
                return "No Byzantine Robots";
        }
    };

    return (
        <Box
            sx={ {
                height: "calc(100vh - (72px + 6em))",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start"
            } }
        >
            <Box sx={ { display: "flex", justifyContent: "space-between", marginBottom: "1em" } }>
                <Typography variant="h6">Experiment Data</Typography>
                <Button startIcon={ <DeleteForever /> } onClick={ clearData }>
                    Clear Data
                </Button>
            </Box>
            <Divider />
            { isRunning && (
                <LinearProgress
                    variant="buffer"
                    value={ (receivedDataRows / totalData) * 100 }
                    valueBuffer={ ((receivedDataRows + 1) / totalData) * 100 }
                />
            ) }
            <Paper sx={ { marginTop: "1em", overflow: "hidden", marginBottom: "2em" } }>
                <TableContainer sx={ { maxHeight: "100%" } }>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>No. of Robots</TableCell>
                                <TableCell>% of Black Tiles</TableCell>
                                <TableCell>Decision Rule</TableCell>
                                <TableCell>Approach</TableCell>
                                <TableCell>No. of Byzantine Robots</TableCell>
                                <TableCell>Byzantine Swarm Style</TableCell>
                                <TableCell>No. of Black Robots</TableCell>
                                <TableCell>No. of White Robots</TableCell>
                                <TableCell>Time Taken(s)</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { liveData.map((experimentData: ExperimentData, index: number) => (
                                <TableRow key={ index }>
                                    <TableCell>{ experimentData.id }</TableCell>
                                    <TableCell>{ experimentData.numberOfRobots }</TableCell>
                                    <TableCell>{ experimentData.percentageOfBlackTiles }</TableCell>
                                    <TableCell>{ getDecisionRule(experimentData.decisionRule) }</TableCell>
                                    <TableCell>
                                        { experimentData.isClassical
                                            ? "Classical"
                                            : experimentData.consensusAlgorithm === CONSENSUS_ALGORITHM.POI
                                                ? "PoI"
                                                : "PoW" }
                                    </TableCell>
                                    <TableCell>{ experimentData.numberOfByzantineRobots }</TableCell>
                                    <TableCell>{
                                        getByzantineSwarmStyle(experimentData.byzantineSwarmStyle) }</TableCell>
                                    <TableCell>{ experimentData.numberOfBlacks }</TableCell>
                                    <TableCell>{ experimentData.numberOfWhites }</TableCell>
                                    <TableCell>{ experimentData.secondsTaken }</TableCell>
                                    <TableCell>
                                        <IconButton onClick={ () => deleteExperiment(index) }>
                                            <DeleteForever />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Box sx={ { display: "flex", justifyContent: "flex-end" } }>
                <Button startIcon={ <Download /> } onClick={ download }>
                    Download CSV
                </Button>
            </Box>
        </Box>
    );
};
