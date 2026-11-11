import City from '@civ-clone/core-city/City';
import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { GameDifficultyRegistry } from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { TileImprovementRegistry } from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import Yield from '@civ-clone/core-yield/Yield';
export type PolluteDependencies = {
  cityRegistry: CityRegistry;
  cityImprovementRegistry: CityImprovementRegistry;
  cityGrowthRegistry: CityGrowthRegistry;
  playerResearchRegistry: PlayerResearchRegistry;
  tileImprovementRegistry: TileImprovementRegistry;
  gameDifficultyRegistry: GameDifficultyRegistry;
  ruleRegistry: RuleRegistry;
  engine: Engine;
  randomNumberGenerator: () => number;
};
/**
 * A city's turn's roll for pollution (`lib/pollution` gives its points), as v474.05 rolls it (civd `CITYMGT.C`
 * `city_process()`, civ-clone/web-renderer#32):
 *
 *     if (pollution_k * 2 > rand_scaled(256 - tech_count[selected_owner] * cur_tier / 2)) {
 *         scratch_i = rand_scaled(20);
 *
 * When `2 × points` beats a roll of `0 .. 255 − advances known × difficulty ÷ 2`, a random one of the 20 squares around
 * the city is polluted, unless it's Ocean, a city or already polluted (no second roll), and `city:polluted` is emitted.
 * Which cities roll is the rule's: whichever rule rolls does so through this (civ-clone/web-renderer#954).
 */
export declare const pollute: (
  city: City,
  cityYields: Yield[],
  {
    cityRegistry,
    cityImprovementRegistry,
    cityGrowthRegistry,
    playerResearchRegistry,
    tileImprovementRegistry,
    gameDifficultyRegistry,
    ruleRegistry,
    engine,
    randomNumberGenerator,
  }: PolluteDependencies
) => void;
export default pollute;
