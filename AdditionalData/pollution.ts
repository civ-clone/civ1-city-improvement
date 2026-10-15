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
import pollution from '../lib/pollution';

/**
 * How much the city pollutes: its pollution over what it tolerates (`lib/pollution`), never below 0, so a renderer can
 * show it without knowing the rule (civ-clone/web-renderer#402). Civ1 draws it as that many smokestacks.
 */
export const getAdditionalData = (
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): AdditionalData[] => [
  new AdditionalData(City, 'pollution', (city: City): number =>
    Math.max(
      0,
      pollution(
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
