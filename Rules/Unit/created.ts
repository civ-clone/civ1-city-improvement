import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  UnitImprovementRegistry,
  instance as unitImprovementRegistryInstance,
} from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import { Barracks } from '../../CityImprovements';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Created from '@civ-clone/core-unit/Rules/Created';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Unit from '@civ-clone/core-unit/Unit';
import { Veteran } from '@civ-clone/civ1-unit/UnitImprovements';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  unitImprovementRegistry?: UnitImprovementRegistry
) => Created[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  unitImprovementRegistry: UnitImprovementRegistry = unitImprovementRegistryInstance
): Created[] => [
  new Created(
    new Criterion((unit: Unit): boolean => unit.city() !== null),
    new Criterion((unit: Unit): boolean =>
      cityImprovementRegistry
        .getByCity(unit.city()!)
        .some(
          (cityImprovement: CityImprovement) =>
            cityImprovement instanceof Barracks
        )
    ),
    new Effect((unit: Unit): void =>
      unitImprovementRegistry.register(new Veteran(unit))
    )
  ),
];

export default getRules;
