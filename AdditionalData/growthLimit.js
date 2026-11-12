"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdditionalData = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const AdditionalData_1 = require("@civ-clone/core-data-object/AdditionalData");
const CityGrowth_1 = require("@civ-clone/core-city-growth/CityGrowth");
const growthLimit_1 = require("@civ-clone/base-city-growth-limit/lib/growthLimit");
const growthLimit_2 = require("../lib/growthLimit");
/**
 * What the city needs before it can grow past its size (`lib/growthLimit`), so a renderer can say so rather than count
 * the turns to a growth that won't happen (civ-clone/web-renderer#781). `needs` is the improvement's type name. `null`
 * when nothing holds the city back.
 */
const getAdditionalData = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    new AdditionalData_1.default(CityGrowth_1.default, 'limit', (cityGrowth) => (0, growthLimit_1.growthLimitData)(cityGrowth, growthLimit_2.growthLimits, cityImprovementRegistry)),
];
exports.getAdditionalData = getAdditionalData;
exports.default = exports.getAdditionalData;
//# sourceMappingURL=growthLimit.js.map