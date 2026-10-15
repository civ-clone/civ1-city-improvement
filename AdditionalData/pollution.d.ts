import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import AdditionalData from '@civ-clone/core-data-object/AdditionalData';
/**
 * How much the city pollutes: its pollution over what it tolerates (`lib/pollution`), never below 0, so a renderer can
 * show it without knowing the rule (civ-clone/web-renderer#402). Civ1 draws it as that many smokestacks.
 */
export declare const getAdditionalData: (
  ruleRegistry?: RuleRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  cityGrowthRegistry?: CityGrowthRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => AdditionalData[];
export default getAdditionalData;
