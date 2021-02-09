"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const UnitImprovementRegistry_1 = require("@civ-clone/core-unit-improvement/UnitImprovementRegistry");
const CityImprovements_1 = require("../../CityImprovements");
const Created_1 = require("@civ-clone/core-unit/Rules/Created");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const UnitImprovements_1 = require("@civ-clone/civ1-unit/UnitImprovements");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, unitImprovementRegistry = UnitImprovementRegistry_1.instance) => [
    new Created_1.default(new Criterion_1.default((unit) => unit.city() !== null), new Criterion_1.default((unit) => cityImprovementRegistry
        .getByCity(unit.city())
        .some((cityImprovement) => cityImprovement instanceof CityImprovements_1.Barracks)), new Effect_1.default((unit) => unitImprovementRegistry.register(new UnitImprovements_1.Veteran(unit)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=created.js.map