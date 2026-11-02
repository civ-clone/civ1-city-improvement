"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growthLimit = exports.aqueductSizeLimit = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const CityImprovements_1 = require("../CityImprovements");
/** The largest a city grows without an Aqueduct, as v474.05. */
exports.aqueductSizeLimit = 10;
/**
 * What a city needs before it can grow any larger: `Aqueduct` once it has reached `aqueductSizeLimit` without one, or
 * `null` when nothing holds it back. The `Grow` rule that shrinks it back (`Rules/City/grow`) and the data a renderer
 * is sent (`AdditionalData/growthLimit`) both read this, so they can't disagree (civ-clone/web-renderer#781).
 */
const growthLimit = (cityGrowth, cityImprovementRegistry = CityImprovementRegistry_1.instance) => cityGrowth.size() >= exports.aqueductSizeLimit &&
    !cityImprovementRegistry
        .getByCity(cityGrowth.city())
        .some((improvement) => improvement instanceof CityImprovements_1.Aqueduct)
    ? CityImprovements_1.Aqueduct
    : null;
exports.growthLimit = growthLimit;
exports.default = exports.growthLimit;
//# sourceMappingURL=growthLimit.js.map