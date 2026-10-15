"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdditionalData = void 0;
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const AdditionalData_1 = require("@civ-clone/core-data-object/AdditionalData");
const City_1 = require("@civ-clone/core-city/City");
const smokestacks_1 = require("../lib/smokestacks");
/**
 * How many smokestacks the city screen shows: the city's smokestack points over 20 (`lib/smokestacks`), each a 1%
 * chance a turn of polluting a square around it, so a renderer can draw them without knowing the rule
 * (civ-clone/web-renderer#402).
 */
const getAdditionalData = (ruleRegistry = RuleRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, cityGrowthRegistry = CityGrowthRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => [
    new AdditionalData_1.default(City_1.default, 'smokestacks', (city) => Math.max(0, (0, smokestacks_1.default)(city, city.yields(), ruleRegistry, cityImprovementRegistry, cityGrowthRegistry, playerResearchRegistry))),
];
exports.getAdditionalData = getAdditionalData;
exports.default = exports.getAdditionalData;
//# sourceMappingURL=smokestacks.js.map