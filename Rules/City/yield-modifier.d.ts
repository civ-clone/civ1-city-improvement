import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Yield from '@civ-clone/core-yield/Yield';
import YieldModifier from '@civ-clone/core-city/Rules/YieldModifier';
export declare const factories: [typeof CityImprovement, number][],
  plants: (typeof CityImprovement)[],
  plantQuarters: number;
export declare const runningTotalModifiers: [
  typeof CityImprovement,
  typeof Yield,
  number
][];
export declare const scienceModifiers: [typeof CityImprovement, number][];
export declare const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry
) => YieldModifier[];
export default getRules;
