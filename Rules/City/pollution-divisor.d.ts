import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import PollutionDivisor from '@civ-clone/base-city-pollution/Rules/PollutionDivisor';
export declare const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry
) => PollutionDivisor[];
export default getRules;
