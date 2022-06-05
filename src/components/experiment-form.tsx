import { Add } from "@mui/icons-material";
import {
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField
} from "@mui/material";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { addExperiment, getQueue } from "../apis";
import { BYZANTINE_SWARM_STYLE, CONSENSUS_ALGORITHM, DECISION_RULE } from "../constants";
import { Experiment } from "../model";

interface ExperimentFormProps {
    addToQueue: (experiments: Experiment[]) => void;
}
export const ExperimentForm: FunctionComponent<ExperimentFormProps> = (props: ExperimentFormProps): ReactElement => {
    const { addToQueue } = props;

    const [ decisionRule, setDecisionRule ] = useState<DECISION_RULE>(0);
    const [ percentageOfBlackTiles, setPercentageOfBlackTiles ] = useState<number>(80);
    const [ consensusAlgorithm, setConsensusAlgorithm ] = useState<CONSENSUS_ALGORITHM>(CONSENSUS_ALGORITHM.POW);
    const [ useClassicalApproach, setUseClassicalApproach ] = useState<boolean>(false);
    const [ numberOfByzantineRobots, setNumberOfByzantineRobots ] = useState<number>(0);
    const [ byzantineSwarmStyle, setByzantineSwarmStyle ] = useState<BYZANTINE_SWARM_STYLE>(
        BYZANTINE_SWARM_STYLE.NO_BYZANTINE_ROBOTS
    );
    const [ numberOfRobots, setNumberOfRobots ] = useState<number>(2);

    useEffect(() => {
        if (numberOfByzantineRobots > 0) {
            setByzantineSwarmStyle(BYZANTINE_SWARM_STYLE.BLACK_BYZANTINE_ROBOTS);
        }
    }, [ numberOfByzantineRobots ]);

    const handleSubmit = (): void => {
        const experiment: Experiment = {
            decisionRule,
            percentageOfBlackTiles,
            consensusAlgorithm,
            useClassicalApproach,
            numberOfByzantineRobots,
            byzantineSwarmStyle,
            numberOfRobots
        };
        addExperiment(experiment).then(() => getQueue().then((response: Experiment[]) => addToQueue(response)));
    };

    return (
        <Stack spacing={ 2 }>
            <TextField
                label="Number of Robots"
                type="number"
                value={ numberOfRobots }
                onChange={ (e) => {
                    setNumberOfRobots(Math.max(parseInt(e.target.value), 2));
                } }
            />
            <TextField
                label="Percentage of Black Tiles"
                type="number"
                value={ percentageOfBlackTiles }
                onChange={ (e) => setPercentageOfBlackTiles(Math.max(Math.min(parseInt(e.target.value), 100), 0)) }
            />
            <FormControl fullWidth>
                <InputLabel id="decision-rule-label">Decision Rule</InputLabel>
                <Select
                    labelId="decision-rule-label"
                    value={ decisionRule }
                    label="Decision Rule"
                    onChange={ (e) => setDecisionRule(e.target.value as DECISION_RULE) }
                >
                    <MenuItem value={ DECISION_RULE.DC }>Direct Comparison (DC)</MenuItem>
                    <MenuItem value={ DECISION_RULE.DMMD }>Direct Modulated Majority Decision (DMMD)</MenuItem>
                    <MenuItem value={ DECISION_RULE.DMVD }>Direct Modulated Voter Decision (DMVD)</MenuItem>
                </Select>
            </FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        defaultChecked
                        onChange={ (e) => setUseClassicalApproach(!e.target.checked) }
                        checked={ !useClassicalApproach }
                    />
                }
                label="Use Blockchain"
            />
            { !useClassicalApproach && (
                <FormControl fullWidth>
                    <InputLabel id="consensus-algorithm-label">Blockchain Consensus Algorithm</InputLabel>
                    <Select
                        labelId="consensus-algorithm-label"
                        value={ consensusAlgorithm }
                        label="Blockchain Consensus Algorithm"
                        onChange={ (e) => setConsensusAlgorithm(e.target.value as CONSENSUS_ALGORITHM) }
                    >
                        <MenuItem value={ CONSENSUS_ALGORITHM.POI }>Proof of Identity (PoI)</MenuItem>
                        <MenuItem value={ CONSENSUS_ALGORITHM.POW }>Proof of Work (PoW)</MenuItem>
                    </Select>
                </FormControl>
            ) }
            <TextField
                label="Number of Byzantine Robots"
                type="number"
                value={ numberOfByzantineRobots }
                onChange={ (e) => setNumberOfByzantineRobots(Math.max(parseInt(e.target.value), 0)) }
            />
            { numberOfByzantineRobots > 0 && (
                <FormControl fullWidth>
                    <InputLabel id="byzantine-swarm-style-label">Byzantine Swarm Style</InputLabel>
                    <Select
                        labelId="byzantine-swarm-style-label"
                        value={ byzantineSwarmStyle }
                        label="Byzantine Swarm Style"
                        onChange={ (e) => setByzantineSwarmStyle(e.target.value as BYZANTINE_SWARM_STYLE) }
                    >
                        <MenuItem value={ BYZANTINE_SWARM_STYLE.BLACK_BYZANTINE_ROBOTS }>
                            Only Black Byzantine Robots
                        </MenuItem>
                        <MenuItem value={ BYZANTINE_SWARM_STYLE.WHITE_BYZANTINE_ROBOTS }>
                            Only White Byzantine Robots
                        </MenuItem>
                        <MenuItem value={ BYZANTINE_SWARM_STYLE.BLACK_WHITE_BYZANTINE_ROBOTS }>
                            Black & White Byzantine Robots
                        </MenuItem>
                    </Select>
                </FormControl>
            ) }
            <Divider />
            <Button startIcon={ <Add /> } variant="contained" onClick={ handleSubmit }>
                Add to Queue
            </Button>
        </Stack>
    );
};
