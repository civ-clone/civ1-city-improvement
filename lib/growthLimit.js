"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growthLimit = exports.growthLimits = exports.aqueductSizeLimit = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const growthLimit_1 = require("@civ-clone/base-city-growth-limit/lib/growthLimit");
const CityImprovements_1 = require("../CityImprovements");
/** The largest a city grows without an Aqueduct, as v474.05. */
exports.aqueductSizeLimit = 10;
/** Civ1's one size cap, as `base-city-growth-limit` reads it. */
exports.growthLimits = [
    [exports.aqueductSizeLimit, CityImprovements_1.Aqueduct],
];
/**
 * What a city needs before it can grow any larger: `Aqueduct` once it has reached `aqueductSizeLimit` without one, or
 * `null` when nothing holds it back. The `Grow` rule that shrinks it back (`Rules/City/grow`) and the data a renderer
 * is sent (`AdditionalData/growthLimit`) both read `growthLimits`, so they can't disagree
 * (civ-clone/web-renderer#781).
 */
const growthLimit = (cityGrowth, cityImprovementRegistry = CityImprovementRegistry_1.instance) => {
    var _a, _b;
    return (_b = (_a = (0, growthLimit_1.growthLimit)(cityGrowth, exports.growthLimits, cityImprovementRegistry)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : null;
};
exports.growthLimit = growthLimit;
exports.default = exports.growthLimit;
//# sourceMappingURL=growthLimit.js.map