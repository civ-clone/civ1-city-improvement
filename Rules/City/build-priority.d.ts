import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { InteractionRegistry } from '@civ-clone/core-diplomacy/InteractionRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import BuildPriority from '@civ-clone/core-city-build/Rules/BuildPriority';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
export interface CityNeeds {
  city: City;
  corruption: number;
  food: number;
  gold: number;
  luxuries: number;
  production: number;
  research: number;
  size: number;
  unhappy: number;
}
export declare const needs: [
  typeof CityImprovement,
  (needs: CityNeeds) => number
][];
export declare const everyday = 0.1;
export declare const warPriority = 100;
export declare const threatRadius = 5;
export declare const isThreatened: (
  city: City,
  cityRegistry?: CityRegistry,
  interactionRegistry?: InteractionRegistry,
  unitRegistry?: UnitRegistry
) => boolean;
export declare const getRules: (
  cityGrowthRegistry?: CityGrowthRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  interactionRegistry?: InteractionRegistry,
  playerResearchRegistry?: PlayerResearchRegistry,
  cityRegistry?: CityRegistry,
  unitRegistry?: UnitRegistry
) => BuildPriority[];
export default getRules;
