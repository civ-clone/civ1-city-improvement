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
import Description from '@civ-clone/core-rule/Description';
import Effect from '@civ-clone/core-rule/Effect';
import Low from '@civ-clone/core-rule/Priorities/Low';
import Yield from '@civ-clone/core-yield/Yield';
import YieldModifier from '@civ-clone/core-city/Rules/YieldModifier';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';

// As v474.05 (OpenCivOne's decompile, `CityWorker.cs`): a Factory adds 2/4 of the city's base shields and a Mfg. Plant
//  4/4, in place of the Factory's. A plant adds another 2/4, but no more than the Factory or Mfg. Plant does, so it
//  does nothing on its own, and one plant is all that counts. Each rule below, and what it says it does (its
//  `Description`, for the Civilopedia, civ-clone/web-renderer#1196), reads these tables, so the two can't disagree.
export const factories: [typeof CityImprovement, number][] = [
    [ManufacturingPlant, 4],
    [Factory, 2],
  ],
  plants: (typeof CityImprovement)[] = [PowerPlant, HydroPlant, NuclearPlant],
  plantQuarters: number = 2;

// As v474.05, each of these adds half of the running total, so a Bank adds half of what the Marketplace left. The
//  Courthouse's half is of the corruption, which is counted as trade lost, so it halves it.
export const runningTotalModifiers: [
  typeof CityImprovement,
  typeof Yield,
  number
][] = [
  [Marketplace, Gold, 0.5],
  [Marketplace, Luxuries, 0.5],
  [Bank, Gold, 0.5],
  [Bank, Luxuries, 0.5],
  [Courthouse, Corruption, 0.5],
];

// As v474.05, a Library and a University each add half of the city's base science, not of what the other added.
export const scienceModifiers: [typeof CityImprovement, number][] = [
  [Library, 0.5],
  [University, 0.5],
];

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
    ...runningTotalModifiers.map(
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
          ),
          new Description({
            type: 'yield_percent',
            subject: Improvement,
            yield: YieldType,
            value: YieldType === Corruption ? -multiplier : multiplier,
            of: 'total',
          })
        )
    ),

    ...scienceModifiers.map(
      ([Improvement, multiplier]): YieldModifier =>
        new YieldModifier(
          new Low(),
          new Criterion((city: City): boolean => has(city, Improvement)),
          new Effect(
            (city: City, yields: Yield[], base: Yield[]): Yield =>
              new Research(
                Math.floor(reduceYield(base, Research) * multiplier),
                Improvement.name
              )
          ),
          new Description({
            type: 'yield_percent',
            subject: Improvement,
            yield: Research,
            value: multiplier,
            of: 'base',
          })
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
      }),
      new Description(
        ...factories.map(([Improvement, quarters], index) => ({
          type: 'yield_percent',
          subject: Improvement,
          yield: Production,
          value: quarters / 4,
          of: 'base',
          replaces: factories.slice(index + 1).map(([Replaced]) => Replaced),
        }))
      )
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
            Math.floor((reduceYield(base, Production) * plantQuarters) / 4),
            plants.find((Plant) => has(city, Plant))!.name
          )
      ),
      new Description(
        ...plants.map((Plant) => ({
          type: 'yield_percent',
          subject: Plant,
          yield: Production,
          value: plantQuarters / 4,
          of: 'base',
          needs: factories.map(([Improvement]) => Improvement),
          notWith: plants.filter((Other) => Other !== Plant),
        }))
      )
    ),
  ];
};

export default getRules;
