"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.PollutionDivisor = void 0;
// What a city's shields are divided by before they count towards pollution (civ-clone/web-renderer#32), now
//  `base-city-pollution`'s. Re-exported, the same class, for the packages that register one from here (`civ1-wonder`).
var PollutionDivisor_1 = require("@civ-clone/base-city-pollution/Rules/PollutionDivisor");
Object.defineProperty(exports, "PollutionDivisor", { enumerable: true, get: function () { return PollutionDivisor_1.PollutionDivisor; } });
var PollutionDivisor_2 = require("@civ-clone/base-city-pollution/Rules/PollutionDivisor");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return PollutionDivisor_2.default; } });
//# sourceMappingURL=PollutionDivisor.js.map