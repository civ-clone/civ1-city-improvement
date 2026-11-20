import { Automobile } from '@civ-clone/civ1-science/Advances';
import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import { EffectDescription } from '@civ-clone/core-rule/Description';
import { MassTransit } from '../CityImprovements';
import Yield from '@civ-clone/core-yield/Yield';
export declare const pollutingAdvances: (typeof Automobile)[];
export declare const cleanedBy: (typeof MassTransit)[];
/**
 * What the pollution rules say about the improvements above (civ-clone/web-renderer#1196), for each rule that rolls
 *  for pollution with `pollution` to give, so a rule that takes the place of Civ1's says it too.
 */
export declare const pollutionDescriptions: () => EffectDescription[];
/**
 * A city's pollution: what v474.05 calls its "smokestack points", worked out each turn (`CityWorker.cs` ~L3710,
 * civ-clone/web-renderer#32):
 * its shields (after the Factory and plant bonuses, before unit support) divided by its `PollutionDivisor`, plus its
 * size times the polluting advances its owner knows (none with Mass Transit) over 4, less 20. Only a value above 0
 * risks pollution. The arithmetic is `base-city-pollution`'s; the numbers, advances and improvement are Civ1's.
 */
export declare const pollution: (
  city: City,
  cityYields?: Yield[],
  ruleRegistry?: RuleRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  cityGrowthRegistry?: CityGrowthRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => number;
export default pollution;
