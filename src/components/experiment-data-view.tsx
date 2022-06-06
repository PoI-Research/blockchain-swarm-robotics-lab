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
import { FunctionComponent, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { clearExperimentData, deleteExperimentData, downloadCSV, getExperimentData } from "../apis";
import { CONSENSUS_ALGORITHM, EXPERIMENT_DATA } from "../constants";
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

    const init = useRef(true);

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

        if (init.current) {
            getExperimentData()
                .then((response) => {
                    setLiveData(response);
                })
                .finally(() => {
                    socket.on(EXPERIMENT_DATA, (data: ExperimentData) => {
                        setIsRunningToTrue();
                        setReceivedDataRows((rows) => rows + 1);
                        setLiveData((liveData) => {
                            const newData = [ ...liveData, data ];

                            return newData;
                        });
                    });
                });

            init.current = false;

            return () => {
                socket.off(EXPERIMENT_DATA);
            };
        }
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
                                <TableCell>No. of Black Tiles</TableCell>
                                <TableCell>No. of White Tiles</TableCell>
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
                                    <TableCell>{ experimentData.decisionRule }</TableCell>
                                    <TableCell>
                                        { experimentData.isClassical
                                            ? "Classical"
                                            : experimentData.consensusAlgorithm === CONSENSUS_ALGORITHM.POI
                                                ? "PoI"
                                                : "PoW" }
                                    </TableCell>
                                    <TableCell>{ experimentData.numberOfByzantineRobots }</TableCell>
                                    <TableCell>{ experimentData.byzantineSwarmStyle }</TableCell>
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
