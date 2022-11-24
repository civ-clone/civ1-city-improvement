"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const Created_1 = require("@civ-clone/core-city-improvement/Rules/Created");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, engine = Engine_1.instance) => [
    new Created_1.default(new Effect_1.default((cityImprovement) => cityImprovementRegistry.register(cityImprovement))),
    new Created_1.default(new Effect_1.default((cityImprovement, city) => {
        engine.emit('city-improvement:created', cityImprovement, city);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=created.js.map