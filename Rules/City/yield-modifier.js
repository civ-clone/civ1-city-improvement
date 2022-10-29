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
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    ...[
        [CityImprovements_1.Marketplace, Yields_1.Gold, 0.5],
        [CityImprovements_1.Marketplace, Yields_1.Luxuries, 0.5],
        [CityImprovements_1.Bank, Yields_1.Gold, 0.5],
        [CityImprovements_1.Bank, Yields_1.Luxuries, 0.5],
        [CityImprovements_1.Library, Yields_1.Research, 0.5],
        [CityImprovements_1.University, Yields_1.Research, 0.5],
        [CityImprovements_1.Factory, Yields_1.Production, 0.5],
        [CityImprovements_1.PowerPlant, Yields_1.Production, 0.5],
        [CityImprovements_1.HydroPlant, Yields_1.Production, 0.5],
        [CityImprovements_1.NuclearPlant, Yields_1.Production, 0.5],
        [CityImprovements_1.ManufacturingPlant, Yields_1.Production, 0.5],
        [CityImprovements_1.Courthouse, Yields_1.Corruption, 0.5],
        // [RecyclingCenter, Pollution, -0.5],
        // [HydroPlant, Pollution, -0.5],
        // [MassTransit, Pollution, -0.5],
    ].map(([Improvement, YieldType, multiplier]) => new YieldModifier_1.default(new Low_1.default(), new Criterion_1.default((city) => cityImprovementRegistry
        .getByCity(city)
        .some((improvement) => improvement instanceof Improvement)), new Effect_1.default((city, yields) => new YieldType(Math.floor((0, reduceYields_1.reduceYield)(yields, YieldType) * multiplier), Improvement.name)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield-modifier.js.map