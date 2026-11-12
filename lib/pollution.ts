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
  Production,
  UnitSupportProduction,
} from '@civ-clone/library-city/Yields';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  advancesKnown,
  pollution as cityPollution,
} from '@civ-clone/base-city-pollution/lib/pollution';
import City from '@civ-clone/core-city/City';
import { MassTransit } from '../CityImprovements';
import Yield from '@civ-clone/core-yield/Yield';

// The advances that make a city's population pollute, one step each (v474.05 `CityWorker.cs` ~L188-200).
export const pollutingAdvances = [
  Industrialization,
  Automobile,
  MassProduction,
  Plastics,
];

/**
 * A city's pollution: what v474.05 calls its "smokestack points", worked out each turn (`CityWorker.cs` ~L3710,
 * civ-clone/web-renderer#32):
 * its shields (after the Factory and plant bonuses, before unit support) divided by its `PollutionDivisor`, plus its
 * size times the polluting advances its owner knows (none with Mass Transit) over 4, less 20. Only a value above 0
 * risks pollution. The arithmetic is `base-city-pollution`'s; the numbers, advances and improvement are Civ1's.
 */
export const pollution = (
  city: City,
  cityYields: Yield[] = city.yields(),
  ruleRegistry: RuleRegistry = ruleRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  cityGrowthRegistry: CityGrowthRegistry = cityGrowthRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): number =>
  cityPollution(
    city,
    cityYields,
    {
      Production,
      excluding: [UnitSupportProduction],
      populationFactor: advancesKnown(
        pollutingAdvances,
        [MassTransit],
        playerResearchRegistry,
        cityImprovementRegistry
      ),
      populationDivisor: 4,
      tolerance: 20,
    },
    ruleRegistry,
    cityGrowthRegistry
  );

export default pollution;
