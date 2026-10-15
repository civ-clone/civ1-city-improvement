"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollution = exports.pollutingAdvances = void 0;
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const CityImprovements_1 = require("../CityImprovements");
const PollutionDivisor_1 = require("../Rules/PollutionDivisor");
const Yields_1 = require("@civ-clone/library-city/Yields");
// The advances that make a city's population pollute, one step each (v474.05 `CityWorker.cs` ~L188-200).
exports.pollutingAdvances = [
    Advances_1.Industrialization,
    Advances_1.Automobile,
    Advances_1.MassProduction,
    Advances_1.Plastics,
];
/**
 * A city's pollution: what v474.05 calls its "smokestack points", worked out each turn (`CityWorker.cs` ~L3710,
 * civ-clone/web-renderer#32):
 * its shields (after the Factory and plant bonuses, before unit support) divided by its `PollutionDivisor`, plus its
 * size times the polluting advances its owner knows (none with Mass Transit) over 4, less 20. Only a value above 0
 * risks pollution.
 */
const pollution = (city, cityYields = city.yields(), ruleRegistry = RuleRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, cityGrowthRegistry = CityGrowthRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => {
    const shields = cityYields
        .filter((cityYield) => cityYield instanceof Yields_1.Production &&
        !(cityYield instanceof Yields_1.UnitSupportProduction))
        .reduce((total, cityYield) => total + cityYield.value(), 0), divisor = Math.max(1, ...ruleRegistry.process(PollutionDivisor_1.default, city)), playerResearch = playerResearchRegistry.getByPlayer(city.player()), level = cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovements_1.MassTransit)
        ? 0
        : exports.pollutingAdvances.filter((Advance) => playerResearch.completed(Advance))
            .length, size = cityGrowthRegistry.getByCity(city).size();
    return (Math.floor(Math.max(0, shields) / divisor) +
        Math.floor((size * level) / 4) -
        20);
};
exports.pollution = pollution;
exports.default = exports.pollution;
//# sourceMappingURL=pollution.js.map