import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import Created from '@civ-clone/core-city/Rules/Created';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Palace } from '../../CityImprovements';

export const getRules: (
  cityRegistry?: CityRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  ruleRegistry?: RuleRegistry
) => Created[] = (
  cityRegistry: CityRegistry = cityRegistryInstance,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): Created[] => [
  new Created(
    new Criterion(
      (city: City): boolean =>
        cityRegistry.getByPlayer(city.player()).length === 0
    ),
    new Effect((city: City): void =>
      cityImprovementRegistry.register(new Palace(city, ruleRegistry))
    )
  ),
];

export default getRules;
