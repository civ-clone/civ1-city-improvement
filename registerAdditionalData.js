"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const core_game_1 = require("@civ-clone/core-game");
const pollution_1 = require("./AdditionalData/pollution");
const register = (game) => game.additionalData.register(...(0, pollution_1.default)(game.rules, game.cityImprovements, game.cityGrowth, game.playerResearch));
exports.register = register;
// Imported for this side effect, as `registerRules` is.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerAdditionalData.js.map