"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.deriveBuildRules = exports.buildRulesFor = exports.hydroPlantSiteRule = exports.notBuiltRule = void 0;
const Build_1 = require("@civ-clone/core-city-build/Rules/Build");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Requirement_1 = require("@civ-clone/core-requirement/Requirement");
const Terrains_1 = require("@civ-clone/civ1-world/Terrains");
const CityImprovement_1 = require("@civ-clone/core-city-improvement/CityImprovement");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const CityImprovements_1 = require("../../CityImprovements");
const Requirements_1 = require("../../Requirements");
/** An improvement is built once in each city: a state of the city, so a rule written by hand. */
const notBuiltRule = (cityImprovementRegistry = CityImprovementRegistry_1.instance) => new Build_1.Build('civ1-city-improvement:city/build/not-built', CityImprovement_1.default, new Effect_1.default((city, BuildItem) => new Criterion_1.default(() => !cityImprovementRegistry
    .getByCity(city)
    .some((improvement) => improvement instanceof BuildItem))));
exports.notBuiltRule = notBuiltRule;
/**
 * A Hydro Plant is only built with Mountains or a River next to the city: a state of the map, so a rule written by
 * hand.
 */
const hydroPlantSiteRule = () => 
// As v474.05, which checks the eight squares around the city, but not the city's own square (OpenCivOne's
//  decompile, `Overlay_20.cs` `F20_0000_0000`). The book's "on or near" is looser.
new Build_1.Build('civ1-city-improvement:city/build/hydro-plant-site', CityImprovements_1.HydroPlant, new Criterion_1.default((city, BuildItem) => BuildItem === CityImprovements_1.HydroPlant), new Effect_1.default((city) => new Criterion_1.default(() => city
    .tile()
    .getNeighbours()
    .some((tile) => tile.terrain() instanceof Terrains_1.Mountains ||
    tile.terrain() instanceof Terrains_1.River))));
exports.hydroPlantSiteRule = hydroPlantSiteRule;
const isImprovement = (target) => Object.prototype.isPrototypeOf.call(CityImprovement_1.default, target);
/**
 * The rule `entry` is played by: a city may build its subject only while its targets are met (`requires`), or only
 * while they are not (`excludedBy`). A target that is an improvement is met by the city having one; any other is an
 * advance, met by the city's player having discovered it.
 */
const buildRulesFor = (entry, cityImprovementRegistry = CityImprovementRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => {
    if (entry.relation !== 'requires' && entry.relation !== 'excludedBy') {
        return [];
    }
    const excluded = entry.relation === 'excludedBy', 
    // Worked out once here rather than each time the rule runs, as `available()` runs it for every item every turn.
    improvementTargets = new Set(entry.targets.filter(isImprovement));
    return [
        new Build_1.Build(entry.id, entry.subject, new Criterion_1.default((city, BuildItem) => BuildItem === entry.subject), new Effect_1.default((city) => new Criterion_1.default(() => {
            let improvements = null;
            const targetsMet = (0, Requirement_1.met)(entry, (target) => {
                if (!improvementTargets.has(target)) {
                    return playerResearchRegistry
                        .getByPlayer(city.player())
                        .completed(target);
                }
                if (improvements === null) {
                    improvements = cityImprovementRegistry.getByCity(city);
                }
                return improvements.some((improvement) => improvement instanceof target);
            });
            return excluded ? !targetsMet : targetsMet;
        }))),
    ];
};
exports.buildRulesFor = buildRulesFor;
/** What `registerRules` gives the game's `requirements` to make each entry's rules with. */
const deriveBuildRules = (cityImprovementRegistry, playerResearchRegistry) => (entry) => (0, exports.buildRulesFor)(entry, cityImprovementRegistry, playerResearchRegistry);
exports.deriveBuildRules = deriveBuildRules;
/**
 * Every rule about which improvements a city may build, as `registerRules` registers them: the not-built rule, one for
 * each of `Requirements`' entries, then the Hydro Plant's site rule. For a rule registry without a game's
 * `requirements` (tests, and rulesets that build on these): a game's are registered through `game.requirements`, so a
 * plugin can change an entry and its rule together.
 */
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance) => [
    (0, exports.notBuiltRule)(cityImprovementRegistry),
    ...Requirements_1.default.flatMap((entry) => (0, exports.buildRulesFor)(entry, cityImprovementRegistry, playerResearchRegistry)),
    (0, exports.hydroPlantSiteRule)(),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build.js.map