import {
  Aqueduct,
  Bank,
  Barracks,
  Cathedral,
  CityWalls,
  Colosseum,
  Courthouse,
  Factory,
  Granary,
  HydroPlant,
  Library,
  ManufacturingPlant,
  Marketplace,
  MassTransit,
  NuclearPlant,
  Palace,
  PowerPlant,
  RecyclingCenter,
  SdiDefence,
  Temple,
  University,
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
import Buildable from '@civ-clone/core-city-build/Buildable';

describe('city:build-cost', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityGrowthRegistry = new CityGrowthRegistry(),
    availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    playerWorldRegistry = new PlayerWorldRegistry();

  ruleRegistry.register(...buildCost());

  availableCityBuildItemsRegistry.register(
    ...([
      Aqueduct,
      Bank,
      Barracks,
      Cathedral,
      CityWalls,
      Colosseum,
      Courthouse,
      Factory,
      Granary,
      HydroPlant,
      Library,
      ManufacturingPlant,
      Marketplace,
      MassTransit,
      NuclearPlant,
      Palace,
      PowerPlant,
      RecyclingCenter,
      SdiDefence,
      Temple,
      University,
    ] as unknown as typeof Buildable[])
  );

  (
    [
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
      [Bank, 120],
      [Cathedral, 160],
      [Factory, 200],
      [HydroPlant, 240],
      [MassTransit, 160],
      [ManufacturingPlant, 320],
      [NuclearPlant, 160],
      [PowerPlant, 160],
      [RecyclingCenter, 200],
      [SdiDefence, 200],
      [University, 160],
    ] as [typeof CityImprovement, number][]
  ).forEach(([Improvement, cost]): void => {
    it(`should cost ${cost} to build ${Improvement.name}`, async (): Promise<void> => {
      const city = await setUpCity({
          ruleRegistry,
          playerWorldRegistry,
          cityGrowthRegistry,
        }),
        cityBuild = new CityBuild(
          city,
          availableCityBuildItemsRegistry,
          ruleRegistry
        );

      cityBuild.build(Improvement as unknown as typeof Buildable);

      expect(cityBuild.building()!.item()).to.equal(Improvement);
      expect(
        cityBuild.cost().value(),
        `${Improvement.name} should cost ${cost} (${cityBuild.cost().value()})`
      ).to.equal(cost);
    });
  });
});
