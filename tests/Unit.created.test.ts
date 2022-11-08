import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import unitCreated from '../Rules/Unit/created';
import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import UnitImprovementRegistry from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import Unit from '@civ-clone/core-unit/Unit';
import { expect } from 'chai';
import Barracks from '@civ-clone/base-city-improvement-barracks/Barracks';
import { Veteran } from '@civ-clone/civ1-unit/UnitImprovements';

describe('Unit.created', (): void => {
  it('should add a `Veteran` `UnitImprovement` when a `Unit` is created in a `City` that contains a `Barracks`', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      cityImprovementRegistry = new CityImprovementRegistry(),
      unitImprovementRegistry = new UnitImprovementRegistry(),
      city = await setUpCity({
        ruleRegistry,
      });

    ruleRegistry.register(
      ...unitCreated(cityImprovementRegistry, unitImprovementRegistry)
    );

    const preBarracks = new Unit(
      city,
      city.player(),
      city.tile(),
      ruleRegistry
    );

    expect(unitImprovementRegistry.getByUnit(preBarracks)).length(0);

    cityImprovementRegistry.register(new Barracks(city));

    const postBarracks = new Unit(
        city,
        city.player(),
        city.tile(),
        ruleRegistry
      ),
      unitImprovements = unitImprovementRegistry.getByUnit(postBarracks);

    expect(unitImprovements).length(1);
    expect(unitImprovements[0]).instanceof(Veteran);
  });
});
