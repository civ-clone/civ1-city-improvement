import {
  Aqueduct,
  Barracks,
  CityWalls,
  Colosseum,
  Courthouse,
  Granary,
  Library,
  Marketplace,
  Palace,
  Temple,
} from '../CityImprovements';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Gold } from '@civ-clone/base-city-yield-gold/Gold';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import cost from '../Rules/City/cost';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('city:cost', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry();

  ruleRegistry.register(...cost(cityImprovementRegistry));

  ([
    [Aqueduct, 2, Gold],
    [Barracks, 0, Gold],
    [CityWalls, 2, Gold],
    [Courthouse, 1, Gold],
    [Colosseum, 2, Gold],
    [Granary, 1, Gold],
    [Library, 1, Gold],
    [Marketplace, 1, Gold],
    [Palace, 0, Gold],
    [Temple, 1, Gold],
  ] as [typeof CityImprovement, number, typeof Yield][]).forEach(
    ([CityImprovementType, expectedCost, YieldType]): void => {
      it(`should cost ${expectedCost} ${YieldType.name} to maintain ${CityImprovementType.name}`, (): void => {
        const city = setUpCity({
          ruleRegistry,
        });

        cityImprovementRegistry.register(
          new CityImprovementType(city.player(), city, ruleRegistry)
        );

        const [cityYield] = city.yields([Gold]);

        expect(
          cityYield.value(),
          `${CityImprovementType.name} should cost ${expectedCost} ${
            YieldType.name
          } (${-cityYield.value()})`
        ).to.equal(0 - expectedCost);
      });
    }
  );
});
