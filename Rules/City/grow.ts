import { Aqueduct, Granary } from '../../CityImprovements';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityGrowth from '@civ-clone/core-city-growth/CityGrowth';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { FoodStorage } from '../../Yields';
import Grow from '@civ-clone/core-city-growth/Rules/Grow';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry
) => Grow[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): Grow[] => [
  new Grow(
    new Criterion(
      (cityGrowth: CityGrowth): boolean =>
        !cityImprovementRegistry
          .getByCity(cityGrowth.city())
          .some(
            (improvement: CityImprovement): boolean =>
              improvement instanceof Aqueduct
          )
    ),
    new Criterion((cityGrowth: CityGrowth): boolean => cityGrowth.size() > 10),
    new Effect((cityGrowth: CityGrowth): void => cityGrowth.shrink())
  ),
  new Grow(
    new Criterion((cityGrowth: CityGrowth): boolean =>
      cityImprovementRegistry
        .getByCity(cityGrowth.city())
        .some(
          (improvement: CityImprovement): boolean =>
            improvement instanceof Granary
        )
    ),
    new Effect((cityGrowth: CityGrowth): void =>
      cityGrowth.add(new FoodStorage(cityGrowth.cost().value() / 2))
    )
  ),
];

export default getRules;
