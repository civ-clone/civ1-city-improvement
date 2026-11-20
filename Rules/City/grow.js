"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.granaryStore = void 0;
const CityImprovements_1 = require("../../CityImprovements");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Description_1 = require("@civ-clone/core-rule/Description");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("../../Yields");
const Grow_1 = require("@civ-clone/core-city-growth/Rules/Grow");
const growthLimit_1 = require("@civ-clone/base-city-growth-limit/lib/growthLimit");
const growthLimit_2 = require("../../lib/growthLimit");
/** The share of the food box a Granary keeps when its city grows. */
exports.granaryStore = 0.5;
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    new Grow_1.default(
    // Past the limit, as it has just grown: shrinking back undoes the growth.
    new Criterion_1.default((cityGrowth) => {
        const limit = (0, growthLimit_1.growthLimit)(cityGrowth, growthLimit_2.growthLimits, cityImprovementRegistry);
        return limit !== null && cityGrowth.size() > limit[0];
    }), 
    // The missing Aqueduct is what keeps it from growing (civ-clone/web-renderer#400).
    new Effect_1.default((cityGrowth) => cityGrowth.shrink(CityImprovements_1.Aqueduct)), new Description_1.default(...growthLimit_2.growthLimits.map(([size, Improvement]) => ({
        type: 'size_limit',
        subject: Improvement,
        value: size,
    })))),
    new Grow_1.default(new Criterion_1.default((cityGrowth) => cityImprovementRegistry
        .getByCity(cityGrowth.city())
        .some((improvement) => improvement instanceof CityImprovements_1.Granary)), new Effect_1.default((cityGrowth) => cityGrowth.add(new Yields_1.FoodStorage(cityGrowth.cost().value() * exports.granaryStore))), new Description_1.default({
        type: 'growth_store',
        subject: CityImprovements_1.Granary,
        value: exports.granaryStore,
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=grow.js.map