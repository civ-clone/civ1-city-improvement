"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovements_1 = require("../../CityImprovements");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Build_1 = require("@civ-clone/core-city-build/Rules/Build");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => [
    new Build_1.Build(new Effect_1.default((city, BuildItem) => new Criterion_1.default(() => !cityImprovementRegistry
        .getByCity(city)
        .some((improvement) => improvement instanceof BuildItem)))),
    ...[
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
    ].map(([CityImprovementType, RequiredAdvance]) => new Build_1.Build(new Criterion_1.default((city, BuildItem) => BuildItem === CityImprovementType), new Effect_1.default((city) => new Criterion_1.default(() => playerResearchRegistry
        .getByPlayer(city.player())
        .completed(RequiredAdvance))))),
    ...[
        [CityImprovements_1.Bank, CityImprovements_1.Marketplace],
        [CityImprovements_1.University, CityImprovements_1.Library],
        [CityImprovements_1.HydroPlant, CityImprovements_1.Factory],
        [CityImprovements_1.NuclearPlant, CityImprovements_1.Factory],
        [CityImprovements_1.PowerPlant, CityImprovements_1.Factory],
        [CityImprovements_1.ManufacturingPlant, CityImprovements_1.HydroPlant, CityImprovements_1.NuclearPlant, CityImprovements_1.PowerPlant],
    ].map(([Improvement, ...Requires]) => new Build_1.Build(new Criterion_1.default((city, BuildItem) => BuildItem === Improvement), new Effect_1.default((city) => new Criterion_1.default(() => cityImprovementRegistry
        .getByCity(city)
        .some((improvement) => Requires.some((Required) => improvement instanceof Required)))))),
    ...[
        [CityImprovements_1.Courthouse, CityImprovements_1.Palace],
        [CityImprovements_1.HydroPlant, CityImprovements_1.NuclearPlant, CityImprovements_1.PowerPlant],
        [CityImprovements_1.NuclearPlant, CityImprovements_1.PowerPlant, CityImprovements_1.HydroPlant],
        [CityImprovements_1.PowerPlant, CityImprovements_1.HydroPlant, CityImprovements_1.NuclearPlant],
    ].map(([Improvement, ...Prevents]) => new Build_1.Build(new Criterion_1.default((city, BuildItem) => BuildItem === Improvement), new Effect_1.default((city) => new Criterion_1.default(() => cityImprovementRegistry
        .getByCity(city)
        .every((improvement) => !Prevents.some((Prevent) => improvement instanceof Prevent)))))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build.js.map