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
    ].flatMap(([CityImprovementType, cost]) => BuildCost_1.buildCost(CityImprovementType, cost)),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build-cost.js.map