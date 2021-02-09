"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Created_1 = require("@civ-clone/core-city/Rules/Created");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const CityImprovements_1 = require("../../CityImprovements");
const getRules = (cityRegistry = CityRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => [
    new Created_1.default(new Criterion_1.default((city) => cityRegistry.getByPlayer(city.player()).length === 0), new Effect_1.default((city) => cityImprovementRegistry.register(new CityImprovements_1.Palace(city.player(), city, ruleRegistry)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=created.js.map