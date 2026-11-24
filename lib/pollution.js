"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pollution = exports.pollutionDescriptions = exports.cleanedBy = exports.pollutingAdvances = void 0;
const TileImprovements_1 = require("@civ-clone/civ1-world/TileImprovements");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Yields_1 = require("@civ-clone/library-city/Yields");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const pollution_1 = require("@civ-clone/base-city-pollution/lib/pollution");
const CityImprovements_1 = require("../CityImprovements");
// The advances that make a city's population pollute, one step each (v474.05 `CityWorker.cs` ~L188-200).
exports.pollutingAdvances = [
    Advances_1.Industrialization,
    Advances_1.Automobile,
    Advances_1.MassProduction,
    Advances_1.Plastics,
];
// The improvements that stop a city's population polluting (v474.05's Mass Transit).
exports.cleanedBy = [CityImprovements_1.MassTransit];
/**
 * What the pollution rules say about the improvements above (civ-clone/web-renderer#1196), and what causes Pollution
 *  (civ-clone/web-renderer#621): a city's shields, and its citizens, more with each polluting advance. For each rule
 *  that rolls for pollution with `pollution` to give, so a rule that takes the place of Civ1's says it too.
 */
const pollutionDescriptions = () => [
    ...exports.cleanedBy.map((Improvement) => ({
        type: 'pollution_source_removed',
        subject: Improvement,
        source: 'population',
    })),
    {
        type: 'caused_by',
        subject: TileImprovements_1.Pollution,
        source: 'production',
    },
    {
        type: 'caused_by',
        subject: TileImprovements_1.Pollution,
        source: 'population',
        with: exports.pollutingAdvances,
    },
];
exports.pollutionDescriptions = pollutionDescriptions;
/**
 * A city's pollution: what v474.05 calls its "smokestack points", worked out each turn (`CityWorker.cs` ~L3710,
 * civ-clone/web-renderer#32):
 * its shields (after the Factory and plant bonuses, before unit support) divided by its `PollutionDivisor`, plus its
 * size times the polluting advances its owner knows (none with Mass Transit) over 4, less 20. Only a value above 0
 * risks pollution. The arithmetic is `base-city-pollution`'s; the numbers, advances and improvement are Civ1's.
 */
const pollution = (city, cityYields = city.yields(), ruleRegistry = RuleRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, cityGrowthRegistry = CityGrowthRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => (0, pollution_1.pollution)(city, cityYields, {
    Production: Yields_1.Production,
    excluding: [Yields_1.UnitSupportProduction],
    populationFactor: (0, pollution_1.advancesKnown)(exports.pollutingAdvances, exports.cleanedBy, playerResearchRegistry, cityImprovementRegistry),
    populationDivisor: 4,
    tolerance: 20,
}, ruleRegistry, cityGrowthRegistry);
exports.pollution = pollution;
exports.default = exports.pollution;
//# sourceMappingURL=pollution.js.map