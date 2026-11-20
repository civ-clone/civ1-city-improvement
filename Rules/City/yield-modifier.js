"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.scienceModifiers = exports.runningTotalModifiers = exports.plantQuarters = exports.plants = exports.factories = void 0;
const CityImprovements_1 = require("../../CityImprovements");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Yields_1 = require("../../Yields");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Description_1 = require("@civ-clone/core-rule/Description");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Low_1 = require("@civ-clone/core-rule/Priorities/Low");
const YieldModifier_1 = require("@civ-clone/core-city/Rules/YieldModifier");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
// As v474.05 (OpenCivOne's decompile, `CityWorker.cs`): a Factory adds 2/4 of the city's base shields and a Mfg. Plant
//  4/4, in place of the Factory's. A plant adds another 2/4, but no more than the Factory or Mfg. Plant does, so it
//  does nothing on its own, and one plant is all that counts. Each rule below, and what it says it does (its
//  `Description`, for the Civilopedia, civ-clone/web-renderer#1196), reads these tables, so the two can't disagree.
exports.factories = [
    [CityImprovements_1.ManufacturingPlant, 4],
    [CityImprovements_1.Factory, 2],
], exports.plants = [CityImprovements_1.PowerPlant, CityImprovements_1.HydroPlant, CityImprovements_1.NuclearPlant], exports.plantQuarters = 2;
// As v474.05, each of these adds half of the running total, so a Bank adds half of what the Marketplace left. The
//  Courthouse's half is of the corruption, which is counted as trade lost, so it halves it.
exports.runningTotalModifiers = [
    [CityImprovements_1.Marketplace, Yields_1.Gold, 0.5],
    [CityImprovements_1.Marketplace, Yields_1.Luxuries, 0.5],
    [CityImprovements_1.Bank, Yields_1.Gold, 0.5],
    [CityImprovements_1.Bank, Yields_1.Luxuries, 0.5],
    [CityImprovements_1.Courthouse, Yields_1.Corruption, 0.5],
];
// As v474.05, a Library and a University each add half of the city's base science, not of what the other added.
exports.scienceModifiers = [
    [CityImprovements_1.Library, 0.5],
    [CityImprovements_1.University, 0.5],
];
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => {
    const has = (city, Improvement) => cityImprovementRegistry
        .getByCity(city)
        .some((improvement) => improvement instanceof Improvement), factory = (city) => exports.factories.find(([Improvement]) => has(city, Improvement));
    return [
        ...exports.runningTotalModifiers.map(([Improvement, YieldType, multiplier]) => new YieldModifier_1.default(new Low_1.default(), new Criterion_1.default((city) => has(city, Improvement)), new Effect_1.default((city, yields) => new YieldType(Math.floor((0, reduceYields_1.reduceYield)(yields, YieldType) * multiplier), Improvement.name)), new Description_1.default({
            type: 'yield_percent',
            subject: Improvement,
            yield: YieldType,
            value: YieldType === Yields_1.Corruption ? -multiplier : multiplier,
            of: 'total',
        }))),
        ...exports.scienceModifiers.map(([Improvement, multiplier]) => new YieldModifier_1.default(new Low_1.default(), new Criterion_1.default((city) => has(city, Improvement)), new Effect_1.default((city, yields, base) => new Yields_1.Research(Math.floor((0, reduceYields_1.reduceYield)(base, Yields_1.Research) * multiplier), Improvement.name)), new Description_1.default({
            type: 'yield_percent',
            subject: Improvement,
            yield: Yields_1.Research,
            value: multiplier,
            of: 'base',
        }))),
        new YieldModifier_1.default(new Low_1.default(), new Criterion_1.default((city) => factory(city) !== undefined), new Effect_1.default((city, yields, base) => {
            const [Improvement, quarters] = factory(city);
            return new Yields_1.Production(Math.floor(((0, reduceYields_1.reduceYield)(base, Yields_1.Production) * quarters) / 4), Improvement.name);
        }), new Description_1.default(...exports.factories.map(([Improvement, quarters], index) => ({
            type: 'yield_percent',
            subject: Improvement,
            yield: Yields_1.Production,
            value: quarters / 4,
            of: 'base',
            replaces: exports.factories.slice(index + 1).map(([Replaced]) => Replaced),
        })))),
        new YieldModifier_1.default(new Low_1.default(), new Criterion_1.default((city) => factory(city) !== undefined), new Criterion_1.default((city) => exports.plants.some((Plant) => has(city, Plant))), new Effect_1.default((city, yields, base) => new Yields_1.Production(Math.floor(((0, reduceYields_1.reduceYield)(base, Yields_1.Production) * exports.plantQuarters) / 4), exports.plants.find((Plant) => has(city, Plant)).name)), new Description_1.default(...exports.plants.map((Plant) => ({
            type: 'yield_percent',
            subject: Plant,
            yield: Yields_1.Production,
            value: exports.plantQuarters / 4,
            of: 'base',
            needs: exports.factories.map(([Improvement]) => Improvement),
            notWith: exports.plants.filter((Other) => Other !== Plant),
        })))),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield-modifier.js.map