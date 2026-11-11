"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollute = void 0;
const TileImprovements_1 = require("@civ-clone/civ1-world/TileImprovements");
const level_1 = require("@civ-clone/civ1-difficulty/level");
const pollution_1 = require("./pollution");
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
const pollute = (city, cityYields, { cityRegistry, cityImprovementRegistry, cityGrowthRegistry, playerResearchRegistry, tileImprovementRegistry, gameDifficultyRegistry, ruleRegistry, engine, randomNumberGenerator, }) => {
    const points = (0, pollution_1.default)(city, cityYields, ruleRegistry, cityImprovementRegistry, cityGrowthRegistry, playerResearchRegistry);
    if (points <= 0) {
        return;
    }
    // Advances count from 1, as `civ1-science`'s research cost counts them.
    const advancesKnown = playerResearchRegistry.getByPlayer(city.player()).complete().length + 1, range = 256 - Math.floor((advancesKnown * (0, level_1.levelOf)(gameDifficultyRegistry)) / 2);
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
};
exports.pollute = pollute;
exports.default = exports.pollute;
//# sourceMappingURL=pollute.js.map