import { Automobile } from '@civ-clone/civ1-science/Advances';
import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import Yield from '@civ-clone/core-yield/Yield';
export declare const pollutingAdvances: (typeof Automobile)[];
/**
 * A city's pollution: what v474.05 calls its "smokestack points", worked out each turn (`CityWorker.cs` ~L3710,
 * civ-clone/web-renderer#32):
 * its shields (after the Factory and plant bonuses, before unit support) divided by its `PollutionDivisor`, plus its
 * size times the polluting advances its owner knows (none with Mass Transit) over 4, less 20. Only a value above 0
 * risks pollution.
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
