"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const build_1 = require("./Rules/City/build");
const build_cost_1 = require("./Rules/City/build-cost");
const created_1 = require("./Rules/City/created");
const grow_1 = require("./Rules/City/grow");
const improvement_created_1 = require("./Rules/City/improvement-created");
const created_2 = require("./Rules/Unit/created");
RuleRegistry_1.instance.register(...(0, build_1.default)(), ...(0, build_cost_1.default)(), ...(0, created_1.default)(), ...(0, grow_1.default)(), ...(0, improvement_created_1.default)(), ...(0, created_2.default)());
//# sourceMappingURL=registerRules.js.map