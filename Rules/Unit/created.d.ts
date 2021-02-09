import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { UnitImprovementRegistry } from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import Created from '@civ-clone/core-unit/Rules/Created';
export declare const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  unitImprovementRegistry?: UnitImprovementRegistry
) => Created[];
export default getRules;
