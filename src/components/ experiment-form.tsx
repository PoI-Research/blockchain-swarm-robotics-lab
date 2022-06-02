import { FunctionComponent, ReactElement, useState } from "react";
import { BYZANTINE_SWARM_STYLE, CONSENSUS_ALGORITHM, DECISION_RULE } from "../constants";
import { Experiment } from "../model";

interface ExperimentFormProps {
    addToQueue: (experiment: Experiment) => void;
}
export const ExperimentForm: FunctionComponent<ExperimentFormProps> = (props: ExperimentFormProps): ReactElement => {
    const { addToQueue } = props;

    const [decisionRule, setDecisionRule] = useState<DECISION_RULE>(0);
    const [percentageOfBlackTiles, setPercentageOfBlackTiles] = useState<number>(80);
    const [consensusAlgorithm, setConsensusAlgorithm] = useState<CONSENSUS_ALGORITHM>(CONSENSUS_ALGORITHM.POW);
    const [useClassicalApproach, setUseClassicalApproach] = useState<boolean>(false);
    const [numberOfByzantineRobots, setNumberOfByzantineRobots] = useState<number>(0);
    const [byzantineSwarmStyle, setByzantineSwarmStyle] = useState<BYZANTINE_SWARM_STYLE>(0);
    const [numberOfRobots, setNumberOfRobots] = useState<number>(0);

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

        addToQueue(experiment);
    };

    return (
        <div>
            <input type="number" value={decisionRule} onChange={(e) => setDecisionRule(parseInt(e.target.value))} />
            <input
                type="number"
                value={percentageOfBlackTiles}
                onChange={(e) => setPercentageOfBlackTiles(parseInt(e.target.value))}
            />
            <input
                type="string"
                value={consensusAlgorithm}
                onChange={(e) => setConsensusAlgorithm(e.target.value as CONSENSUS_ALGORITHM)}
            />
            <input
                type="checkbox"
                checked={useClassicalApproach}
                onChange={(e) => setUseClassicalApproach(e.target.checked)}
            />
            <input
                type="number"
                value={numberOfByzantineRobots}
                onChange={(e) => setNumberOfByzantineRobots(parseInt(e.target.value))}
            />
            <input
                type="number"
                value={byzantineSwarmStyle}
                onChange={(e) => setByzantineSwarmStyle(parseInt(e.target.value))}
            />
            <input type="number" value={ numberOfRobots } onChange={ (e) => setNumberOfRobots(parseInt(e.target.value)) } />
            <input type="button" value="Submit" onClick={ handleSubmit } />
        </div>
    );
};
