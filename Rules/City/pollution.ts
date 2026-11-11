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
import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { POLLUTION_RULE } from '../../RuleIds';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import { Production } from '../../Yields';
import Yield from '@civ-clone/core-yield/Yield';
import { instance as rngInstance } from '@civ-clone/core-random';
import isHuman from '@civ-clone/civ1-difficulty/isHuman';
import pollute from '../../lib/pollute';

// Each turn a city of the human's with pollution (`lib/pollution`) may pollute one of the 20 squares around it
//  (`lib/pollute`, civ-clone/web-renderer#32). As v474.05, only the human's cities roll (civd `CITYMGT.C`
//  `city_process()`, civ-clone/web-renderer#954):
//
//      if (selected_owner == civnow) {
//          pollution_k = town_res_sums[1] / plant_waste_divisor - 20;
//
//  `civ1-enhanced` rolls for every city, taking this rule's place while its set is on.
export const getRules: (
  cityRegistry?: CityRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  cityGrowthRegistry?: CityGrowthRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  tileImprovementRegistry?: TileImprovementRegistry,
  gameDifficultyRegistry?: GameDifficultyRegistry,
  ruleRegistry?: RuleRegistry,
  engine?: Engine,
  randomNumberGenerator?: () => number,
  clientRegistry?: ClientRegistry
) => ProcessYield[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
  tileImprovementRegistry: TileImprovementRegistry = tileImprovementRegistryInstance,
  gameDifficultyRegistry: GameDifficultyRegistry = gameDifficultyRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  engine: Engine = engineInstance,
  randomNumberGenerator: () => number = rngInstance,
  clientRegistry: ClientRegistry = clientRegistryInstance
): ProcessYield[] => [
  new ProcessYield(
    POLLUTION_RULE,
    // Once a turn: the consolidated shields are processed once per city.
    new Criterion(
      (cityYield: Yield): boolean => cityYield instanceof Production
    ),
    new Criterion((cityYield: Yield, city: City): boolean =>
      isHuman(city.player(), clientRegistry)
    ),
    new Effect((cityYield: Yield, city: City, cityYields: Yield[]): void =>
      pollute(city, cityYields, {
        cityRegistry,
        cityImprovementRegistry,
        cityGrowthRegistry,
        playerResearchRegistry,
        tileImprovementRegistry,
        gameDifficultyRegistry,
        ruleRegistry,
        engine,
        randomNumberGenerator,
      })
    )
  ),
];

export default getRules;
