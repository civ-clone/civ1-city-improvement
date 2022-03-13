import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import Gold from '@civ-clone/base-city-yield-gold/Gold';
import Research from '@civ-clone/base-city-yield-research/Research';
import { Bank, Library, Marketplace, University } from '../CityImprovements';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import cityYield from '../Rules/City/yield';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import Yield from '@civ-clone/core-yield/Yield';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';

describe('city:yield', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry();
  ruleRegistry.register(...cityYield(cityImprovementRegistry));

  (
    [
      [Gold, Marketplace],
      [Gold, Bank],
      [Research, Library],
      [Research, University],
    ] as [typeof Yield, typeof CityImprovement][]
  ).forEach(([YieldType, Improvement]) =>
    it(`should provide 50% additional ${YieldType.name} in a city with a ${Improvement.name}`, async (): Promise<void> => {
      const city = await setUpCity({
        ruleRegistry,
      });

      cityImprovementRegistry.register(new Improvement(city.player(), city));

      city.tile().yields = () => [new YieldType(4)];

      const [yieldValue] = city
        .yields()
        .filter((cityYield: Yield): boolean => cityYield instanceof YieldType);

      expect(yieldValue.value()).to.equal(6);
    })
  );
});
