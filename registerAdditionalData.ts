import { Game, defaultGame } from '@civ-clone/core-game';
import smokestacks from './AdditionalData/smokestacks';

export const register = (game: Game): void =>
  game.additionalData.register(
    ...smokestacks(
      game.rules,
      game.cityImprovements,
      game.cityGrowth,
      game.playerResearch
    )
  );

// Imported for this side effect, as `registerRules` is.
register(defaultGame);

export default register;
