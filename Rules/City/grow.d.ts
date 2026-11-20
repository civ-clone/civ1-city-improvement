import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import Grow from '@civ-clone/core-city-growth/Rules/Grow';
/** The share of the food box a Granary keeps when its city grows. */
export declare const granaryStore: number;
export declare const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry
) => Grow[];
export default getRules;
