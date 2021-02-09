import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import Created from '@civ-clone/core-city-improvement/Rules/Created';
export declare const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  engine?: Engine
) => Created[];
export default getRules;
