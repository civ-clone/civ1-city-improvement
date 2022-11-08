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
import {
  Banking,
  CeremonialBurial,
  CodeOfLaws,
  Construction,
  Currency,
  Electronics,
  Industrialization,
  Masonry,
  MassProduction,
  NuclearPower,
  Pottery,
  Recycling,
  Refining,
  Religion,
  Robotics,
  Superconductor,
  Writing,
  University as UniversityAdvance,
} from '@civ-clone/civ1-science/Advances';
import Advance from '@civ-clone/core-science/Advance';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import Buildable from '@civ-clone/core-city-build/Buildable';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import added from '@civ-clone/civ1-science/Rules/Player/added';
import build from '../Rules/City/build';
import cityCreated from '@civ-clone/civ1-city/Rules/City/created';
import created from '../Rules/City/created';
import { expect } from 'chai';
import improvementCreated from '../Rules/City/improvement-created';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('city:build', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityBuildRegistry = new CityBuildRegistry(),
    cityGrowthRegistry = new CityGrowthRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    cityRegistry = new CityRegistry(),
    availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    playerWorldRegistry = new PlayerWorldRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry(),
    advanceRegistry = new AdvanceRegistry();

  ruleRegistry.register(
    ...added(advanceRegistry, playerResearchRegistry, ruleRegistry),
    ...build(cityImprovementRegistry, playerResearchRegistry),
    ...cityCreated(
      tileImprovementRegistry,
      cityBuildRegistry,
      cityGrowthRegistry,
      cityRegistry,
      playerWorldRegistry,
      ruleRegistry
    ),
    ...created(cityRegistry, cityImprovementRegistry, ruleRegistry),
    ...improvementCreated(cityImprovementRegistry)
  );

  advanceRegistry.register(
    Banking,
    CeremonialBurial,
    CodeOfLaws,
    Construction,
    Currency,
    Electronics,
    Industrialization,
    Masonry,
    MassProduction,
    NuclearPower,
    Pottery,
    Recycling,
    Refining,
    Religion,
    Robotics,
    Superconductor,
    Writing,
    UniversityAdvance
  );

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

  it('should not be possible to build an improvement in a city that already contains one', async (): Promise<void> => {
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

    cityImprovementRegistry.register(new Barracks(city, ruleRegistry));

    expect(
      cityBuild.available().map((buildItem) => buildItem.item())
    ).to.not.include(Barracks);
  });

  ([Barracks] as typeof CityImprovement[]).forEach((Improvement): void => {
    it(`should be possible to build ${Improvement.name} in a city without discovering a specific advance`, async (): Promise<void> => {
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

      expect(
        cityBuild.available().map((buildItem) => buildItem.item())
      ).to.include(Improvement);
    });
  });

  (
    [
      [Aqueduct, Construction],
      [Cathedral, Religion],
      [CityWalls, Masonry],
      [Colosseum, Construction],
      [Factory, Industrialization],
      [Granary, Pottery],
      [Library, Writing],
      [Marketplace, Currency],
      [MassTransit, MassProduction],
      [RecyclingCenter, Recycling],
      [SdiDefence, Superconductor],
      [Temple, CeremonialBurial],
    ] as [typeof CityImprovement, typeof Advance][]
  ).forEach(([CityImprovementType, RequiredAdvance]) =>
    it(`should be possible to build ${CityImprovementType.name} in a city once you have discovered ${RequiredAdvance.name}`, async (): Promise<void> => {
      const city = await setUpCity({
          ruleRegistry,
          playerWorldRegistry,
          cityGrowthRegistry,
        }),
        cityBuild = new CityBuild(
          city,
          availableCityBuildItemsRegistry,
          ruleRegistry
        ),
        playerResearch = playerResearchRegistry.getByPlayer(city.player());

      expect(
        cityBuild.available().map((buildItem) => buildItem.item())
      ).to.not.include(CityImprovementType);

      playerResearch.addAdvance(RequiredAdvance);

      expect(
        cityBuild.available().map((buildItem) => buildItem.item())
      ).to.include(CityImprovementType);
    })
  );

  (
    [
      [Bank, Marketplace, Banking],
      [HydroPlant, Factory, Electronics],
      [ManufacturingPlant, HydroPlant, Robotics],
      [ManufacturingPlant, NuclearPlant, Robotics],
      [ManufacturingPlant, PowerPlant, Robotics],
      [NuclearPlant, Factory, NuclearPower],
      [PowerPlant, Factory, Refining],
      [University, Library, UniversityAdvance],
    ] as [typeof CityImprovement, typeof CityImprovement, ...typeof Advance[]][]
  ).forEach(([CityImprovementType, Prerequisite, ...Advances]): void => {
    it(`should be possible to build ${
      CityImprovementType.name
    } in a city once you have built ${
      Prerequisite.name
    } and discovered ${Advances.map((Advance) => Advance.name).join(
      ', '
    )}`, async (): Promise<void> => {
      const city = await setUpCity({
          ruleRegistry,
          playerWorldRegistry,
          cityGrowthRegistry,
        }),
        cityBuild = new CityBuild(
          city,
          availableCityBuildItemsRegistry,
          ruleRegistry
        ),
        playerResearch = playerResearchRegistry.getByPlayer(city.player());

      expect(
        cityBuild.available().map((buildItem) => buildItem.item())
      ).to.not.include(CityImprovementType);

      Advances.forEach((Advance) => playerResearch.addAdvance(Advance));

      expect(
        cityBuild.available().map((buildItem) => buildItem.item())
      ).to.not.include(CityImprovementType);

      cityImprovementRegistry.register(new Prerequisite(city));

      expect(
        cityBuild.available().map((buildItem) => buildItem.item())
      ).to.include(CityImprovementType);
    });
  });

  (
    [
      [HydroPlant, Factory, Electronics, NuclearPlant, PowerPlant],
      [NuclearPlant, Factory, NuclearPower, PowerPlant, HydroPlant],
      [PowerPlant, Factory, Refining, HydroPlant, NuclearPlant],
      [Courthouse, CodeOfLaws, Palace],
    ] as [
      typeof CityImprovement,
      typeof CityImprovement,
      typeof Advance,
      ...typeof CityImprovement[]
    ][]
  ).forEach(
    ([
      CityImprovementType,
      PrerequisiteImprovement,
      Advance,
      ...BlockingImprovements
    ]): void => {
      BlockingImprovements.forEach((BlockingImprovement) =>
        it(`should not be possible to build ${CityImprovementType.name} in a city that has a ${BlockingImprovement.name}`, async (): Promise<void> => {
          const city = await setUpCity({
              ruleRegistry,
              playerWorldRegistry,
              cityGrowthRegistry,
            }),
            cityBuild = new CityBuild(
              city,
              availableCityBuildItemsRegistry,
              ruleRegistry
            ),
            playerResearch = playerResearchRegistry.getByPlayer(city.player());

          cityImprovementRegistry.register(new PrerequisiteImprovement(city));

          expect(
            cityBuild.available().map((buildItem) => buildItem.item())
          ).to.not.include(CityImprovementType);

          playerResearch.addAdvance(Advance);

          expect(
            cityBuild.available().map((buildItem) => buildItem.item())
          ).to.include(CityImprovementType);

          cityImprovementRegistry.register(new BlockingImprovement(city));

          expect(
            cityBuild.available().map((buildItem) => buildItem.item())
          ).to.not.include(CityImprovementType);
        })
      );
    }
  );
});
