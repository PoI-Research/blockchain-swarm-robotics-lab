import { BYZANTINE_SWARM_STYLE, CONSENSUS_ALGORITHM, DECISION_RULE } from "../constants";

export interface Experiment {
    decisionRule: DECISION_RULE;
    percentageOfBlackTiles: number;
    consensusAlgorithm: CONSENSUS_ALGORITHM;
    useClassicalApproach: boolean;
    numberOfByzantineRobots: number;
    byzantineSwarmStyle: BYZANTINE_SWARM_STYLE;
    numberOfRobots: number;
}

export interface ExperimentData {
    secondsTaken: number;
    numberOfWhites: number;
    numberOfBlacks: number;
    numberOfRobots: number;
    isClassical: boolean;
    consensusAlgorithm: CONSENSUS_ALGORITHM;
    percentageOfBlackTiles: number;
    decisionRule: DECISION_RULE;
    byzantineSwarmStyle: BYZANTINE_SWARM_STYLE;
    numberOfByzantineRobots: number;
    id: number;
}
