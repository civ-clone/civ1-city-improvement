import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import Grow from '@civ-clone/core-city-growth/Rules/Grow';
export declare const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry
) => Grow[];
export default getRules;
