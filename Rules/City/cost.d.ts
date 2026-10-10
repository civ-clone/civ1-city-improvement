import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import Advance from '@civ-clone/core-science/Advance';
import Player from '@civ-clone/core-player/Player';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import { CityImprovementMaintenanceGold } from '../../Yields';
import Cost from '@civ-clone/core-city/Rules/Cost';
export declare const maintenance: [
  typeof CityImprovement,
  typeof CityImprovementMaintenanceGold,
  number
][];
export declare const barracksMaintenance: [
  typeof CityImprovement,
  typeof CityImprovementMaintenanceGold,
  number,
  typeof Advance | null,
  typeof Advance | null
][];
export declare const upkeep: (
  CityImprovementType: typeof CityImprovement,
  player: Player,
  playerResearchRegistry?: PlayerResearchRegistry
) => number;
export declare const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => Cost[];
export default getRules;
