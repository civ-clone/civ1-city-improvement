import {
  Aqueduct,
  Bank,
  Barracks,
  Cathedral,
  CityWalls,
  Colosseum,
  Courthouse,
  Factory,
  Granary,
  HydroPlant,
  Library,
  ManufacturingPlant,
  Marketplace,
  MassTransit,
  NuclearPlant,
  PowerPlant,
  RecyclingCenter,
  SdiDefence,
  Temple,
  University,
} from '../../CityImprovements';
import { Automobile, Gunpowder } from '@civ-clone/civ1-science/Advances';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import Advance from '@civ-clone/core-science/Advance';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Cost from '@civ-clone/core-city/Rules/Cost';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Gold } from '@civ-clone/civ1-city/Yields';
import Yield from '@civ-clone/core-yield/Yield';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => Cost[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
) => [
  ...(
    [
      [Aqueduct, Gold, 2],
      [Bank, Gold, 3],
      [Cathedral, Gold, 3],
      [CityWalls, Gold, 2],
      [Colosseum, Gold, 2],
      [Courthouse, Gold, 1],
      [Factory, Gold, 4],
      [Granary, Gold, 1],
      [HydroPlant, Gold, 4],
      [Library, Gold, 1],
      [ManufacturingPlant, Gold, 6],
      [Marketplace, Gold, 1],
      [MassTransit, Gold, 4],
      [NuclearPlant, Gold, 2],
      [PowerPlant, Gold, 4],
      [RecyclingCenter, Gold, 2],
      [SdiDefence, Gold, 4],
      [Temple, Gold, 1],
      [University, Gold, 3],
    ] as [typeof CityImprovement, typeof Yield, number][]
  ).map(
    ([CityImprovementType, YieldType, cost]): Cost =>
      new Cost(
        new Criterion(
          (cityYield: Yield, city: City): boolean =>
            cityYield instanceof YieldType
        ),
        new Criterion((cityYield: Yield, city: City): boolean =>
          cityImprovementRegistry
            .getByCity(city)
            .some(
              (cityImprovement: CityImprovement): boolean =>
                cityImprovement instanceof CityImprovementType
            )
        ),
        new Effect((cityYield: Yield): void => cityYield.subtract(cost))
      )
  ),
  ...(
    [[Barracks, Gold, 1, Gunpowder, Automobile]] as [
      typeof CityImprovement,
      typeof Yield,
      number,
      ...typeof Advance[]
    ][]
  ).map(
    ([
      CityImprovementType,
      YieldType,
      cost,
      RequiredAdvance,
      ObseletionAdvance,
    ]): Cost =>
      new Cost(
        new Criterion(
          (cityYield: Yield, city: City): boolean =>
            cityYield instanceof YieldType
        ),
        new Criterion((cityYield: Yield, city: City): boolean =>
          cityImprovementRegistry
            .getByCity(city)
            .some(
              (cityImprovement: CityImprovement): boolean =>
                cityImprovement instanceof CityImprovementType
            )
        ),
        new Criterion((cityYield: Yield, city: City): boolean =>
          playerResearchRegistry
            .getByPlayer(city.player())
            .completed(RequiredAdvance)
        ),
        new Criterion(
          (cityYield: Yield, city: City): boolean =>
            !playerResearchRegistry
              .getByPlayer(city.player())
              .completed(ObseletionAdvance)
        ),
        new Effect((cityYield: Yield): void => cityYield.subtract(cost))
      )
  ),
  ...(
    [[Barracks, Gold, 2, Automobile]] as [
      typeof CityImprovement,
      typeof Yield,
      number,
      ...typeof Advance[]
    ][]
  ).map(
    ([CityImprovementType, YieldType, cost, RequiredAdvance]): Cost =>
      new Cost(
        new Criterion(
          (cityYield: Yield, city: City): boolean =>
            cityYield instanceof YieldType
        ),
        new Criterion((cityYield: Yield, city: City): boolean =>
          cityImprovementRegistry
            .getByCity(city)
            .some(
              (cityImprovement: CityImprovement): boolean =>
                cityImprovement instanceof CityImprovementType
            )
        ),
        new Criterion((cityYield: Yield, city: City): boolean =>
          playerResearchRegistry
            .getByPlayer(city.player())
            .completed(RequiredAdvance)
        ),
        new Effect((cityYield: Yield): void => cityYield.subtract(cost))
      )
  ),
];

export default getRules;
