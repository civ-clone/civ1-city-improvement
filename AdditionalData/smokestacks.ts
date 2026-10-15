import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import AdditionalData from '@civ-clone/core-data-object/AdditionalData';
import City from '@civ-clone/core-city/City';
import smokestacks from '../lib/smokestacks';

/**
 * How many smokestacks the city screen shows: the city's smokestack points over 20 (`lib/smokestacks`), each a 1%
 * chance a turn of polluting a square around it, so a renderer can draw them without knowing the rule
 * (civ-clone/web-renderer#402).
 */
export const getAdditionalData = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): AdditionalData[] => [
  new AdditionalData(City, 'smokestacks', (city: City): number =>
    Math.max(
      0,
      smokestacks(
        city,
        city.yields(),
        ruleRegistry,
        cityImprovementRegistry,
        cityGrowthRegistry,
        playerResearchRegistry
      )
    )
  ),
];

export default getAdditionalData;
