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
import { CityImprovementMaintenanceGold, Gold } from '../Yields';
import Advance from '@civ-clone/core-science/Advance';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import cityCost from '../Rules/City/cost';
import { expect } from 'chai';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('city:cost', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry();

  ruleRegistry.register(
    ...cityCost(cityImprovementRegistry, playerResearchRegistry)
  );

  (
    [
      [Aqueduct, 2, CityImprovementMaintenanceGold as unknown as typeof Yield],
      [Bank, 3, CityImprovementMaintenanceGold as unknown as typeof Yield],
      [Cathedral, 3, CityImprovementMaintenanceGold as unknown as typeof Yield],
      [CityWalls, 2, CityImprovementMaintenanceGold as unknown as typeof Yield],
      [Colosseum, 2, CityImprovementMaintenanceGold as unknown as typeof Yield],
      [
        Courthouse,
        1,
        CityImprovementMaintenanceGold as unknown as typeof Yield,
      ],
      [Factory, 4, CityImprovementMaintenanceGold as unknown as typeof Yield],
      [Granary, 1, CityImprovementMaintenanceGold as unknown as typeof Yield],
      [
        HydroPlant,
        4,
        CityImprovementMaintenanceGold as unknown as typeof Yield,
      ],
      [Library, 1, CityImprovementMaintenanceGold as unknown as typeof Yield],
      [
        ManufacturingPlant,
        6,
        CityImprovementMaintenanceGold as unknown as typeof Yield,
      ],
      [
        Marketplace,
        1,
        CityImprovementMaintenanceGold as unknown as typeof Yield,
      ],
      [
        MassTransit,
        4,
        CityImprovementMaintenanceGold as unknown as typeof Yield,
      ],
      [
        NuclearPlant,
        2,
        CityImprovementMaintenanceGold as unknown as typeof Yield,
      ],
      [Palace, 0, CityImprovementMaintenanceGold as unknown as typeof Yield],
      [
        PowerPlant,
        4,
        CityImprovementMaintenanceGold as unknown as typeof Yield,
      ],
      [
        RecyclingCenter,
        2,
        CityImprovementMaintenanceGold as unknown as typeof Yield,
      ],
      [
        SdiDefence,
        4,
        CityImprovementMaintenanceGold as unknown as typeof Yield,
      ],
      [Temple, 1, CityImprovementMaintenanceGold as unknown as typeof Yield],
      [
        University,
        3,
        CityImprovementMaintenanceGold as unknown as typeof Yield,
      ],
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
        .filter((cityYield) => cityYield instanceof YieldType);

      expect(
        cityYield.value(),
        `${CityImprovementType.name} should cost ${expectedCost} ${
          YieldType.name
        } (${cityYield.value()})`
      ).to.equal(-expectedCost);
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
          ).to.equal(-expectedCost);
        }
      );
    }
  );
});
