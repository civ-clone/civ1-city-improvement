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
import { Automobile, Gunpowder } from '@civ-clone/civ1-science/Advances';
import { CityImprovementMaintenanceGold, Gold, Research } from '../Yields';
import Advance from '@civ-clone/core-science/Advance';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import YieldRule from '@civ-clone/core-city/Rules/Yield';
import cityYield from '../Rules/City/yield';
import cityYieldModifier from '../Rules/City/yield-modifier';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('city:yield', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry();

  ruleRegistry.register(
    ...cityYield(cityImprovementRegistry, playerResearchRegistry),
    ...cityYieldModifier(cityImprovementRegistry)
  );

  (
    [
      [Gold, Marketplace],
      [Gold, Bank],
      [Research, Library],
      [Research, University],
    ] as [typeof Yield, typeof CityImprovement][]
  ).forEach(([YieldType, Improvement]) =>
    it(`should provide 50% additional ${YieldType.name} in a city with a ${Improvement.name}`, async (): Promise<void> => {
      const ruleRegistry = new RuleRegistry(),
        city = await setUpCity({
          ruleRegistry,
        });

      ruleRegistry.register(
        ...cityYieldModifier(cityImprovementRegistry),
        new YieldRule(new Effect(() => new YieldType(4)))
      );

      cityImprovementRegistry.register(new Improvement(city.player(), city));

      const yieldValue = city
        .yields()
        .filter((cityYield: Yield): boolean => cityYield instanceof YieldType)
        .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(yieldValue).to.equal(6);
    })
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

      const [cityYield] = city
        .yields()
        .filter(
          (cityYield) => cityYield instanceof CityImprovementMaintenanceGold
        );

      expect(
        cityYield.value(),
        `${CityImprovementType.name} should cost ${expectedCost} ${
          YieldType.name
        } (${cityYield.value()})`
      ).to.equal(expectedCost);
    });
  });

  (
    [
      [Barracks, 0, Gold],
      [Barracks, 1, Gold, Gunpowder],
      [Barracks, 2, Gold, Gunpowder, Automobile],
    ] as [typeof CityImprovement, number, typeof Yield, ...typeof Advance[]][]
  ).forEach(
    ([CityImprovementType, expectedCost, YieldType, ...advances]): void => {
      it(
        `should cost ${expectedCost} ${YieldType.name} to maintain ${CityImprovementType.name}` +
          (advances.length > 0
            ? ` after the discovery of ${advances
                .map((Advance) => Advance.name)
                .join(', ')}`
            : ''),
        async (): Promise<void> => {
          const city = await setUpCity({
              ruleRegistry,
            }),
            playerResearch = new PlayerResearch(city.player());

          playerResearchRegistry.register(playerResearch);

          advances.forEach((Advance) => playerResearch.addAdvance(Advance));

          cityImprovementRegistry.register(
            new CityImprovementType(city.player(), city, ruleRegistry)
          );

          const [cityYield] = city
            .yields()
            .filter(
              (cityYield) => cityYield instanceof CityImprovementMaintenanceGold
            );

          expect(
            cityYield.value(),
            `${CityImprovementType.name} should cost ${expectedCost} ${
              YieldType.name
            } (${cityYield.value()})`
          ).to.equal(expectedCost);
        }
      );
    }
  );
});
