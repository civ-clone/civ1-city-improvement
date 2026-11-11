"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const GameDifficultyRegistry_1 = require("@civ-clone/core-difficulty/GameDifficultyRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const TileImprovementRegistry_1 = require("@civ-clone/core-tile-improvement/TileImprovementRegistry");
const ClientRegistry_1 = require("@civ-clone/core-client/ClientRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const RuleIds_1 = require("../../RuleIds");
const ProcessYield_1 = require("@civ-clone/core-city/Rules/ProcessYield");
const Yields_1 = require("../../Yields");
const core_random_1 = require("@civ-clone/core-random");
const isHuman_1 = require("@civ-clone/civ1-difficulty/isHuman");
const pollute_1 = require("../../lib/pollute");
// Each turn a city of the human's with pollution (`lib/pollution`) may pollute one of the 20 squares around it
//  (`lib/pollute`, civ-clone/web-renderer#32). As v474.05, only the human's cities roll (civd `CITYMGT.C`
//  `city_process()`, civ-clone/web-renderer#954):
//
//      if (selected_owner == civnow) {
//          pollution_k = town_res_sums[1] / plant_waste_divisor - 20;
//
//  `civ1-enhanced` rolls for every city, taking this rule's place while its set is on.
const getRules = (cityRegistry = CityRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, cityGrowthRegistry = CityGrowthRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, tileImprovementRegistry = TileImprovementRegistry_1.instance, gameDifficultyRegistry = GameDifficultyRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, engine = Engine_1.instance, randomNumberGenerator = core_random_1.instance, clientRegistry = ClientRegistry_1.instance) => [
    new ProcessYield_1.default(RuleIds_1.POLLUTION_RULE, 
    // Once a turn: the consolidated shields are processed once per city.
    new Criterion_1.default((cityYield) => cityYield instanceof Yields_1.Production), new Criterion_1.default((cityYield, city) => (0, isHuman_1.default)(city.player(), clientRegistry)), new Effect_1.default((cityYield, city, cityYields) => (0, pollute_1.default)(city, cityYields, {
        cityRegistry,
        cityImprovementRegistry,
        cityGrowthRegistry,
        playerResearchRegistry,
        tileImprovementRegistry,
        gameDifficultyRegistry,
        ruleRegistry,
        engine,
        randomNumberGenerator,
    }))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=pollution.js.map