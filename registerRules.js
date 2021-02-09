"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const build_1 = require("./Rules/City/build");
const build_cost_1 = require("./Rules/City/build-cost");
const cost_1 = require("./Rules/City/cost");
const created_1 = require("./Rules/City/created");
const grow_1 = require("./Rules/City/grow");
const improvement_created_1 = require("./Rules/City/improvement-created");
const created_2 = require("./Rules/Unit/created");
RuleRegistry_1.instance.register(...build_1.default(), ...build_cost_1.default(), ...cost_1.default(), ...created_1.default(), ...grow_1.default(), ...improvement_created_1.default(), ...created_2.default());
//# sourceMappingURL=registerRules.js.map