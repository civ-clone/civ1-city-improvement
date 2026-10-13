import {
  Automobile,
  Industrialization,
  MassProduction,
  Plastics,
} from '@civ-clone/civ1-science/Advances';
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
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import { MassTransit } from '../CityImprovements';
import PollutionDivisor from '../Rules/PollutionDivisor';
import {
  Production,
  UnitSupportProduction,
} from '@civ-clone/library-city/Yields';
import Yield from '@civ-clone/core-yield/Yield';

// The advances that make a city's population pollute, one step each (v474.05 `CityWorker.cs` ~L188-200).
export const pollutingAdvances = [
  Industrialization,
  Automobile,
  MassProduction,
  Plastics,
];

/**
 * A city's "smokestack points", as v474.05 works them out each turn (`CityWorker.cs` ~L3710, civ-clone/web-renderer#32):
 * its shields (after the Factory and plant bonuses, before unit support) divided by its `PollutionDivisor`, plus its
 * size times the polluting advances its owner knows (none with Mass Transit) over 4, less 20. Only a value above 0
 * risks pollution.
 */
export const smokestacks = (
  city: City,
  cityYields: Yield[] = city.yields(),
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): number => {
  const shields = cityYields
      .filter(
        (cityYield: Yield): boolean =>
          cityYield instanceof Production &&
          !(cityYield instanceof UnitSupportProduction)
      )
      .reduce(
        (total: number, cityYield: Yield) => total + cityYield.value(),
        0
      ),
    divisor = Math.max(1, ...ruleRegistry.process(PollutionDivisor, city)),
    playerResearch = playerResearchRegistry.getByPlayer(city.player()),
    level = cityImprovementRegistry
      .getByCity(city)
      .some(
        (cityImprovement: CityImprovement): boolean =>
          cityImprovement instanceof MassTransit
      )
      ? 0
      : pollutingAdvances.filter((Advance) => playerResearch.completed(Advance))
          .length,
    size = cityGrowthRegistry.getByCity(city).size();

  return (
    Math.floor(Math.max(0, shields) / divisor) +
    Math.floor((size * level) / 4) -
    20
  );
};

export default smokestacks;
