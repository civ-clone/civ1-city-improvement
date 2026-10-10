"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.upkeep = exports.barracksMaintenance = exports.maintenance = void 0;
const CityImprovements_1 = require("../../CityImprovements");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Yields_1 = require("../../Yields");
const Cost_1 = require("@civ-clone/core-city/Rules/Cost");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
// The gold each improvement costs its city every turn.
exports.maintenance = [
    [CityImprovements_1.Aqueduct, Yields_1.CityImprovementMaintenanceGold, 2],
    [CityImprovements_1.Bank, Yields_1.CityImprovementMaintenanceGold, 3],
    [CityImprovements_1.Cathedral, Yields_1.CityImprovementMaintenanceGold, 3],
    [CityImprovements_1.CityWalls, Yields_1.CityImprovementMaintenanceGold, 2],
    [CityImprovements_1.Colosseum, Yields_1.CityImprovementMaintenanceGold, 2],
    [CityImprovements_1.Courthouse, Yields_1.CityImprovementMaintenanceGold, 1],
    [CityImprovements_1.Factory, Yields_1.CityImprovementMaintenanceGold, 4],
    [CityImprovements_1.Granary, Yields_1.CityImprovementMaintenanceGold, 1],
    [CityImprovements_1.HydroPlant, Yields_1.CityImprovementMaintenanceGold, 4],
    [CityImprovements_1.Library, Yields_1.CityImprovementMaintenanceGold, 1],
    [CityImprovements_1.ManufacturingPlant, Yields_1.CityImprovementMaintenanceGold, 6],
    [CityImprovements_1.Marketplace, Yields_1.CityImprovementMaintenanceGold, 1],
    [CityImprovements_1.MassTransit, Yields_1.CityImprovementMaintenanceGold, 4],
    [CityImprovements_1.NuclearPlant, Yields_1.CityImprovementMaintenanceGold, 2],
    [CityImprovements_1.Palace, Yields_1.CityImprovementMaintenanceGold, 0],
    [CityImprovements_1.PowerPlant, Yields_1.CityImprovementMaintenanceGold, 4],
    [CityImprovements_1.RecyclingCenter, Yields_1.CityImprovementMaintenanceGold, 2],
    [CityImprovements_1.SdiDefence, Yields_1.CityImprovementMaintenanceGold, 4],
    [CityImprovements_1.Temple, Yields_1.CityImprovementMaintenanceGold, 1],
    [CityImprovements_1.University, Yields_1.CityImprovementMaintenanceGold, 3],
];
// Barracks cost more to keep as the advances that make them obsolete arrive: the cost, from and until which advance.
exports.barracksMaintenance = [
    [CityImprovements_1.Barracks, Yields_1.CityImprovementMaintenanceGold, 0, null, Advances_1.Gunpowder],
    [CityImprovements_1.Barracks, Yields_1.CityImprovementMaintenanceGold, 1, Advances_1.Gunpowder, Advances_1.Combustion],
    [CityImprovements_1.Barracks, Yields_1.CityImprovementMaintenanceGold, 2, Advances_1.Combustion, null],
];
// What `CityImprovementType` would cost `player` to keep each turn, as the rules below would charge it.
const upkeep = (CityImprovementType, player, playerResearchRegistry = PlayerResearchRegistry_1.instance) => {
    var _a, _b;
    const research = playerResearchRegistry.getByPlayer(player), [barracks] = exports.barracksMaintenance.filter(([Type, , , RequiredAdvance, ObsoletingAdvance]) => Type === CityImprovementType &&
        (RequiredAdvance === null || research.completed(RequiredAdvance)) &&
        (ObsoletingAdvance === null || !research.completed(ObsoletingAdvance))), [entry] = exports.maintenance.filter(([Type]) => Type === CityImprovementType);
    return (_b = (_a = barracks === null || barracks === void 0 ? void 0 : barracks[2]) !== null && _a !== void 0 ? _a : entry === null || entry === void 0 ? void 0 : entry[2]) !== null && _b !== void 0 ? _b : 0;
};
exports.upkeep = upkeep;
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => [
    ...exports.maintenance.map(([CityImprovementType, YieldType, cost]) => new Cost_1.default(new Criterion_1.default((city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovementType)), new Effect_1.default((city) => {
        const [cityImprovement] = cityImprovementRegistry
            .getByCity(city)
            .filter((cityImprovement) => cityImprovement instanceof CityImprovementType);
        return new YieldType(cost, cityImprovement);
    }))),
    ...exports.barracksMaintenance.map(([CityImprovementType, YieldType, cost, RequiredAdvance, ObsoletingAdvance,]) => new Cost_1.default(new Criterion_1.default((city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovementType)), new Criterion_1.default((city) => RequiredAdvance === null ||
        playerResearchRegistry
            .getByPlayer(city.player())
            .completed(RequiredAdvance)), new Criterion_1.default((city) => ObsoletingAdvance === null ||
        !playerResearchRegistry
            .getByPlayer(city.player())
            .completed(ObsoletingAdvance)), new Effect_1.default((city) => {
        const [cityImprovement] = cityImprovementRegistry
            .getByCity(city)
            .filter((cityImprovement) => cityImprovement instanceof CityImprovementType);
        return new YieldType(cost, cityImprovement);
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=cost.js.map