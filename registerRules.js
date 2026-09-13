"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const build_1 = require("./Rules/City/build");
const build_cost_1 = require("./Rules/City/build-cost");
const captured_1 = require("./Rules/City/captured");
const cost_1 = require("./Rules/City/cost");
const created_1 = require("./Rules/City/created");
const destroyed_1 = require("./Rules/City/destroyed");
const grow_1 = require("./Rules/City/grow");
const created_2 = require("./Rules/CityImprovement/created");
const yield_modifier_1 = require("./Rules/City/yield-modifier");
const created_3 = require("./Rules/Unit/created");
const core_game_1 = require("@civ-clone/core-game");
const register = (game) => game.rules.register(...(0, build_1.default)(game.cityImprovements, game.playerResearch), ...(0, build_cost_1.default)(), ...(0, captured_1.default)(game.cityImprovements, game.rng), ...(0, cost_1.default)(game.cityImprovements, game.playerResearch), ...(0, created_1.default)(game.cities, game.cityImprovements, game.rules), ...(0, destroyed_1.default)(game.cityImprovements), ...(0, grow_1.default)(game.cityImprovements), ...(0, created_2.default)(game.cityImprovements, game.engine), ...(0, yield_modifier_1.default)(game.cityImprovements), ...(0, created_3.default)(game.cityImprovements, game.unitImprovements));
exports.register = register;
// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map