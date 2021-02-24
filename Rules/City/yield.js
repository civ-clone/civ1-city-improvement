"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const CityImprovements_1 = require("../../CityImprovements");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const Luxuries_1 = require("@civ-clone/base-city-yield-luxuries/Luxuries");
const Yields_2 = require("@civ-clone/civ1-science/Yields");
const Yield_1 = require("@civ-clone/core-city/Rules/Yield");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    ...[
        [CityImprovements_1.Marketplace, Yields_1.Gold, 0.5],
        [CityImprovements_1.Marketplace, Luxuries_1.default, 0.5],
        [CityImprovements_1.Library, Yields_2.Research, 0.5],
    ].map(([Improvement, YieldType, multiplier]) => new Yield_1.default(new Criterion_1.default((cityYield) => cityYield instanceof YieldType), new Criterion_1.default((cityYield, city) => cityImprovementRegistry
        .getByCity(city)
        .some((improvement) => improvement instanceof Improvement)), new Effect_1.default((cityYield) => cityYield.add(cityYield.value() * multiplier, Improvement.name)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map