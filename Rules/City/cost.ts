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
  Palace,
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
import { CityImprovementMaintenanceGold } from '../../Yields';
import Cost from '@civ-clone/core-city/Rules/Cost';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Yield from '@civ-clone/core-yield/Yield';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => Cost[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): Cost[] => [
  ...(
    [
      [Aqueduct, CityImprovementMaintenanceGold, 2],
      [Bank, CityImprovementMaintenanceGold, 3],
      [Cathedral, CityImprovementMaintenanceGold, 3],
      [CityWalls, CityImprovementMaintenanceGold, 2],
      [Colosseum, CityImprovementMaintenanceGold, 2],
      [Courthouse, CityImprovementMaintenanceGold, 1],
      [Factory, CityImprovementMaintenanceGold, 4],
      [Granary, CityImprovementMaintenanceGold, 1],
      [HydroPlant, CityImprovementMaintenanceGold, 4],
      [Library, CityImprovementMaintenanceGold, 1],
      [ManufacturingPlant, CityImprovementMaintenanceGold, 6],
      [Marketplace, CityImprovementMaintenanceGold, 1],
      [MassTransit, CityImprovementMaintenanceGold, 4],
      [NuclearPlant, CityImprovementMaintenanceGold, 2],
      [Palace, CityImprovementMaintenanceGold, 0],
      [PowerPlant, CityImprovementMaintenanceGold, 4],
      [RecyclingCenter, CityImprovementMaintenanceGold, 2],
      [SdiDefence, CityImprovementMaintenanceGold, 4],
      [Temple, CityImprovementMaintenanceGold, 1],
      [University, CityImprovementMaintenanceGold, 3],
    ] as [
      typeof CityImprovement,
      typeof CityImprovementMaintenanceGold,
      number
    ][]
  ).map(
    ([CityImprovementType, YieldType, cost]): Cost =>
      new Cost(
        new Criterion((city: City): boolean =>
          cityImprovementRegistry
            .getByCity(city)
            .some(
              (cityImprovement: CityImprovement): boolean =>
                cityImprovement instanceof CityImprovementType
            )
        ),
        new Effect((city: City): Yield => {
          const [cityImprovement] = cityImprovementRegistry
            .getByCity(city)
            .filter(
              (cityImprovement) =>
                cityImprovement instanceof CityImprovementType
            );

          return new YieldType(cost, cityImprovement) as Yield;
        })
      )
  ),

  ...(
    [
      [Barracks, CityImprovementMaintenanceGold, 0, null, Gunpowder],
      [Barracks, CityImprovementMaintenanceGold, 1, Gunpowder, Automobile],
      [Barracks, CityImprovementMaintenanceGold, 2, Automobile, null],
    ] as [
      typeof CityImprovement,
      typeof CityImprovementMaintenanceGold,
      number,
      typeof Advance | null,
      typeof Advance | null
    ][]
  ).map(
    ([
      CityImprovementType,
      YieldType,
      cost,
      RequiredAdvance,
      ObsoletingAdvance,
    ]): Cost =>
      new Cost(
        new Criterion((city: City): boolean =>
          cityImprovementRegistry
            .getByCity(city)
            .some(
              (cityImprovement: CityImprovement): boolean =>
                cityImprovement instanceof CityImprovementType
            )
        ),
        new Criterion(
          (city: City): boolean =>
            RequiredAdvance === null ||
            playerResearchRegistry
              .getByPlayer(city.player())
              .completed(RequiredAdvance)
        ),
        new Criterion(
          (city: City): boolean =>
            ObsoletingAdvance === null ||
            !playerResearchRegistry
              .getByPlayer(city.player())
              .completed(ObsoletingAdvance)
        ),
        new Effect((city: City): Yield => {
          const [cityImprovement] = cityImprovementRegistry
            .getByCity(city)
            .filter(
              (cityImprovement) =>
                cityImprovement instanceof CityImprovementType
            );

          return new YieldType(cost, cityImprovement) as Yield;
        })
      )
  ),
];

export default getRules;
