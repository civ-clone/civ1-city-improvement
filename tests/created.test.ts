import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import UnitImprovementRegistry from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import cityCreated from '@civ-clone/civ1-city/Rules/City/created';
import created from '../Rules/City/created';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import unitCreated from '../Rules/Unit/created';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import { Palace } from '../CityImprovements';
import improvementCreated from '../Rules/CityImprovement/created';

describe('city:created', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityBuildRegistry = new CityBuildRegistry(),
    cityGrowthRegistry = new CityGrowthRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    cityRegistry = new CityRegistry(),
    playerWorldRegistry = new PlayerWorldRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    unitImprovementRegistry = new UnitImprovementRegistry();

  ruleRegistry.register(
    ...cityCreated(
      tileImprovementRegistry,
      cityBuildRegistry,
      cityGrowthRegistry,
      cityRegistry,
      playerWorldRegistry,
      ruleRegistry
    ),
    ...created(cityRegistry, cityImprovementRegistry, ruleRegistry),
    ...unitCreated(cityImprovementRegistry, unitImprovementRegistry),
    ...improvementCreated(cityImprovementRegistry)
  );

  it('should create a Palace in a newly created capital city', async (): Promise<void> => {
    const capital = await setUpCity({
        cityGrowthRegistry,
        playerWorldRegistry,
        ruleRegistry,
        tileImprovementRegistry,
      }),
      city = await setUpCity({
        cityGrowthRegistry,
        player: capital.player(),
        world: capital.tile().map(),
        playerWorldRegistry,
        ruleRegistry,
        tileImprovementRegistry,
      });

    expect(
      cityImprovementRegistry
        .getByCity(capital)
        .some(
          (cityImprovement: CityImprovement): boolean =>
            cityImprovement instanceof Palace
        )
    ).to.true;
    expect(
      cityImprovementRegistry
        .getByCity(city)
        .some(
          (cityImprovement: CityImprovement): boolean =>
            cityImprovement instanceof Palace
        )
    ).to.false;
  });
});
