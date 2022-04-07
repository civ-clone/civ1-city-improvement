"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Captured_1 = require("@civ-clone/core-city/Rules/Captured");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const CityImprovements_1 = require("../../CityImprovements");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    new Captured_1.default(new Effect_1.default((capturedCity) => {
        const [palace] = cityImprovementRegistry
            .getByCity(capturedCity)
            .filter((cityImprovement) => cityImprovement instanceof CityImprovements_1.Palace);
        if (!palace) {
            return;
        }
        cityImprovementRegistry.unregister(palace);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=captured.js.map