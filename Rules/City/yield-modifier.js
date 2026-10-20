"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovements_1 = require("../../CityImprovements");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Yields_1 = require("../../Yields");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Low_1 = require("@civ-clone/core-rule/Priorities/Low");
const YieldModifier_1 = require("@civ-clone/core-city/Rules/YieldModifier");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
// As v474.05 (OpenCivOne's decompile, `CityWorker.cs`): a Factory adds 2/4 of the city's base shields and a Mfg. Plant
//  4/4, in place of the Factory's. A plant adds another 2/4, but no more than the Factory or Mfg. Plant does, so it
//  does nothing on its own, and one plant is all that counts.
const factories = [
    [CityImprovements_1.ManufacturingPlant, 4],
    [CityImprovements_1.Factory, 2],
], plants = [CityImprovements_1.PowerPlant, CityImprovements_1.HydroPlant, CityImprovements_1.NuclearPlant];
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => {
    const has = (city, Improvement) => cityImprovementRegistry
        .getByCity(city)
        .some((improvement) => improvement instanceof Improvement), factory = (city) => factories.find(([Improvement]) => has(city, Improvement));
    return [
        // As v474.05, each of these adds half of the running total, so a Bank adds half of what the Marketplace left.
        ...[
            [CityImprovements_1.Marketplace, Yields_1.Gold, 0.5],
            [CityImprovements_1.Marketplace, Yields_1.Luxuries, 0.5],
            [CityImprovements_1.Bank, Yields_1.Gold, 0.5],
            [CityImprovements_1.Bank, Yields_1.Luxuries, 0.5],
            [CityImprovements_1.Courthouse, Yields_1.Corruption, 0.5],
        ].map(([Improvement, YieldType, multiplier]) => new YieldModifier_1.default(new Low_1.default(), new Criterion_1.default((city) => has(city, Improvement)), new Effect_1.default((city, yields) => new YieldType(Math.floor((0, reduceYields_1.reduceYield)(yields, YieldType) * multiplier), Improvement.name)))),
        // As v474.05, a Library and a University each add half of the city's base science, not of what the other added.
        ...[CityImprovements_1.Library, CityImprovements_1.University].map((Improvement) => new YieldModifier_1.default(new Low_1.default(), new Criterion_1.default((city) => has(city, Improvement)), new Effect_1.default((city, yields, base) => new Yields_1.Research(Math.floor((0, reduceYields_1.reduceYield)(base, Yields_1.Research) / 2), Improvement.name)))),
        new YieldModifier_1.default(new Low_1.default(), new Criterion_1.default((city) => factory(city) !== undefined), new Effect_1.default((city, yields, base) => {
            const [Improvement, quarters] = factory(city);
            return new Yields_1.Production(Math.floor(((0, reduceYields_1.reduceYield)(base, Yields_1.Production) * quarters) / 4), Improvement.name);
        })),
        new YieldModifier_1.default(new Low_1.default(), new Criterion_1.default((city) => factory(city) !== undefined), new Criterion_1.default((city) => plants.some((Plant) => has(city, Plant))), new Effect_1.default((city, yields, base) => new Yields_1.Production(Math.floor(((0, reduceYields_1.reduceYield)(base, Yields_1.Production) * 2) / 4), plants.find((Plant) => has(city, Plant)).name))),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield-modifier.js.map