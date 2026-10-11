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
  NuclearPlant,
  PowerPlant,
  Temple,
  University,
} from '../../CityImprovements';
import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  Corruption,
  Food,
  Gold,
  Luxuries,
  Production,
  Research,
  Unhappiness,
} from '@civ-clone/library-city/Yields';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  InteractionRegistry,
  instance as interactionRegistryInstance,
} from '@civ-clone/core-diplomacy/InteractionRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import BuildPriority from '@civ-clone/core-city-build/Rules/BuildPriority';
import { IBuildable as Buildable } from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { IInteraction } from '@civ-clone/core-diplomacy/Interaction';
import Peace from '@civ-clone/base-diplomacy-declaration-peace/Peace';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import Yield from '@civ-clone/core-yield/Yield';
import { upkeep } from './cost';

// What a city needs, as its yields and size show now. Worked out once for each item the city is ranking, so kept small.
export interface CityNeeds {
  city: City;
  corruption: number;
  food: number;
  gold: number;
  luxuries: number;
  production: number;
  research: number;
  size: number;
  unhappy: number;
}

const total = (yields: Yield[], YieldType: typeof Yield): number =>
  yields
    .filter((cityYield: Yield): boolean => cityYield instanceof YieldType)
    .reduce(
      (sum: number, cityYield: Yield): number => sum + cityYield.value(),
      0
    );

// The size above which a city needs an Aqueduct to grow (`Rules/City/grow`).
const aqueductSize = 10;

// How much a city needs each improvement, before what it costs to keep, from 0 (not at all). The rules of thumb follow
//  Civ1's feel, not its code (civ-clone/web-renderer#194): a starving city wants a Granary, and so, a little, does one
//  of size 3 or more with 1 Food or less to spare (in the arena, wanting one in every small city short of Food cost
//  computer players shields and score). A city near the size cap wants an Aqueduct (sooner with Food to spare),
//  unhappy citizens a Temple, then a Colosseum, then a Cathedral, trade the buildings that multiply what it's spent
//  on, corruption a Courthouse, and shields a Factory and then a plant.
export const needs: [typeof CityImprovement, (needs: CityNeeds) => number][] = [
  [
    Granary,
    ({ food, size }): number => (food < 0 ? 3 : food <= 1 && size >= 3 ? 1 : 0),
  ],
  [
    Aqueduct,
    ({ food, size }): number =>
      size >= aqueductSize - 2
        ? (size - (aqueductSize - 3)) * 2 + (food >= 4 ? 2 : 0)
        : food >= 4 && size >= aqueductSize - 4
        ? 2
        : 0,
  ],
  [
    Temple,
    ({ size, unhappy }): number =>
      unhappy > 0 ? 2 + unhappy * 2 : size >= 5 ? 1 : 0,
  ],
  [Colosseum, ({ unhappy }): number => Math.max(0, unhappy - 2) * 2],
  [Cathedral, ({ unhappy }): number => Math.max(0, unhappy - 3) * 2],
  [Marketplace, ({ gold, luxuries }): number => (gold + luxuries) * 0.5],
  [Library, ({ research }): number => research * 0.5],
  [Bank, ({ gold, luxuries }): number => (gold + luxuries) * 0.3],
  [University, ({ research }): number => research * 0.3],
  [
    Courthouse,
    ({ corruption }): number => (corruption >= 2 ? corruption * 0.5 : 0),
  ],
  [
    Factory,
    ({ production }): number => (production >= 8 ? production * 0.25 : 0),
  ],
];

// Improvements worth having in any city sooner or later, so a city on Auto always has one to build: they score at
//  least `everyday` whatever the city needs now, which any real need outranks.
const everydayImprovements: (typeof CityImprovement)[] = [
  Bank,
  Courthouse,
  Granary,
  Library,
  Marketplace,
  Temple,
  University,
];

export const everyday = 0.1;

// Improvements that multiply what a Factory adds, so only needed where there is one.
const withFactory: [typeof CityImprovement, number][] = [
  [ManufacturingPlant, 0.2],
  [HydroPlant, 0.15],
  [NuclearPlant, 0.15],
  [PowerPlant, 0.15],
];

// Improvements that only help a city under threat: they come before anything else then (civ-clone/web-renderer#194).
const forWar: (typeof CityImprovement)[] = [Barracks, CityWalls];

// The priority of an improvement a threatened city needs, above any of its other needs.
export const warPriority = 100;

// How near another player's unit or city has to be to threaten a city.
export const threatRadius = 5;

// Whether a unit or city of a player `city`'s owner isn't at peace with is within `threatRadius` tiles of it. Civ1 has
//  no declared war: two players who've met are at war until they agree peace, so having met isn't enough on its own.
export const isThreatened = (
  city: City,
  cityRegistry: CityRegistry = cityRegistryInstance,
  interactionRegistry: InteractionRegistry = interactionRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance
): boolean => {
  const player = city.player(),
    atPeace = new Set<Player>(),
    isEnemy = (other: Player): boolean =>
      other !== player && !atPeace.has(other);

  interactionRegistry
    .getByPlayer(player)
    .forEach((interaction: IInteraction): void => {
      if (interaction instanceof Peace && interaction.active()) {
        interaction.players().forEach((other: Player) => atPeace.add(other));
      }
    });

  return city
    .tile()
    .getSurroundingArea(threatRadius)
    .entries()
    .some((tile: Tile): boolean => {
      const tileCity = cityRegistry.getByTile(tile);

      return (
        (tileCity !== null && isEnemy(tileCity.player())) ||
        unitRegistry
          .getByTile(tile)
          .some((unit: Unit): boolean => isEnemy(unit.player()))
      );
    });
};

export const getRules: (
  cityGrowthRegistry?: CityGrowthRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  interactionRegistry?: InteractionRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  cityRegistry?: CityRegistry,
  unitRegistry?: UnitRegistry
) => BuildPriority[] = (
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  interactionRegistry: InteractionRegistry = interactionRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  cityRegistry: CityRegistry = cityRegistryInstance,
  unitRegistry: UnitRegistry = unitRegistryInstance
): BuildPriority[] => {
  const cityNeeds = (city: City, yields: Yield[]): CityNeeds => ({
      city,
      // Corruption yields are negative: what the city loses.
      corruption: -total(yields, Corruption),
      food: total(yields, Food),
      gold: total(yields, Gold),
      luxuries: total(yields, Luxuries),
      production: total(yields, Production),
      research: total(yields, Research),
      size: cityGrowthRegistry.getByCity(city).size(),
      unhappy: total(yields, Unhappiness),
    }),
    // What the improvement costs to keep, against what the city makes in gold: half as needed when it would cost all the
    //  city makes, and hardly at all in a city making none.
    affordable = (Item: typeof CityImprovement, city: City, gold: number) =>
      (1 + Math.max(0, gold)) /
      (1 +
        Math.max(0, gold) +
        upkeep(Item, city.player(), playerResearchRegistry)),
    hasFactory = (city: City): boolean =>
      cityImprovementRegistry
        .getByCity(city)
        .some((improvement: CityImprovement) => improvement instanceof Factory),
    isItem =
      (Item: typeof CityImprovement) =>
      (cityBuild: CityBuild, BuildItem: Buildable): boolean =>
        BuildItem === (Item as unknown as Buildable);

  return [
    ...needs.map(
      ([Item, need]): BuildPriority =>
        new BuildPriority(
          `civ1-city-improvement:city/build-priority/${Item.name}`,
          new Criterion(isItem(Item)),
          new Effect(
            (
              cityBuild: CityBuild,
              BuildItem: Buildable,
              yields: Yield[]
            ): number => {
              const needs = cityNeeds(cityBuild.city(), yields);

              return (
                Math.max(
                  need(needs),
                  everydayImprovements.includes(Item) ? everyday : 0
                ) * affordable(Item, needs.city, needs.gold)
              );
            }
          )
        )
    ),
    ...withFactory.map(
      ([Item, share]): BuildPriority =>
        new BuildPriority(
          `civ1-city-improvement:city/build-priority/${Item.name}`,
          new Criterion(isItem(Item)),
          new Criterion((cityBuild: CityBuild): boolean =>
            hasFactory(cityBuild.city())
          ),
          new Effect(
            (
              cityBuild: CityBuild,
              BuildItem: Buildable,
              yields: Yield[]
            ): number => {
              const needs = cityNeeds(cityBuild.city(), yields);

              return (
                needs.production *
                share *
                affordable(Item, needs.city, needs.gold)
              );
            }
          )
        )
    ),
    ...forWar.map(
      (Item: typeof CityImprovement): BuildPriority =>
        new BuildPriority(
          `civ1-city-improvement:city/build-priority/${Item.name}`,
          new Criterion(isItem(Item)),
          new Criterion((cityBuild: CityBuild): boolean =>
            isThreatened(
              cityBuild.city(),
              cityRegistry,
              interactionRegistry,
              unitRegistry
            )
          ),
          new Effect((): number => warPriority)
        )
    ),
  ];
};

export default getRules;
