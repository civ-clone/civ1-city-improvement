import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Library, Marketplace } from '../../CityImprovements';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '@civ-clone/civ1-city/Yields';
import Luxuries from '@civ-clone/base-city-yield-luxuries/Luxuries';
import { Research } from '@civ-clone/civ1-science/Yields';
import Yield from '@civ-clone/core-yield/Yield';
import YieldRule from '@civ-clone/core-city/Rules/Yield';
import City from '@civ-clone/core-city/City';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry
) => YieldRule[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): YieldRule[] => [
  ...([
    [Marketplace, Gold, 0.5],
    [Marketplace, Luxuries, 0.5],
    [Library, Research, 0.5],
  ] as [typeof CityImprovement, typeof Yield, number][]).map(
    ([Improvement, YieldType, multiplier]: [
      typeof CityImprovement,
      typeof Yield,
      number
    ]): YieldRule =>
      new YieldRule(
        new Criterion(
          (cityYield: Yield): boolean => cityYield instanceof YieldType
        ),
        new Criterion((cityYield: Yield, city: City): boolean =>
          cityImprovementRegistry
            .getByCity(city)
            .some(
              (improvement: CityImprovement): boolean =>
                improvement instanceof Improvement
            )
        ),
        new Effect((cityYield: Yield): void =>
          cityYield.add(cityYield.value() * multiplier, Improvement.name)
        )
      )
  ),
];

export default getRules;
