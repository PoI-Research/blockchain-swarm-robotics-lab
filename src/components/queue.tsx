import {
    BugReport,
    Circle,
    CircleOutlined,
    ContrastOutlined,
    DeleteForever,
    GridView,
    PlayArrow,
    SmartToy
} from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { FunctionComponent, ReactElement, useState } from "react";
import { BYZANTINE_SWARM_STYLE, CONSENSUS_ALGORITHM, DECISION_RULE, RUN_EXPERIMENTS } from "../constants";
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

    const getDecisionRule = (rule: DECISION_RULE): string => {
        switch (rule) {
            case DECISION_RULE.DC:
                return "DC";
            case DECISION_RULE.DMMD:
                return "DMMD";
            case DECISION_RULE.DMVD:
                return "DMVD";
            default:
                return "";
        }
    };

    const formatConsensusAlgorithm = (algorithm: CONSENSUS_ALGORITHM): string => {
        if (algorithm === CONSENSUS_ALGORITHM.POW) {
            return "PoW";
        }

        return "PoI";
    };

    const generateByzantineSwarmStyleICon = (style: BYZANTINE_SWARM_STYLE): ReactElement | null => {
        switch (style) {
            case BYZANTINE_SWARM_STYLE.BLACK_BYZANTINE_ROBOTS:
                return (
                    <Box sx={ { color: "black" } }>
                        <Circle color="inherit" />
                    </Box>
                );
            case BYZANTINE_SWARM_STYLE.WHITE_BYZANTINE_ROBOTS:
                return (
                    <Box>
                        <CircleOutlined />
                    </Box>
                );
            case BYZANTINE_SWARM_STYLE.BLACK_WHITE_BYZANTINE_ROBOTS:
                return (
                    <Box>
                        <ContrastOutlined />
                    </Box>
                );
        }

        return null;
    };

    const generateQueueElement = (experiment: Experiment, index: number): ReactElement => {
        return (
            <ListItem key={ index }>
                <Paper
                    variant="outlined"
                    sx={ {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "1em"
                    } }
                >
                    <span>
                        <Chip icon={ <SmartToy /> } label={ experiment?.numberOfRobots } />
                    </span>
                    <span>
                        <Box sx={ { color: "black", position: "relative", display: "inline-flex" } }>
                            <CircularProgress
                                color="inherit"
                                variant="determinate"
                                value={ experiment?.percentageOfBlackTiles }
                            />
                            <Box
                                sx={ {
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: "absolute",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                } }
                            >
                                <Typography variant="caption" component="div" color="text.secondary">{ `${ Math.round(
                                    experiment?.percentageOfBlackTiles
                                ) }%` }</Typography>
                            </Box>
                        </Box>
                    </span>
                    <span>
                        <Chip variant="outlined" label={ getDecisionRule(experiment?.decisionRule) } />
                    </span>
                    <span>{ !experiment?.useClassicalApproach && <GridView /> }</span>
                    { !experiment?.useClassicalApproach && (
                        <span>
                            <Chip color="primary" label={ formatConsensusAlgorithm(experiment?.consensusAlgorithm) } />
                        </span>
                    ) }
                    <span>
                        <Chip icon={ <BugReport /> } label={ experiment?.numberOfByzantineRobots } />
                    </span>
                    { experiment?.numberOfByzantineRobots > 0 && (
                        <span>{ generateByzantineSwarmStyleICon(experiment?.byzantineSwarmStyle) }</span>
                    ) }
                    <IconButton onClick={ () => deleteAnExperiment(index) }>
                        <DeleteForever />
                    </IconButton>
                </Paper>
            </ListItem>
        );
    };

    return (
        <Box>
            <Button startIcon={ <DeleteForever /> } onClick={ clearQueue }>
                Clear Queue
            </Button>
            <List>
                { queue?.map((experiment: Experiment, index: number) => generateQueueElement(experiment, index)) }
            </List>
            <TextField
                type="number"
                value={ repetitions }
                onChange={ (e) => setRepetitions(parseInt(e.target.value)) }
                label="Repetitions"
            />
            <Button variant="contained" startIcon={ <PlayArrow /> } onClick={ runExperiment }>
                Run Experiments
            </Button>
        </Box>
    );
};
