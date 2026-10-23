import { Build } from '@civ-clone/core-city-build/Rules/Build';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { Requirement } from '@civ-clone/core-requirement/Requirement';
import { Deriver } from '@civ-clone/core-requirement/RequirementRegistry';
/** An improvement is built once in each city: a state of the city, so a rule written by hand. */
export declare const notBuiltRule: (
  cityImprovementRegistry?: CityImprovementRegistry
) => Build;
/**
 * A Hydro Plant is only built with Mountains or a River next to the city: a state of the map, so a rule written by
 * hand.
 */
export declare const hydroPlantSiteRule: () => Build;
/**
 * The rule `entry` is played by: a city may build its subject only while its targets are met (`requires`), or only
 * while they are not (`excludedBy`). A target that is an improvement is met by the city having one; any other is an
 * advance, met by the city's player having discovered it.
 */
export declare const buildRulesFor: (
  entry: Requirement,
  cityImprovementRegistry?: CityImprovementRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => Build[];
/** What `registerRules` gives the game's `requirements` to make each entry's rules with. */
export declare const deriveBuildRules: (
  cityImprovementRegistry: CityImprovementRegistry,
  playerResearchRegistry: PlayerResearchRegistry
) => Deriver;
/**
 * Every rule about which improvements a city may build, as `registerRules` registers them: the not-built rule, one for
 * each of `Requirements`' entries, then the Hydro Plant's site rule. For a rule registry without a game's
 * `requirements` (tests, and rulesets that build on these): a game's are registered through `game.requirements`, so a
 * plugin can change an entry and its rule together.
 */
export declare const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => Build[];
export default getRules;
