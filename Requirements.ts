import {
  Aqueduct,
  Bank,
  Cathedral,
  CityWalls,
  Colosseum,
  Courthouse,
  Factory,
  Granary,
  HydroPlant,
  Library,
  ManufacturingPlant,
  Marketplace,
  MassTransit,
  NuclearPlant,
  Palace,
  PowerPlant,
  RecyclingCenter,
  SdiDefence,
  Temple,
  University,
} from './CityImprovements';
import {
  Banking,
  CeremonialBurial,
  CodeOfLaws,
  Construction,
  Currency,
  Electronics,
  Industrialization,
  Masonry,
  MassProduction,
  NuclearPower,
  Pottery,
  Recycling,
  Refining,
  Religion,
  Robotics,
  Superconductor,
  University as UniversityAdvance,
  Writing,
} from '@civ-clone/civ1-science/Advances';
import {
  Condition,
  Requirement,
  table,
} from '@civ-clone/core-requirement/Requirement';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';

// What Civilization's city improvements need, and what stops a city building them, as the entries `Rules/City/build`
//  makes its rules from (civ-clone/web-renderer#37). `registerRules` adds them to the game's `requirements`.

/** The advance a city's player needs before it can build each improvement: one rule each. */
export const requiresAdvance: Requirement[] = table(
  'civ1-city-improvement:city/build/requires-advance',
  'requires',
  [
    [Aqueduct, Construction],
    [CityWalls, Masonry],
    [Colosseum, Construction],
    [Courthouse, CodeOfLaws],
    [Granary, Pottery],
    [Library, Writing],
    [Marketplace, Currency],
    [Palace, Masonry],
    [Temple, CeremonialBurial],
    [Bank, Banking],
    [Cathedral, Religion],
    [Factory, Industrialization],
    [HydroPlant, Electronics],
    [MassTransit, MassProduction],
    [ManufacturingPlant, Robotics],
    [NuclearPlant, NuclearPower],
    [PowerPlant, Refining],
    [RecyclingCenter, Recycling],
    [SdiDefence, Superconductor],
    [University, UniversityAdvance],
  ]
);

/** The improvements a city needs, any one of, before it can build each improvement: one rule each. */
export const requiresImprovement: Requirement[] = table(
  'civ1-city-improvement:city/build/requires-improvement',
  'requires',
  [
    [Bank, Marketplace],
    [University, Library],
    // As v474.05's production menu, which asks for a Factory before a Power Plant, but not before a Hydro or Nuclear
    //  Plant, and nothing before a Mfg. Plant (OpenCivOne's decompile, `Segment_1ade.cs` `F0_1ade_0421`).
    [PowerPlant, Factory],
  ],
  { mode: 'any', range: 'city' }
);

/** The improvements, any one of, that stop a city building each improvement: one rule each. */
export const excludedBy: Requirement[] = table(
  'civ1-city-improvement:city/build/excluded-by',
  'excludedBy',
  [
    [Courthouse, Palace],
    [Factory, ManufacturingPlant],
    [HydroPlant, NuclearPlant, PowerPlant],
    [NuclearPlant, PowerPlant, HydroPlant],
    [PowerPlant, HydroPlant, NuclearPlant],
  ],
  { mode: 'any', range: 'city' }
);

/** A city without one of the improvement already, which `Rules/City/build`'s own rule decides. */
export const notInCity = new Condition('civ1-city-improvement:not-in-city');

/** An improvement is built once in each city. The rule is written by hand; this entry names it for the civilopedia. */
export const notBuilt = new Requirement({
  id: 'civ1-city-improvement:city/build/not-built',
  subject: CityImprovement,
  relation: 'requires',
  targets: [notInCity],
  range: 'city',
});

/** Mountains or a River next to the city, which `Rules/City/build`'s own rule decides. */
export const mountainsOrRiverNearby = new Condition(
  'civ1-city-improvement:mountains-or-river-nearby'
);

/**
 * A Hydro Plant is only built with Mountains or a River next to the city. The rule is written by hand; this entry
 * names it for the civilopedia.
 */
export const hydroPlantSite = new Requirement({
  id: 'civ1-city-improvement:city/build/hydro-plant-site',
  subject: HydroPlant,
  relation: 'requires',
  targets: [mountainsOrRiverNearby],
  range: 'city',
});

/** The entries `Rules/City/build`'s deriver makes rules from, in the order the rules were always registered. */
export const buildRequirements: Requirement[] = [
  ...requiresAdvance,
  ...requiresImprovement,
  ...excludedBy,
];

/** The entries that only describe: no rule is made from them. */
export const describedRequirements: Requirement[] = [notBuilt, hydroPlantSite];

export default buildRequirements;
