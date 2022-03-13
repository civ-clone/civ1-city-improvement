"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovements_1 = require("../../CityImprovements");
const BuildCost_1 = require("@civ-clone/core-city-build/Rules/BuildCost");
const getRules = () => [
    ...[
        [CityImprovements_1.Aqueduct, 120],
        [CityImprovements_1.Barracks, 40],
        [CityImprovements_1.CityWalls, 120],
        [CityImprovements_1.Colosseum, 100],
        [CityImprovements_1.Courthouse, 80],
        [CityImprovements_1.Granary, 60],
        [CityImprovements_1.Library, 80],
        [CityImprovements_1.Marketplace, 80],
        [CityImprovements_1.Palace, 200],
        [CityImprovements_1.Temple, 40],
        [CityImprovements_1.Bank, 120],
        [CityImprovements_1.Cathedral, 160],
        [CityImprovements_1.Factory, 200],
        [CityImprovements_1.HydroPlant, 240],
        [CityImprovements_1.MassTransit, 160],
        [CityImprovements_1.ManufacturingPlant, 320],
        [CityImprovements_1.NuclearPlant, 160],
        [CityImprovements_1.PowerPlant, 160],
        [CityImprovements_1.RecyclingCenter, 200],
        [CityImprovements_1.SdiDefence, 200],
        [CityImprovements_1.University, 160],
    ].flatMap(([CityImprovementType, cost]) => (0, BuildCost_1.buildCost)(CityImprovementType, cost)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build-cost.js.map