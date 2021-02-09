"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovements_1 = require("../../CityImprovements");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const FoodStorage_1 = require("@civ-clone/core-city-growth/Yields/FoodStorage");
const Grow_1 = require("@civ-clone/core-city-growth/Rules/Grow");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    new Grow_1.default(new Criterion_1.default((cityGrowth) => !cityImprovementRegistry
        .getByCity(cityGrowth.city())
        .some((improvement) => improvement instanceof CityImprovements_1.Aqueduct)), new Criterion_1.default((cityGrowth) => cityGrowth.size() > 10), new Effect_1.default((cityGrowth) => cityGrowth.shrink())),
    new Grow_1.default(new Criterion_1.default((cityGrowth) => cityImprovementRegistry
        .getByCity(cityGrowth.city())
        .some((improvement) => improvement instanceof CityImprovements_1.Granary)), new Effect_1.default((cityGrowth) => cityGrowth.add(new FoodStorage_1.default(cityGrowth.cost().value() / 2)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=grow.js.map