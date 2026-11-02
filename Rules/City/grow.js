"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovements_1 = require("../../CityImprovements");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const Grow_1 = require("@civ-clone/core-city-growth/Rules/Grow");
const growthLimit_1 = require("../../lib/growthLimit");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    new Grow_1.default(
    // Past the limit, as it has just grown: shrinking back undoes the growth.
    new Criterion_1.default((cityGrowth) => cityGrowth.size() > growthLimit_1.aqueductSizeLimit &&
        (0, growthLimit_1.default)(cityGrowth, cityImprovementRegistry) !== null), 
    // The missing Aqueduct is what keeps it from growing (civ-clone/web-renderer#400).
    new Effect_1.default((cityGrowth) => cityGrowth.shrink(CityImprovements_1.Aqueduct))),
    new Grow_1.default(new Criterion_1.default((cityGrowth) => cityImprovementRegistry
        .getByCity(cityGrowth.city())
        .some((improvement) => improvement instanceof CityImprovements_1.Granary)), new Effect_1.default((cityGrowth) => cityGrowth.add(new Yields_1.FoodStorage(cityGrowth.cost().value() / 2)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=grow.js.map