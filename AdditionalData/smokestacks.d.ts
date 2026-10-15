import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import AdditionalData from '@civ-clone/core-data-object/AdditionalData';
/**
 * How many smokestacks the city screen shows: the city's smokestack points over 20 (`lib/smokestacks`), each a 1%
 * chance a turn of polluting a square around it, so a renderer can draw them without knowing the rule
 * (civ-clone/web-renderer#402).
 */
export declare const getAdditionalData: (
  ruleRegistry?: RuleRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  cityGrowthRegistry?: CityGrowthRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => AdditionalData[];
export default getAdditionalData;
