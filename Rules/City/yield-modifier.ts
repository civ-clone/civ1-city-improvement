import {
  Bank,
  Courthouse,
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
import { Corruption, Gold, Luxuries, Production, Research } from '../../Yields';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Low from '@civ-clone/core-rule/Priorities/Low';
import Yield from '@civ-clone/core-yield/Yield';
import YieldModifier from '@civ-clone/core-city/Rules/YieldModifier';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';

// As v474.05 (OpenCivOne's decompile, `CityWorker.cs`): a Factory adds 2/4 of the city's base shields and a Mfg. Plant
//  4/4, in place of the Factory's. A plant adds another 2/4, but no more than the Factory or Mfg. Plant does, so it
//  does nothing on its own, and one plant is all that counts.
const factories: [typeof CityImprovement, number][] = [
    [ManufacturingPlant, 4],
    [Factory, 2],
  ],
  plants: (typeof CityImprovement)[] = [PowerPlant, HydroPlant, NuclearPlant];

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry
) => YieldModifier[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): YieldModifier[] => {
  const has = (city: City, Improvement: typeof CityImprovement): boolean =>
      cityImprovementRegistry
        .getByCity(city)
        .some(
          (improvement: CityImprovement): boolean =>
            improvement instanceof Improvement
        ),
    factory = (city: City): [typeof CityImprovement, number] | undefined =>
      factories.find(([Improvement]) => has(city, Improvement));

  return [
    // As v474.05, each of these adds half of the running total, so a Bank adds half of what the Marketplace left.
    ...(
      [
        [Marketplace, Gold, 0.5],
        [Marketplace, Luxuries, 0.5],
        [Bank, Gold, 0.5],
        [Bank, Luxuries, 0.5],
        [Courthouse, Corruption, 0.5],
      ] as [typeof CityImprovement, typeof Yield, number][]
    ).map(
      ([Improvement, YieldType, multiplier]): YieldModifier =>
        new YieldModifier(
          new Low(),
          new Criterion((city: City): boolean => has(city, Improvement)),
          new Effect(
            (city: City, yields: Yield[]): Yield =>
              new YieldType(
                Math.floor(reduceYield(yields, YieldType) * multiplier),
                Improvement.name
              )
          )
        )
    ),

    // As v474.05, a Library and a University each add half of the city's base science, not of what the other added.
    ...([Library, University] as (typeof CityImprovement)[]).map(
      (Improvement): YieldModifier =>
        new YieldModifier(
          new Low(),
          new Criterion((city: City): boolean => has(city, Improvement)),
          new Effect(
            (city: City, yields: Yield[], base: Yield[]): Yield =>
              new Research(
                Math.floor(reduceYield(base, Research) / 2),
                Improvement.name
              )
          )
        )
    ),

    new YieldModifier(
      new Low(),
      new Criterion((city: City): boolean => factory(city) !== undefined),
      new Effect((city: City, yields: Yield[], base: Yield[]): Yield => {
        const [Improvement, quarters] = factory(city)!;

        return new Production(
          Math.floor((reduceYield(base, Production) * quarters) / 4),
          Improvement.name
        );
      })
    ),

    new YieldModifier(
      new Low(),
      new Criterion((city: City): boolean => factory(city) !== undefined),
      new Criterion((city: City): boolean =>
        plants.some((Plant) => has(city, Plant))
      ),
      new Effect(
        (city: City, yields: Yield[], base: Yield[]): Yield =>
          new Production(
            Math.floor((reduceYield(base, Production) * 2) / 4),
            plants.find((Plant) => has(city, Plant))!.name
          )
      )
    ),
  ];
};

export default getRules;
