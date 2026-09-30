"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Created_1 = require("@civ-clone/core-city-improvement/Rules/Created");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const CityImprovements_1 = require("../../CityImprovements");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, engine = Engine_1.instance) => [
    new Created_1.default(new Effect_1.default((cityImprovement) => cityImprovementRegistry.register(cityImprovement))),
    // Building a Palace moves the capital: the player's old Palace is removed.
    new Created_1.default(new Criterion_1.default((cityImprovement) => cityImprovement instanceof CityImprovements_1.Palace), new Effect_1.default((palace, city) => cityImprovementRegistry
        .filter((cityImprovement) => cityImprovement instanceof CityImprovements_1.Palace &&
        cityImprovement !== palace &&
        !cityImprovement.destroyed() &&
        cityImprovement.city().player() === city.player())
        .forEach((oldPalace) => oldPalace.destroy()))),
    new Created_1.default(new Effect_1.default((cityImprovement, city) => {
        engine.emit('city-improvement:created', cityImprovement, city);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=created.js.map