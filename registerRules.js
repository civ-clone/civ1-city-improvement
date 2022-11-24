"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const build_1 = require("./Rules/City/build");
const build_cost_1 = require("./Rules/City/build-cost");
const captured_1 = require("./Rules/City/captured");
const cost_1 = require("./Rules/City/cost");
const created_1 = require("./Rules/City/created");
const destroyed_1 = require("./Rules/City/destroyed");
const grow_1 = require("./Rules/City/grow");
const created_2 = require("./Rules/CityImprovement/created");
const yield_modifier_1 = require("./Rules/City/yield-modifier");
const created_3 = require("./Rules/Unit/created");
RuleRegistry_1.instance.register(...(0, build_1.default)(), ...(0, build_cost_1.default)(), ...(0, captured_1.default)(), ...(0, cost_1.default)(), ...(0, created_1.default)(), ...(0, destroyed_1.default)(), ...(0, grow_1.default)(), ...(0, created_2.default)(), ...(0, yield_modifier_1.default)(), ...(0, created_3.default)());
//# sourceMappingURL=registerRules.js.map