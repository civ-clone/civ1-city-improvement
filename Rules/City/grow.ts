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
import { growthLimit } from '@civ-clone/base-city-growth-limit/lib/growthLimit';
import { growthLimits } from '../../lib/growthLimit';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry
) => Grow[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): Grow[] => [
  new Grow(
    // Past the limit, as it has just grown: shrinking back undoes the growth.
    new Criterion((cityGrowth: CityGrowth): boolean => {
      const limit = growthLimit(
        cityGrowth,
        growthLimits,
        cityImprovementRegistry
      );

      return limit !== null && cityGrowth.size() > limit[0];
    }),
    // The missing Aqueduct is what keeps it from growing (civ-clone/web-renderer#400).
    new Effect((cityGrowth: CityGrowth): void => cityGrowth.shrink(Aqueduct))
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
