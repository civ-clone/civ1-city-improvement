import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import Cost from '@civ-clone/core-city/Rules/Cost';
export declare const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => Cost[];
export default getRules;
