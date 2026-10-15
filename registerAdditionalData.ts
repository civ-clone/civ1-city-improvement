import { Game, defaultGame } from '@civ-clone/core-game';
import pollution from './AdditionalData/pollution';

export const register = (game: Game): void =>
  game.additionalData.register(
    ...pollution(
      game.rules,
      game.cityImprovements,
      game.cityGrowth,
      game.playerResearch
    )
  );

// Imported for this side effect, as `registerRules` is.
register(defaultGame);

export default register;
