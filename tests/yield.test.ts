import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Gold } from '@civ-clone/base-city-yield-gold/Gold';
import { Marketplace } from '../CityImprovements';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import cityYield from '../Rules/City/yield';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import Yield from '@civ-clone/core-yield/Yield';

describe('city:yield', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry();
  ruleRegistry.register(...cityYield(cityImprovementRegistry));

  it('should provide 50% additional Gold in a city with a Marketplace', (): void => {
    const city = setUpCity({
      ruleRegistry,
    });

    cityImprovementRegistry.register(new Marketplace(city.player(), city));

    city.tile().yields = () => [new Gold(4)];

    const [gold] = city
      .yields()
      .filter((cityYield: Yield): boolean => cityYield instanceof Gold);

    expect(gold.value()).to.equal(6);
  });
});
