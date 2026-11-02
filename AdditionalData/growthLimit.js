"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdditionalData = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const AdditionalData_1 = require("@civ-clone/core-data-object/AdditionalData");
const CityGrowth_1 = require("@civ-clone/core-city-growth/CityGrowth");
const growthLimit_1 = require("../lib/growthLimit");
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
/**
 * What the city needs before it can grow past its size (`lib/growthLimit`), so a renderer can say so rather than count
 * the turns to a growth that won't happen (civ-clone/web-renderer#781). `needs` is the improvement's type name. `null`
 * when nothing holds the city back.
 */
const getAdditionalData = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => [
    new AdditionalData_1.default(CityGrowth_1.default, 'limit', (cityGrowth) => {
        const needs = (0, growthLimit_1.default)(cityGrowth, cityImprovementRegistry);
        return needs === null
            ? null
            : { size: growthLimit_1.aqueductSizeLimit, needs: (0, DataObject_1.typeNameOf)(needs) };
    }),
];
exports.getAdditionalData = getAdditionalData;
exports.default = exports.getAdditionalData;
//# sourceMappingURL=growthLimit.js.map