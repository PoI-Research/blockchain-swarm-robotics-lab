import { DeleteForever } from "@mui/icons-material";
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
import { clearExperimentData, deleteExperimentData, getExperimentData } from "../apis";
import { CONSENSUS_ALGORITHM, EXPERIMENT_DATA } from "../constants";
import { Experiment, ExperimentData } from "../model";
import { socket } from "../utils";

interface ExperimentDataViewProps {
    queue: Experiment[];
    repetitions: number;
    isRunning: boolean;
}

export const ExperimentDataView: FunctionComponent<ExperimentDataViewProps> = (
    props: ExperimentDataViewProps
): ReactElement => {
    const { queue, repetitions, isRunning } = props;

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
        getExperimentData()
            .then((response) => {
                setLiveData(response);
            })
            .finally(() => {
                if (init.current) {
                    socket.on(EXPERIMENT_DATA, (data: ExperimentData) => {
                        setReceivedDataRows((rows) => rows + 1);
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
        <Box
            sx={ {
                height: "calc(100vh - (72px + 6em))",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
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
                <TableContainer sx={{maxHeight:"100%"}}>
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
            </Box>
    );
};
