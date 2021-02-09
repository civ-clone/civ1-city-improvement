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
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import buildCost from '../Rules/City/build-cost';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';

describe('city:build-cost', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityGrowthRegistry = new CityGrowthRegistry(),
    availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    playerWorldRegistry = new PlayerWorldRegistry();

  ruleRegistry.register(...buildCost());

  availableCityBuildItemsRegistry.register(
    Aqueduct,
    Barracks,
    CityWalls,
    Colosseum,
    Courthouse,
    Granary,
    Library,
    Marketplace,
    Palace,
    Temple
  );

  ([
    [Aqueduct, 120],
    [Barracks, 40],
    [CityWalls, 120],
    [Colosseum, 100],
    [Courthouse, 80],
    [Granary, 60],
    [Library, 80],
    [Marketplace, 80],
    [Palace, 200],
    [Temple, 40],
  ] as [typeof CityImprovement, number][]).forEach(
    ([Improvement, cost]): void => {
      it(`should cost ${cost} to build ${Improvement.name}`, (): void => {
        const city = setUpCity({
            ruleRegistry,
            playerWorldRegistry,
            cityGrowthRegistry,
          }),
          cityBuild = new CityBuild(
            city,
            availableCityBuildItemsRegistry,
            ruleRegistry
          );

        cityBuild.build(Improvement);

        expect(cityBuild.building()).to.equal(Improvement);
        expect(
          cityBuild.cost().value(),
          `${
            Improvement.name
          } should cost ${cost} (${cityBuild.cost().value()})`
        ).to.equal(cost);
      });
    }
  );
});
