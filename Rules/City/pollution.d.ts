import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { GameDifficultyRegistry } from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import { ClientRegistry } from '@civ-clone/core-client/ClientRegistry';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
export declare const getRules: (
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
) => ProcessYield[];
export default getRules;
