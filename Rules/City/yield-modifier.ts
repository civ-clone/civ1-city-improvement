import {
  Bank,
  Factory,
  HydroPlant,
  Library,
  ManufacturingPlant,
  Marketplace,
  NuclearPlant,
  PowerPlant,
  University,
} from '../../CityImprovements';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Gold, Luxuries, Production, Research } from '../../Yields';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Low from '@civ-clone/core-rule/Priorities/Low';
import Yield from '@civ-clone/core-yield/Yield';
import YieldModifier from '@civ-clone/core-city/Rules/YieldModifier';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry
) => YieldModifier[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): YieldModifier[] => [
  ...(
    [
      [Marketplace, Gold, 0.5],
      [Marketplace, Luxuries, 0.5],
      [Bank, Gold, 0.5],
      [Bank, Luxuries, 0.5],
      [Library, Research, 0.5],
      [University, Research, 0.5],
      [Factory, Production, 0.5],
      [PowerPlant, Production, 0.5],
      [HydroPlant, Production, 0.5],
      [NuclearPlant, Production, 0.5],
      [ManufacturingPlant, Production, 0.5],
      // [RecyclingCenter, Pollution, 0.5],
      // [HydroPlant, Pollution, 0.5],
      // [MassTransit, Pollution, 0.5],
    ] as [typeof CityImprovement, typeof Yield, number][]
  ).map(
    ([Improvement, YieldType, multiplier]: [
      typeof CityImprovement,
      typeof Yield,
      number
    ]): YieldModifier =>
      new YieldModifier(
        new Low(),
        new Criterion((city: City): boolean =>
          cityImprovementRegistry
            .getByCity(city)
            .some(
              (improvement: CityImprovement): boolean =>
                improvement instanceof Improvement
            )
        ),
        new Effect(
          (city: City, yields: Yield[]): Yield =>
            new YieldType(
              Math.floor(reduceYield(yields, YieldType) * multiplier),
              Improvement.name
            )
        )
      )
  ),
];

export default getRules;
