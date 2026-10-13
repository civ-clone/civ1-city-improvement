import cityBuild from './Rules/City/build';
import cityBuildCost from './Rules/City/build-cost';
import cityBuildPriority from './Rules/City/build-priority';
import cityCaptured from './Rules/City/captured';
import cityCost from './Rules/City/cost';
import cityCreated from './Rules/City/created';
import cityDestroyed from './Rules/City/destroyed';
import cityGrow from './Rules/City/grow';
import cityPollution from './Rules/City/pollution';
import cityPollutionDivisor from './Rules/City/pollution-divisor';
import cityImprovementCreated from './Rules/CityImprovement/created';
import cityYieldModifier from './Rules/City/yield-modifier';
import playerResearchComplete from './Rules/Player/research-complete';
import unitCreated from './Rules/Unit/created';
import { Game, defaultGame } from '@civ-clone/core-game';

export const register = (game: Game): void =>
  game.rules.register(
    ...cityBuild(game.cityImprovements, game.playerResearch),
    ...cityBuildCost(),
    ...cityCaptured(game.cityImprovements, game.rng),
    ...cityBuildPriority(
      game.cityGrowth,
      game.cityImprovements,
      game.interactions,
      game.playerResearch,
      game.cities,
      game.units
    ),
    ...cityCost(game.cityImprovements, game.playerResearch),
    ...cityCreated(game.cities, game.cityImprovements, game.rules),
    ...cityDestroyed(game.cityImprovements),
    ...cityGrow(game.cityImprovements),
    ...cityPollution(
      game.cities,
      game.cityImprovements,
      game.cityGrowth,
      game.playerResearch,
      game.tileImprovements,
      game.difficulty,
      game.rules,
      game.engine,
      game.rng
    ),
    ...cityPollutionDivisor(game.cityImprovements),
    ...cityImprovementCreated(game.cityImprovements, game.engine),
    ...cityYieldModifier(game.cityImprovements),
    ...playerResearchComplete(game.cityImprovements, game.cities, game.engine),
    ...unitCreated(game.cityImprovements, game.unitImprovements)
  );

// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
register(defaultGame);

export default register;
