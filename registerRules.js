"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const Requirements_1 = require("./Requirements");
const build_1 = require("./Rules/City/build");
const build_cost_1 = require("./Rules/City/build-cost");
const build_priority_1 = require("./Rules/City/build-priority");
const captured_1 = require("./Rules/City/captured");
const cost_1 = require("./Rules/City/cost");
const created_1 = require("./Rules/City/created");
const destroyed_1 = require("./Rules/City/destroyed");
const grow_1 = require("./Rules/City/grow");
const pollution_1 = require("./Rules/City/pollution");
const pollution_divisor_1 = require("./Rules/City/pollution-divisor");
const created_2 = require("./Rules/CityImprovement/created");
const yield_modifier_1 = require("./Rules/City/yield-modifier");
const research_complete_1 = require("./Rules/Player/research-complete");
const created_3 = require("./Rules/Unit/created");
const core_game_1 = require("@civ-clone/core-game");
const register = (game) => {
    game.rules.register((0, build_1.notBuiltRule)(game.cityImprovements));
    // Which improvements a city may build, from the entries in `Requirements`: their rules land where the build rules
    //  always were, between the rules above and below, so nothing else moves in the order rules run
    //  (civ-clone/web-renderer#37).
    game.requirements.add((0, build_1.deriveBuildRules)(game.cityImprovements, game.playerResearch), ...Requirements_1.buildRequirements);
    game.requirements.add(null, ...Requirements_1.describedRequirements);
    game.rules.register((0, build_1.hydroPlantSiteRule)(), ...(0, build_cost_1.default)(), ...(0, captured_1.default)(game.cityImprovements, game.rng), ...(0, build_priority_1.default)(game.cityGrowth, game.cityImprovements, game.interactions, game.playerResearch, game.cities, game.units), ...(0, cost_1.default)(game.cityImprovements, game.playerResearch), ...(0, created_1.default)(game.cities, game.cityImprovements, game.rules), ...(0, destroyed_1.default)(game.cityImprovements), ...(0, grow_1.default)(game.cityImprovements), ...(0, pollution_1.default)(game.cities, game.cityImprovements, game.cityGrowth, game.playerResearch, game.tileImprovements, game.difficulty, game.rules, game.engine, game.rng), ...(0, pollution_divisor_1.default)(game.cityImprovements), ...(0, created_2.default)(game.cityImprovements, game.engine), ...(0, yield_modifier_1.default)(game.cityImprovements), ...(0, research_complete_1.default)(game.cityImprovements, game.cities, game.engine), ...(0, created_3.default)(game.cityImprovements, game.unitImprovements));
};
exports.register = register;
// The plugin loader imports each package for this side effect. Until it passes
// a `Game` of its own, dropping it would produce a game with silently absent
// rules — no error, just wrong behaviour.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map