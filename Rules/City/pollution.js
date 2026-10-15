"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const GameDifficultyRegistry_1 = require("@civ-clone/core-difficulty/GameDifficultyRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const TileImprovements_1 = require("@civ-clone/civ1-world/TileImprovements");
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const Yields_1 = require("../../Yields");
const core_random_1 = require("@civ-clone/core-random");
const level_1 = require("@civ-clone/civ1-difficulty/level");
const pollution_1 = require("../../lib/pollution");
// Each turn a city with pollution (`lib/pollution`) may pollute one of the 20 squares around it, as v474.05
//  does (`CityWorker.cs` ~L3710-3751, civ-clone/web-renderer#32): when `2 × points` beats a roll of
//  `0 .. 255 − advances known × difficulty ÷ 2`, a random one of those squares is polluted, unless it's Ocean, a city or
//  already polluted (no second roll). v474.05 only rolls for the human's cities; here every city does (Dom's decision on
//  #32).
const getRules = (cityRegistry = CityRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, cityGrowthRegistry = CityGrowthRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance, gameDifficultyRegistry = GameDifficultyRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, engine = Engine_1.instance, randomNumberGenerator = core_random_1.instance) => [
    new ProcessYield_1.default('civ1-city-improvement:city/process-yield/pollution', 
    // Once a turn: the consolidated shields are processed once per city.
    new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Production), new Effect_1.default((cityYield, city, cityYields) => {
        const points = (0, pollution_1.default)(city, cityYields, ruleRegistry, cityImprovementRegistry, cityGrowthRegistry, playerResearchRegistry);
        if (points <= 0) {
            return;
        }
        // Advances count from 1, as `civ1-science`'s research cost counts them.
        const advancesKnown = playerResearchRegistry.getByPlayer(city.player()).complete().length +
            1, range = 256 -
            Math.floor((advancesKnown * (0, level_1.levelOf)(gameDifficultyRegistry)) / 2);
        if (2 * points <= Math.floor(randomNumberGenerator() * range)) {
            return;
        }
        const around = city
            .tiles()
            .entries()
            .filter((tile) => tile !== city.tile()), tile = around[Math.floor(randomNumberGenerator() * around.length)];
        if (!tile ||
            tile.isWater() ||
            cityRegistry.getByTile(tile) !== null ||
            tileImprovementRegistry
                .getByTile(tile)
                .some((improvement) => improvement instanceof TileImprovements_1.Pollution)) {
            return;
        }
        // Building it processes `Built`, which puts it on the tile.
        new TileImprovements_1.Pollution(tile, ruleRegistry);
        engine.emit('city:polluted', city, tile);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pollution.js.map