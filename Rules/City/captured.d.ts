import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import Captured from '@civ-clone/core-city/Rules/Captured';
export declare const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  randomNumberGenerator?: () => number
) => Captured[];
export default getRules;
