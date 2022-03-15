import {
  Bank,
  Cathedral,
  Colosseum,
  Factory,
  HydroPlant,
  Library,
  ManufacturingPlant,
  Marketplace,
  NuclearPlant,
  PowerPlant,
  Temple,
  University,
} from '../../CityImprovements';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '@civ-clone/civ1-city/Yields';
import { Production } from '@civ-clone/civ1-world/Yields';
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
