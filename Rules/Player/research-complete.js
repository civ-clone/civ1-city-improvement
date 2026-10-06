"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Advances_1 = require("@civ-clone/civ1-science/Advances");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const CityImprovements_1 = require("../../CityImprovements");
const Complete_1 = require("@civ-clone/core-science/Rules/Complete");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, cityRegistry = CityRegistry_1.instance, engine = Engine_1.instance) => [
    // As v474.05: each discovery removes the discovering player's Barracks, without refunding them, and the player is
    //  told even when there were none to remove. They can be built again, at a higher upkeep (see `cost.ts`).
    [CityImprovements_1.Barracks, Advances_1.Gunpowder],
    [CityImprovements_1.Barracks, Advances_1.Combustion],
].map(([ImprovementType, ObsoletingAdvance]) => new Complete_1.default(new Criterion_1.default((playerResearch, advance) => advance instanceof ObsoletingAdvance), new Effect_1.default((playerResearch, advance) => {
    const player = playerResearch.player(), obsolete = cityRegistry
        .getByPlayer(player)
        .flatMap((city) => cityImprovementRegistry
        .getByCity(city)
        .filter((cityImprovement) => cityImprovement instanceof ImprovementType));
    obsolete.forEach((cityImprovement) => cityImprovement.destroy());
    engine.emit('city-improvement:obsolete', player, advance, ImprovementType, obsolete);
})));
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=research-complete.js.map