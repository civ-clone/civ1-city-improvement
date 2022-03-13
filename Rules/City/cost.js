"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovements_1 = require("../../CityImprovements");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Cost_1 = require("@civ-clone/core-city/Rules/Cost");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => [
    ...[
        [CityImprovements_1.Aqueduct, Yields_1.Gold, 2],
        [CityImprovements_1.Bank, Yields_1.Gold, 3],
        [CityImprovements_1.Cathedral, Yields_1.Gold, 3],
        [CityImprovements_1.CityWalls, Yields_1.Gold, 2],
        [CityImprovements_1.Colosseum, Yields_1.Gold, 2],
        [CityImprovements_1.Courthouse, Yields_1.Gold, 1],
        [CityImprovements_1.Factory, Yields_1.Gold, 4],
        [CityImprovements_1.Granary, Yields_1.Gold, 1],
        [CityImprovements_1.HydroPlant, Yields_1.Gold, 4],
        [CityImprovements_1.Library, Yields_1.Gold, 1],
        [CityImprovements_1.ManufacturingPlant, Yields_1.Gold, 6],
        [CityImprovements_1.Marketplace, Yields_1.Gold, 1],
        [CityImprovements_1.MassTransit, Yields_1.Gold, 4],
        [CityImprovements_1.NuclearPlant, Yields_1.Gold, 2],
        [CityImprovements_1.PowerPlant, Yields_1.Gold, 4],
        [CityImprovements_1.RecyclingCenter, Yields_1.Gold, 2],
        [CityImprovements_1.SdiDefence, Yields_1.Gold, 4],
        [CityImprovements_1.Temple, Yields_1.Gold, 1],
        [CityImprovements_1.University, Yields_1.Gold, 3],
    ].map(([CityImprovementType, YieldType, cost]) => new Cost_1.default(new Criterion_1.default((cityYield, city) => cityYield instanceof YieldType), new Criterion_1.default((cityYield, city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovementType)), new Effect_1.default((cityYield) => cityYield.subtract(cost)))),
    ...[[CityImprovements_1.Barracks, Yields_1.Gold, 1, Advances_1.Gunpowder, Advances_1.Automobile]].map(([CityImprovementType, YieldType, cost, RequiredAdvance, ObseletionAdvance,]) => new Cost_1.default(new Criterion_1.default((cityYield, city) => cityYield instanceof YieldType), new Criterion_1.default((cityYield, city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovementType)), new Criterion_1.default((cityYield, city) => playerResearchRegistry
        .getByPlayer(city.player())
        .completed(RequiredAdvance)), new Criterion_1.default((cityYield, city) => !playerResearchRegistry
        .getByPlayer(city.player())
        .completed(ObseletionAdvance)), new Effect_1.default((cityYield) => cityYield.subtract(cost)))),
    ...[[CityImprovements_1.Barracks, Yields_1.Gold, 2, Advances_1.Automobile]].map(([CityImprovementType, YieldType, cost, RequiredAdvance]) => new Cost_1.default(new Criterion_1.default((cityYield, city) => cityYield instanceof YieldType), new Criterion_1.default((cityYield, city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovementType)), new Criterion_1.default((cityYield, city) => playerResearchRegistry
        .getByPlayer(city.player())
        .completed(RequiredAdvance)), new Effect_1.default((cityYield) => cityYield.subtract(cost)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=cost.js.map