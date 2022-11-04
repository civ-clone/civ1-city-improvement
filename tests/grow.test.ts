import { Aqueduct, Granary } from '../CityImprovements';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { expect } from 'chai';
import cityGrow from '@civ-clone/civ1-city/Rules/City/grow';
import grow from '../Rules/City/grow';
import created from '@civ-clone/civ1-city/Rules/City/created';
import improvementCreated from '../Rules/City/improvement-created';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';

describe('city:grow', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityRegistry = new CityRegistry(),
    cityGrowthRegistry = new CityGrowthRegistry(),
    cityBuildRegistry = new CityBuildRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    playerWorldRegistry = new PlayerWorldRegistry();

  ruleRegistry.register(
    ...cityGrow(cityGrowthRegistry, playerWorldRegistry),
    ...created(
      tileImprovementRegistry,
      cityBuildRegistry,
      cityGrowthRegistry,
      cityRegistry,
      playerWorldRegistry,
      ruleRegistry,
      availableCityBuildItemsRegistry
    ),
    ...grow(cityImprovementRegistry),
    ...improvementCreated(cityImprovementRegistry)
  );

  it('should have 50% full food storage with a granary', async (): Promise<void> => {
    const city = await setUpCity({
        ruleRegistry,
        cityGrowthRegistry,
        playerWorldRegistry,
      }),
      cityGrowth = cityGrowthRegistry.getByCity(city);

    new Granary(city, ruleRegistry);

    (
      [
        [15, 2, 30],
        [20, 3, 40],
        [25, 4, 50],
        [30, 5, 60],
        [35, 6, 70],
        [40, 7, 80],
        [45, 8, 90],
        [50, 9, 100],
      ] as [number, number, number][]
    ).forEach(([expectedFoodStorage, expectedSize, expectedCost]): void => {
      cityGrowth.grow();

      expect(cityGrowth.size()).to.equal(expectedSize);
      expect(cityGrowth.cost().value()).to.equal(expectedCost);
      expect(cityGrowth.progress().value()).to.equal(expectedFoodStorage);
    });
  });
});
