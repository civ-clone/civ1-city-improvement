import {
  Condition,
  Requirement,
} from '@civ-clone/core-requirement/Requirement';
/** The advance a city's player needs before it can build each improvement: one rule each. */
export declare const requiresAdvance: Requirement[];
/** The improvements a city needs, any one of, before it can build each improvement: one rule each. */
export declare const requiresImprovement: Requirement[];
/** The improvements, any one of, that stop a city building each improvement: one rule each. */
export declare const excludedBy: Requirement[];
/** A city without one of the improvement already, which `Rules/City/build`'s own rule decides. */
export declare const notInCity: Condition;
/** An improvement is built once in each city. The rule is written by hand; this entry names it for the civilopedia. */
export declare const notBuilt: Requirement;
/** Mountains or a River next to the city, which `Rules/City/build`'s own rule decides. */
export declare const mountainsOrRiverNearby: Condition;
/**
 * A Hydro Plant is only built with Mountains or a River next to the city. The rule is written by hand; this entry
 * names it for the civilopedia.
 */
export declare const hydroPlantSite: Requirement;
/** The entries `Rules/City/build`'s deriver makes rules from, in the order the rules were always registered. */
export declare const buildRequirements: Requirement[];
/** The entries that only describe: no rule is made from them. */
export declare const describedRequirements: Requirement[];
export default buildRequirements;
