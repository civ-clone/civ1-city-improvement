import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  Requirement,
  Target,
  met,
} from '@civ-clone/core-requirement/Requirement';
import { Mountains, River } from '@civ-clone/civ1-world/Terrains';
import Advance from '@civ-clone/core-science/Advance';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import { Deriver } from '@civ-clone/core-requirement/RequirementRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import { HydroPlant } from '../../CityImprovements';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Tile from '@civ-clone/core-world/Tile';
import buildRequirements from '../../Requirements';

/** An improvement is built once in each city: a state of the city, so a rule written by hand. */
export const notBuiltRule = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): Build =>
  new Build(
    'civ1-city-improvement:city/build/not-built',
    CityImprovement,
    new Effect(
      (city: City, BuildItem: IConstructor): IBuildCriterion =>
        new Criterion(
          (): boolean =>
            !cityImprovementRegistry
              .getByCity(city)
              .some(
                (improvement: CityImprovement): boolean =>
                  improvement instanceof BuildItem
              )
        )
    )
  );

/**
 * A Hydro Plant is only built with Mountains or a River next to the city: a state of the map, so a rule written by
 * hand.
 */
export const hydroPlantSiteRule = (): Build =>
  // As v474.05, which checks the eight squares around the city, but not the city's own square (OpenCivOne's
  //  decompile, `Overlay_20.cs` `F20_0000_0000`). The book's "on or near" is looser.
  new Build(
    'civ1-city-improvement:city/build/hydro-plant-site',
    HydroPlant,
    new Criterion(
      (city: City, BuildItem: IConstructor): boolean => BuildItem === HydroPlant
    ),
    new Effect(
      (city: City): IBuildCriterion =>
        new Criterion((): boolean =>
          city
            .tile()
            .getNeighbours()
            .some(
              (tile: Tile): boolean =>
                tile.terrain() instanceof Mountains ||
                tile.terrain() instanceof River
            )
        )
    )
  );

const isImprovement = (target: Target): target is typeof CityImprovement =>
  Object.prototype.isPrototypeOf.call(CityImprovement, target);

/**
 * The rule `entry` is played by: a city may build its subject only while its targets are met (`requires`), or only
 * while they are not (`excludedBy`). A target that is an improvement is met by the city having one; any other is an
 * advance, met by the city's player having discovered it.
 */
export const buildRulesFor = (
  entry: Requirement,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): Build[] => {
  if (entry.relation !== 'requires' && entry.relation !== 'excludedBy') {
    return [];
  }

  const excluded = entry.relation === 'excludedBy',
    // Worked out once here rather than each time the rule runs, as `available()` runs it for every item every turn.
    improvementTargets = new Set(entry.targets.filter(isImprovement));

  return [
    new Build(
      entry.id,
      entry.subject,
      new Criterion(
        (city: City, BuildItem: IConstructor): boolean =>
          BuildItem === entry.subject
      ),
      new Effect(
        (city: City): IBuildCriterion =>
          new Criterion((): boolean => {
            let improvements: CityImprovement[] | null = null;

            const targetsMet = met(entry, (target: Target): boolean => {
              if (!improvementTargets.has(target as typeof CityImprovement)) {
                return playerResearchRegistry
                  .getByPlayer(city.player())
                  .completed(target as typeof Advance);
              }

              if (improvements === null) {
                improvements = cityImprovementRegistry.getByCity(city);
              }

              return improvements.some(
                (improvement: CityImprovement): boolean =>
                  improvement instanceof (target as typeof CityImprovement)
              );
            });

            return excluded ? !targetsMet : targetsMet;
          })
      )
    ),
  ];
};

/** What `registerRules` gives the game's `requirements` to make each entry's rules with. */
export const deriveBuildRules =
  (
    cityImprovementRegistry: CityImprovementRegistry,
    playerResearchRegistry: PlayerResearchRegistry
  ): Deriver =>
  (entry: Requirement): Build[] =>
    buildRulesFor(entry, cityImprovementRegistry, playerResearchRegistry);

/**
 * Every rule about which improvements a city may build, as `registerRules` registers them: the not-built rule, one for
 * each of `Requirements`' entries, then the Hydro Plant's site rule. For a rule registry without a game's
 * `requirements` (tests, and rulesets that build on these): a game's are registered through `game.requirements`, so a
 * plugin can change an entry and its rule together.
 */
export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => Build[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): Build[] => [
  notBuiltRule(cityImprovementRegistry),
  ...buildRequirements.flatMap((entry: Requirement): Build[] =>
    buildRulesFor(entry, cityImprovementRegistry, playerResearchRegistry)
  ),
  hydroPlantSiteRule(),
];

export default getRules;
