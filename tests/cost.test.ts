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
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Gold } from '@civ-clone/base-city-yield-gold/Gold';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import cost from '../Rules/City/cost';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import { Automobile, Gunpowder } from '@civ-clone/civ1-science/Advances';
import Advance from '@civ-clone/core-science/Advance';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';

describe('city:cost', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry();

  ruleRegistry.register(
    ...cost(cityImprovementRegistry, playerResearchRegistry)
  );

  (
    [
      [Aqueduct, 2, Gold],
      [Bank, 3, Gold],
      [Cathedral, 3, Gold],
      [CityWalls, 2, Gold],
      [Colosseum, 2, Gold],
      [Courthouse, 1, Gold],
      [Factory, 4, Gold],
      [Granary, 1, Gold],
      [HydroPlant, 4, Gold],
      [Library, 1, Gold],
      [ManufacturingPlant, 6, Gold],
      [Marketplace, 1, Gold],
      [MassTransit, 4, Gold],
      [NuclearPlant, 2, Gold],
      [Palace, 0, Gold],
      [PowerPlant, 4, Gold],
      [RecyclingCenter, 2, Gold],
      [SdiDefence, 4, Gold],
      [Temple, 1, Gold],
      [University, 3, Gold],
    ] as [typeof CityImprovement, number, typeof Yield][]
  ).forEach(([CityImprovementType, expectedCost, YieldType]): void => {
    it(`should cost ${expectedCost} ${YieldType.name} to maintain ${CityImprovementType.name}`, async (): Promise<void> => {
      const city = await setUpCity({
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
  });

  (
    [
      [Barracks, 0, Gold],
      [Barracks, 1, Gold, Gunpowder],
      [Barracks, 2, Gold, Automobile],
    ] as [typeof CityImprovement, number, typeof Yield, ...typeof Advance[]][]
  ).forEach(([CityImprovementType, expectedCost, YieldType, Advance]): void => {
    it(
      `should cost ${expectedCost} ${YieldType.name} to maintain ${CityImprovementType.name}` +
        (Advance ? ` after the discovery of ${Advance.name}` : ''),
      async (): Promise<void> => {
        const city = await setUpCity({
            ruleRegistry,
          }),
          playerResearch = new PlayerResearch(city.player());

        playerResearchRegistry.register(playerResearch);

        if (Advance) {
          playerResearch.addAdvance(Advance);
        }

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
      }
    );
  });
});
