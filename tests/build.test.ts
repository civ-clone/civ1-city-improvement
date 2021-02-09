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
import {
  CeremonialBurial,
  CodeOfLaws,
  Construction,
  Currency,
  Masonry,
  Pottery,
  Writing,
} from '@civ-clone/civ1-science/Advances';
import Advance from '@civ-clone/core-science/Advance';
import AvailableCityBuildItemsRegistry from '@civ-clone/core-city-build/AvailableCityBuildItemsRegistry';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import build from '../Rules/City/build';
import cityCreated from '@civ-clone/civ1-city/Rules/City/created';
import created from '../Rules/City/created';
import { expect } from 'chai';
import improvementCreated from '../Rules/City/improvement-created';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import added from '@civ-clone/civ1-science/Rules/Player/added';

describe('city:build', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityBuildRegistry = new CityBuildRegistry(),
    cityGrowthRegistry = new CityGrowthRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    cityRegistry = new CityRegistry(),
    availableCityBuildItemsRegistry = new AvailableCityBuildItemsRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    playerWorldRegistry = new PlayerWorldRegistry(),
    tileImprovementRegistry = new TileImprovementRegistry();

  ruleRegistry.register(
    ...added(playerResearchRegistry),
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

  it('should not be possible to build an improvement in a city that already contains one', (): void => {
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

    cityImprovementRegistry.register(
      new Barracks(city.player(), city, ruleRegistry)
    );

    expect(cityBuild.available()).to.not.include(Barracks);
  });

  ([Barracks] as typeof CityImprovement[]).forEach((Improvement): void => {
    it(`should be possible to build ${Improvement.name} in a city without discovering a specific advance`, (): void => {
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

      expect(cityBuild.available()).to.include(Improvement);
    });
  });

  ([
    [Aqueduct, Construction],
    [CityWalls, Masonry],
    [Colosseum, Construction],
    [Granary, Pottery],
    [Library, Writing],
    [Marketplace, Currency],
    [Temple, CeremonialBurial],
  ] as [typeof CityImprovement, typeof Advance][]).forEach(
    ([CityImprovementType, RequiredAdvance]): void => {
      it(`should be possible to build ${CityImprovementType.name} in a city once you have discovered ${RequiredAdvance.name}`, (): void => {
        const city = setUpCity({
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

        expect(cityBuild.available()).to.not.include(CityImprovementType);

        playerResearch.addAdvance(RequiredAdvance);

        expect(cityBuild.available()).to.include(CityImprovementType);
      });
    }
  );

  ([
    [Courthouse, CodeOfLaws],
    [Palace, Masonry],
  ] as [typeof CityImprovement, typeof Advance][]).forEach(
    ([CityImprovementType, RequiredAdvance]): void => {
      it(`should be possible to build ${CityImprovementType.name} in a city once you have discovered ${RequiredAdvance.name}, but not in the capital`, (): void => {
        const capital = setUpCity({
            ruleRegistry,
            playerWorldRegistry,
            cityGrowthRegistry,
          }),
          city = setUpCity({
            ruleRegistry,
            player: capital.player(),
            playerWorldRegistry,
            cityGrowthRegistry,
          }),
          capitalBuild = new CityBuild(
            capital,
            availableCityBuildItemsRegistry,
            ruleRegistry
          ),
          cityBuild = new CityBuild(
            city,
            availableCityBuildItemsRegistry,
            ruleRegistry
          ),
          playerResearch = playerResearchRegistry.getByPlayer(capital.player());

        expect(capitalBuild.available()).to.not.include(CityImprovementType);
        expect(cityBuild.available()).to.not.include(CityImprovementType);

        playerResearch.addAdvance(RequiredAdvance);

        expect(
          capitalBuild.available(),
          `Shouldn't have ${CityImprovementType.name} available in capital`
        ).to.not.include(CityImprovementType);
        expect(
          cityBuild.available(),
          `Should have ${CityImprovementType.name} available in non-capital`
        ).to.include(CityImprovementType);
      });
    }
  );

  ([
    // [Bank, Marketplace],
    // [University, Library],
  ] as [typeof CityImprovement, typeof CityImprovement][]).forEach(
    ([CityImprovementType, Prerequisite]): void => {
      it(`should be possible to build ${CityImprovementType.name} in a city once you have built ${Prerequisite.name}`, (): void => {
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

        expect(cityBuild.available()).to.not.include(CityImprovementType);

        cityImprovementRegistry.register(new Prerequisite(city.player(), city));

        expect(cityBuild.available()).to.include(CityImprovementType);
      });
    }
  );
});
