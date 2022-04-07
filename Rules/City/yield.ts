import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Monarchy,
  Republic,
} from '@civ-clone/civ1-government/Governments';
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
  CityImprovementMaintenanceGold,
  Corruption,
  Trade,
} from '../../Yields';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import Advance from '@civ-clone/core-science/Advance';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Government from '@civ-clone/core-government/Government';
import High from '@civ-clone/core-rule/Priorities/High';
import Priority from '@civ-clone/core-rule/Priority';
import Yield from '@civ-clone/core-yield/Yield';
import YieldRule from '@civ-clone/core-city/Rules/Yield';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  playerGovernmentRegistry?: PlayerGovernmentRegistry
) => YieldRule[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  playerGovernmentRegistry: PlayerGovernmentRegistry = playerGovernmentRegistryInstance
): YieldRule[] => [
  new YieldRule(
    new High(),
    new Effect((city: City, yields: Yield[]) => {
      // Corruption Formula: p223-224, Wilson, J.L & Emrich A. (1992). Sid Meier's Civilization, or Rome on 640K a Day. Rocklin, CA: Prima Publishing
      const playerGovernment = playerGovernmentRegistry.getByPlayer(
          city.player()
        ),
        [capital] = cityImprovementRegistry
          .filter(
            (cityImprovement) =>
              cityImprovement instanceof Palace &&
              city.player() === cityImprovement.city().player()
          )
          .map((cityImprovement) => cityImprovement.city()),
        currentTrade = reduceYield(yields, Trade),
        distanceFromCapital = playerGovernment.is(Communism)
          ? 10
          : playerGovernment.is(Democracy)
          ? 0
          : capital
          ? capital.tile().distanceFrom(city.tile())
          : 32,
        // These values could be provided by `Rule`s to allow other government types to be created
        [governmentModifier] = (
          [
            [Anarchy, 8],
            [Despotism, 12],
            [Monarchy, 16],
            [Communism, 20],
            [Republic, 24],
          ] as [typeof Government, number][]
        )
          .filter(([GovernmentType]) => playerGovernment.is(GovernmentType))
          .map(([, modifier]) => modifier);

      return new Corruption(
        governmentModifier
          ? // Assuming `floor` here, although it might be `round`ed... Need to check in Civ.
            Math.floor(
              (currentTrade * distanceFromCapital * 3) /
                (10 * governmentModifier)
            )
          : 0,
        distanceFromCapital.toFixed(2)
      );
    })
  ),

  new YieldRule(
    new Priority(1500),
    new Criterion((city: City) =>
      cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof Courthouse)
    ),
    new Effect(
      (city: City, yields: Yield[]) =>
        new Corruption(
          // This feels a little nicer, assuming that you've built a `Courthouse` you'd be annoyed if it didn't change the `Corruption` at all...
          -Math.ceil(reduceYield(yields, Trade) / 2),
          Courthouse.name
        )
    )
  ),

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
    ([CityImprovementType, YieldType, cost]): YieldRule =>
      new YieldRule(
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
    ]): YieldRule =>
      new YieldRule(
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
