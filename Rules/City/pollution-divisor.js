"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const CityImprovements_1 = require("../../CityImprovements");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const PollutionDivisor_1 = require("../PollutionDivisor");
// A Hydro or Nuclear Plant halves the shields that count towards pollution, and a Recycling Center thirds them in
//  place of that (v474.05 `CityWorker.cs` ~L714-761).
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    [CityImprovements_1.HydroPlant, 2],
    [CityImprovements_1.NuclearPlant, 2],
    [CityImprovements_1.RecyclingCenter, 3],
].map(([Improvement, divisor]) => new PollutionDivisor_1.default(`civ1-city-improvement:city/pollution-divisor/${Improvement.name}`, new Criterion_1.default((city) => cityImprovementRegistry
    .getByCity(city)
    .some((cityImprovement) => cityImprovement instanceof Improvement)), new Effect_1.default(() => divisor)));
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pollution-divisor.js.map