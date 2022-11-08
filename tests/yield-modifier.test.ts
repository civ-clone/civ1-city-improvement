import {
  Anarchy,
  Communism,
  Democracy,
  Despotism,
  Monarchy,
  Republic,
} from '@civ-clone/civ1-government/Governments';
import {
  Bank,
  Courthouse,
  Factory,
  HydroPlant,
  Library,
  ManufacturingPlant,
  Marketplace,
  NuclearPlant,
  Palace,
  PowerPlant,
  University,
} from '../CityImprovements';
import { Corruption, Gold, Luxuries, Production, Research } from '../Yields';
import {
  generateGenerator,
  generateWorld,
} from '@civ-clone/core-world/tests/lib/buildWorld';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Government from '@civ-clone/core-government/Government';
import { Grassland } from '@civ-clone/civ1-world/Terrains';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import YieldRule from '@civ-clone/core-city/Rules/Yield';
import cityCost from '../Rules/City/cost';
import cityYield from '@civ-clone/civ1-city/Rules/City/yield';
import cityYieldModifier from '../Rules/City/yield-modifier';
import { expect } from 'chai';
import { reduceYield } from '@civ-clone/core-yield/lib/reduceYields';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import Priority from '@civ-clone/core-rule/Priority';
import Trade from '@civ-clone/base-terrain-yield-trade/Trade';

describe('city:yield', (): void => {
  const ruleRegistry = new RuleRegistry(),
    cityImprovementRegistry = new CityImprovementRegistry(),
    playerResearchRegistry = new PlayerResearchRegistry(),
    playerGovernmentRegistry = new PlayerGovernmentRegistry(),
    playerWorldRegistry = new PlayerWorldRegistry();

  ruleRegistry.register(
    new YieldRule(new Priority(0), new Effect(() => new Trade(8))),
    ...cityCost(cityImprovementRegistry, playerResearchRegistry),
    ...cityYield(cityImprovementRegistry, playerGovernmentRegistry),
    ...cityYieldModifier(cityImprovementRegistry)
  );

  (
    [
      [Marketplace, Gold, 0.5],
      [Marketplace, Luxuries, 0.5],
      [Bank, Gold, 0.5],
      [Bank, Luxuries, 0.5],
      [Library, Research, 0.5],
      [University, Research, 0.5],
      [Factory, Production, 0.5],
      [PowerPlant, Production, 0.5],
      [HydroPlant, Production, 0.5],
      [NuclearPlant, Production, 0.5],
      [ManufacturingPlant, Production, 0.5],
    ] as [typeof CityImprovement, typeof Yield, number][]
  ).forEach(([Improvement, YieldType, difference]) =>
    it(`should provide ${difference * 100}% ${
      difference < 0 ? 'less' : 'more'
    } ${YieldType.name} in a city with a ${
      Improvement.name
    }`, async (): Promise<void> => {
      const ruleRegistry = new RuleRegistry(),
        city = await setUpCity({
          ruleRegistry,
          playerWorldRegistry,
        });

      ruleRegistry.register(
        ...cityYieldModifier(cityImprovementRegistry),
        new YieldRule(new Effect(() => new YieldType(4)))
      );

      cityImprovementRegistry.register(new Improvement(city));

      const yieldValue = city
        .yields()
        .filter((cityYield: Yield): boolean => cityYield instanceof YieldType)
        .reduce((total, cityYield) => total + cityYield.value(), 0);

      expect(yieldValue).to.equal(4 + 4 * difference);
    })
  );

  (
    [
      [Anarchy, 0, 6, 3, 8, true],
      [Communism, 1, 1, 0, 1, true],
      [Democracy, 0, 0, 0, 0, true],
      [Despotism, 0, 4, 2, 5, true],
      [Monarchy, 0, 3, 1, 4, true],
      [Republic, 0, 2, 1, 2, true],

      [Anarchy, 8, 8, 4, 8, false],
      [Communism, 1, 1, 0, 1, false],
      [Democracy, 0, 0, 0, 0, false],
      [Despotism, 6, 6, 3, 6, false],
      [Monarchy, 4, 4, 2, 4, false],
      [Republic, 3, 3, 1, 3, false],
    ] as [typeof Government, number, number, number, number, boolean][]
  ).forEach(
    ([
      GovernmentType,
      capitalCorruption,
      city1Corruption,
      city2Corruption,
      city3Corruption,
      hasCapital,
    ]) =>
      it(`should yield expected Corruption under ${GovernmentType.name}${
        hasCapital ? '' : ' without a capital city'
      }`, async (): Promise<void> => {
        const world = await generateWorld(
            generateGenerator(50, 50, Grassland),
            ruleRegistry
          ),
          capital = await setUpCity({
            playerWorldRegistry,
            ruleRegistry,
            tile: world.get(2, 2),
            world,
          }),
          otherCity1 = await setUpCity({
            player: capital.player(),
            playerWorldRegistry,
            ruleRegistry,
            tile: world.get(22, 4),
            world,
          }),
          otherCity2 = await setUpCity({
            player: capital.player(),
            playerWorldRegistry,
            ruleRegistry,
            tile: world.get(4, 22),
            world,
          }),
          otherCity3 = await setUpCity({
            player: capital.player(),
            playerWorldRegistry,
            ruleRegistry,
            tile: world.get(22, 22),
            world,
          }),
          playerGovernment = new PlayerGovernment(capital.player());

        if (hasCapital) {
          cityImprovementRegistry.register(new Palace(capital, ruleRegistry));
        }

        cityImprovementRegistry.register(
          new Courthouse(otherCity2, ruleRegistry)
        );

        playerGovernmentRegistry.register(playerGovernment);
        playerGovernment.set(new GovernmentType());

        const actualCapitalCorruption = reduceYield(
            capital.yields(),
            Corruption
          ),
          actualCity1Corruption = reduceYield(otherCity1.yields(), Corruption),
          actualCity2Corruption = reduceYield(otherCity2.yields(), Corruption),
          actualCity3Corruption = reduceYield(otherCity3.yields(), Corruption);

        expect(actualCapitalCorruption).equal(-capitalCorruption);
        expect(actualCity1Corruption).equal(-city1Corruption);
        expect(actualCity2Corruption).equal(-city2Corruption);
        expect(actualCity3Corruption).equal(-city3Corruption);
      })
  );
});
