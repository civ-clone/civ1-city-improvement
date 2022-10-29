"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Destroyed_1 = require("@civ-clone/core-city/Rules/Destroyed");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    new Destroyed_1.default(new Criterion_1.default((city) => cityImprovementRegistry.getByCity(city).length > 0), new Effect_1.default((city) => cityImprovementRegistry
        .getByCity(city)
        .forEach((cityImprovement) => cityImprovementRegistry.unregister(cityImprovement)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=destroyed.js.map