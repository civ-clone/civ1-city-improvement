import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  GameDifficultyRegistry,
  instance as gameDifficultyRegistryInstance,
} from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Pollution } from '@civ-clone/civ1-world/TileImprovements';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import { Production } from '../../Yields';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import Yield from '@civ-clone/core-yield/Yield';
import { instance as rngInstance } from '@civ-clone/core-random';
import { levelOf } from '@civ-clone/civ1-difficulty/level';
import smokestacks from '../../lib/smokestacks';

// Each turn a city with smokestack points (`lib/smokestacks`) may pollute one of the 20 squares around it, as v474.05
//  does (`CityWorker.cs` ~L3710-3751, civ-clone/web-renderer#32): when `2 × points` beats a roll of
//  `0 .. 255 − advances known × difficulty ÷ 2`, a random one of those squares is polluted, unless it's Ocean, a city or
//  already polluted (no second roll). v474.05 only rolls for the human's cities; here every city does (Dom's decision on
//  #32).
export const getRules: (
  cityRegistry?: CityRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  cityGrowthRegistry?: CityGrowthRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  tileImprovementRegistry?: TileImprovementRegistry,
  gameDifficultyRegistry?: GameDifficultyRegistry,
  ruleRegistry?: RuleRegistry,
  engine?: Engine,
  randomNumberGenerator?: () => number
) => ProcessYield[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  gameDifficultyRegistry: GameDifficultyRegistry = gameDifficultyRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  engine: Engine = engineInstance,
  randomNumberGenerator: () => number = rngInstance
): ProcessYield[] => [
  new ProcessYield(
    'civ1-city-improvement:city/process-yield/pollution',
    // Once a turn: the consolidated shields are processed once per city.
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Production
    ),
    new Effect((cityYield: Yield, city: City, cityYields: Yield[]): void => {
      const points = smokestacks(
        city,
        cityYields,
        ruleRegistry,
        cityImprovementRegistry,
        cityGrowthRegistry,
        playerResearchRegistry
      );

      if (points <= 0) {
        return;
      }

      // Advances count from 1, as `civ1-science`'s research cost counts them.
      const advancesKnown =
          playerResearchRegistry.getByPlayer(city.player()).complete().length +
          1,
        range =
          256 -
          Math.floor((advancesKnown * levelOf(gameDifficultyRegistry)) / 2);

      if (2 * points <= Math.floor(randomNumberGenerator() * range)) {
        return;
      }

      const around = city
          .tiles()
          .entries()
          .filter((tile: Tile): boolean => tile !== city.tile()),
        tile = around[Math.floor(randomNumberGenerator() * around.length)];

      if (
        !tile ||
        tile.isWater() ||
        cityRegistry.getByTile(tile) !== null ||
        tileImprovementRegistry
          .getByTile(tile)
          .some(
            (improvement: TileImprovement): boolean =>
              improvement instanceof Pollution
          )
      ) {
        return;
      }

      // Building it processes `Built`, which puts it on the tile.
      new Pollution(tile, ruleRegistry);

      engine.emit('city:polluted', city, tile);
    })
  ),
];

export default getRules;
