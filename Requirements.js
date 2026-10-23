"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describedRequirements = exports.buildRequirements = exports.hydroPlantSite = exports.mountainsOrRiverNearby = exports.notBuilt = exports.notInCity = exports.excludedBy = exports.requiresImprovement = exports.requiresAdvance = void 0;
const CityImprovements_1 = require("./CityImprovements");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Requirement_1 = require("@civ-clone/core-requirement/Requirement");
const CityImprovement_1 = require("@civ-clone/core-city-improvement/CityImprovement");
// What Civilization's city improvements need, and what stops a city building them, as the entries `Rules/City/build`
//  makes its rules from (civ-clone/web-renderer#37). `registerRules` adds them to the game's `requirements`.
/** The advance a city's player needs before it can build each improvement: one rule each. */
exports.requiresAdvance = (0, Requirement_1.table)('civ1-city-improvement:city/build/requires-advance', 'requires', [
    [CityImprovements_1.Aqueduct, Advances_1.Construction],
    [CityImprovements_1.CityWalls, Advances_1.Masonry],
    [CityImprovements_1.Colosseum, Advances_1.Construction],
    [CityImprovements_1.Courthouse, Advances_1.CodeOfLaws],
    [CityImprovements_1.Granary, Advances_1.Pottery],
    [CityImprovements_1.Library, Advances_1.Writing],
    [CityImprovements_1.Marketplace, Advances_1.Currency],
    [CityImprovements_1.Palace, Advances_1.Masonry],
    [CityImprovements_1.Temple, Advances_1.CeremonialBurial],
    [CityImprovements_1.Bank, Advances_1.Banking],
    [CityImprovements_1.Cathedral, Advances_1.Religion],
    [CityImprovements_1.Factory, Advances_1.Industrialization],
    [CityImprovements_1.HydroPlant, Advances_1.Electronics],
    [CityImprovements_1.MassTransit, Advances_1.MassProduction],
    [CityImprovements_1.ManufacturingPlant, Advances_1.Robotics],
    [CityImprovements_1.NuclearPlant, Advances_1.NuclearPower],
    [CityImprovements_1.PowerPlant, Advances_1.Refining],
    [CityImprovements_1.RecyclingCenter, Advances_1.Recycling],
    [CityImprovements_1.SdiDefence, Advances_1.Superconductor],
    [CityImprovements_1.University, Advances_1.University],
]);
/** The improvements a city needs, any one of, before it can build each improvement: one rule each. */
exports.requiresImprovement = (0, Requirement_1.table)('civ1-city-improvement:city/build/requires-improvement', 'requires', [
    [CityImprovements_1.Bank, CityImprovements_1.Marketplace],
    [CityImprovements_1.University, CityImprovements_1.Library],
    // As v474.05's production menu, which asks for a Factory before a Power Plant, but not before a Hydro or Nuclear
    //  Plant, and nothing before a Mfg. Plant (OpenCivOne's decompile, `Segment_1ade.cs` `F0_1ade_0421`).
    [CityImprovements_1.PowerPlant, CityImprovements_1.Factory],
], { mode: 'any', range: 'city' });
/** The improvements, any one of, that stop a city building each improvement: one rule each. */
exports.excludedBy = (0, Requirement_1.table)('civ1-city-improvement:city/build/excluded-by', 'excludedBy', [
    [CityImprovements_1.Courthouse, CityImprovements_1.Palace],
    [CityImprovements_1.Factory, CityImprovements_1.ManufacturingPlant],
    [CityImprovements_1.HydroPlant, CityImprovements_1.NuclearPlant, CityImprovements_1.PowerPlant],
    [CityImprovements_1.NuclearPlant, CityImprovements_1.PowerPlant, CityImprovements_1.HydroPlant],
    [CityImprovements_1.PowerPlant, CityImprovements_1.HydroPlant, CityImprovements_1.NuclearPlant],
], { mode: 'any', range: 'city' });
/** A city without one of the improvement already, which `Rules/City/build`'s own rule decides. */
exports.notInCity = new Requirement_1.Condition('civ1-city-improvement:not-in-city');
/** An improvement is built once in each city. The rule is written by hand; this entry names it for the civilopedia. */
exports.notBuilt = new Requirement_1.Requirement({
    id: 'civ1-city-improvement:city/build/not-built',
    subject: CityImprovement_1.default,
    relation: 'requires',
    targets: [exports.notInCity],
    range: 'city',
});
/** Mountains or a River next to the city, which `Rules/City/build`'s own rule decides. */
exports.mountainsOrRiverNearby = new Requirement_1.Condition('civ1-city-improvement:mountains-or-river-nearby');
/**
 * A Hydro Plant is only built with Mountains or a River next to the city. The rule is written by hand; this entry
 * names it for the civilopedia.
 */
exports.hydroPlantSite = new Requirement_1.Requirement({
    id: 'civ1-city-improvement:city/build/hydro-plant-site',
    subject: CityImprovements_1.HydroPlant,
    relation: 'requires',
    targets: [exports.mountainsOrRiverNearby],
    range: 'city',
});
/** The entries `Rules/City/build`'s deriver makes rules from, in the order the rules were always registered. */
exports.buildRequirements = [
    ...exports.requiresAdvance,
    ...exports.requiresImprovement,
    ...exports.excludedBy,
];
/** The entries that only describe: no rule is made from them. */
exports.describedRequirements = [exports.notBuilt, exports.hydroPlantSite];
exports.default = exports.buildRequirements;
//# sourceMappingURL=Requirements.js.map