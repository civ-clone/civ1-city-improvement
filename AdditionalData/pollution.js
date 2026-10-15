"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdditionalData = void 0;
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const AdditionalData_1 = require("@civ-clone/core-data-object/AdditionalData");
const City_1 = require("@civ-clone/core-city/City");
const pollution_1 = require("../lib/pollution");
/**
 * How much the city pollutes: its pollution over what it tolerates (`lib/pollution`), never below 0, so a renderer can
 * show it without knowing the rule (civ-clone/web-renderer#402). Civ1 draws it as that many smokestacks.
 */
const getAdditionalData = (ruleRegistry = RuleRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, cityGrowthRegistry = CityGrowthRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => [
    new AdditionalData_1.default(City_1.default, 'pollution', (city) => Math.max(0, (0, pollution_1.default)(city, city.yields(), ruleRegistry, cityImprovementRegistry, cityGrowthRegistry, playerResearchRegistry))),
];
exports.getAdditionalData = getAdditionalData;
exports.default = exports.getAdditionalData;
//# sourceMappingURL=pollution.js.map