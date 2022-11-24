"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Captured_1 = require("@civ-clone/core-city/Rules/Captured");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const CityImprovements_1 = require("../../CityImprovements");
const Wonder_1 = require("@civ-clone/core-wonder/Wonder");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, randomNumberGenerator = () => Math.random()) => [
    new Captured_1.default(new Effect_1.default((capturedCity) => {
        const cityImprovements = cityImprovementRegistry
            .getByCity(capturedCity)
            .filter((cityImprovement) => !(cityImprovement instanceof Wonder_1.default)), [palace] = cityImprovements.filter((cityImprovement) => cityImprovement instanceof CityImprovements_1.Palace);
        if (palace) {
            palace.destroy();
            cityImprovements.splice(cityImprovements.indexOf(palace), 1);
        }
        while (cityImprovements.length > 0 && randomNumberGenerator() > 0.7) {
            const randomImprovement = cityImprovements[Math.floor(randomNumberGenerator() * cityImprovements.length)];
            if (!randomImprovement) {
                break;
            }
            randomImprovement.destroy();
            cityImprovements.splice(cityImprovements.indexOf(randomImprovement), 1);
        }
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=captured.js.map