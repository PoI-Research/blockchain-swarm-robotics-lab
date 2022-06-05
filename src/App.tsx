import { Box, Grid, Paper } from "@mui/material";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { clearQueue, deleteExperiment, getQueue } from "./apis";
import { AppTopBar, ExperimentDataView, ExperimentForm, Queue } from "./components";
import { EXPERIMENT_COMPLETED, RUN_EXPERIMENTS } from "./constants";
import { Experiment } from "./model/experiment";
import { AppThemeProvider } from "./theme";
import { socket } from "./utils";

export const App: FunctionComponent = (): ReactElement => {
    const [ queue, setQueue ] = useState<Experiment[]>([]);
    const [ repetitions, setRepetitions ] = useState<number>(15);
    const [ isRunning, setIsRunning ] = useState<boolean>(false);

    useEffect(() => {
        getQueue().then((response: Experiment[]) => setQueue(response));
    }, []);

    const addToQueue = (experiments: Experiment[]): void => {
        setQueue(experiments);
    };

    const clearExperiments = (): void => {
        clearQueue().then(() => getQueue().then((response: Experiment[]) => setQueue(response)));
    };

    const deleteAnExperiment = (id: number): void => {
        deleteExperiment(id).then(() => getQueue().then((response: Experiment[]) => setQueue(response)));
    };

     const runExperiment = (): void => {
        setIsRunning(true);
        socket.emit(RUN_EXPERIMENTS, repetitions);
        socket.on(EXPERIMENT_COMPLETED, () => {
            setIsRunning(false);
        });
    };

    useEffect(() => {
        return () => {
            socket.off(EXPERIMENT_COMPLETED);
        };
    }, []);

    return (
        <AppThemeProvider>
            <Paper variant="outlined" square sx={ { border: "none", minHeight: "100vh", height: "100%" } }>
                <Box sx={ { flexGrow: 1 } }>
                    <AppTopBar />
                </Box>
                <Box>
                    <Grid container sx={ { minHeight: "calc(100vh - (72px))" } }>
                        <Grid item xs={ 2 }>
                            <Box
                                sx={ {
                                    padding: "1em",
                                    minHeight: "calc(100% - 2em)",
                                    borderRight: 1,
                                    borderColor: "divider"
                                } }
                            >
                                <ExperimentForm addToQueue={ addToQueue } />
                            </Box>
                        </Grid>
                        <Grid item xs={ 3 }>
                            <Box
                                sx={ {
                                    padding: "1em",
                                    minHeight: "calc(100% - 2em)",
                                    borderRight: 1,
                                    borderColor: "divider"
                                } }
                            >
                                <Queue
                                    repetitions={ repetitions }
                                    setRepetitions={ setRepetitions }
                                    queue={ queue }
                                    clearQueue={ clearExperiments }
                                    deleteAnExperiment={ deleteAnExperiment }
                                    isRunning={ isRunning }
                                    startRunning={ runExperiment }
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={ 7 }>
                            <Box
                                sx={ {
                                    padding: "1em",
                                    minHeight: "calc(100% - 2em)",
                                    borderRight: 1,
                                    borderColor: "divider"
                                } }
                            >
                                <ExperimentDataView
                                    queue={ queue }
                                    repetitions={ repetitions }
                                    isRunning={ isRunning }
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </AppThemeProvider>
    );
};
