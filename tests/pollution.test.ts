import {
  Automobile,
  Industrialization,
  MassProduction,
} from '@civ-clone/civ1-science/Advances';
import {
  HydroPlant,
  MassTransit,
  NuclearPlant,
  RecyclingCenter,
} from '../CityImprovements';
import {
  Production,
  UnitSupportProduction,
} from '@civ-clone/library-city/Yields';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import City from '@civ-clone/core-city/City';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Engine from '@civ-clone/core-engine/Engine';
import FillGenerator from '@civ-clone/simple-world-generator/tests/lib/FillGenerator';
import GameDifficultyRegistry from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import { Grassland, Ocean } from '@civ-clone/civ1-world/Terrains';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import { Pollution } from '@civ-clone/civ1-world/TileImprovements';
import ProcessYield from '@civ-clone/core-city/Rules/ProcessYield';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovementRegistry from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import World from '@civ-clone/core-world/World';
import Yield from '@civ-clone/core-yield/Yield';
import built from '@civ-clone/civ1-world/Rules/TileImprovement/built';
import { expect } from 'chai';
import pollution from '../Rules/City/pollution';
import pollutionDivisor from '../Rules/City/pollution-divisor';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';
import pollutionPoints from '../lib/pollution';
import pollutionData from '../AdditionalData/pollution';

// civ-clone/web-renderer#32: how much a city pollutes, and where.
describe('pollution', (): void => {
  // `rolls` are what the random number generator returns, in turn, then 0.
  const setUp = async (size: number, rolls: number[] = []) => {
    const ruleRegistry = new RuleRegistry(),
      cityRegistry = new CityRegistry(),
      cityGrowthRegistry = new CityGrowthRegistry(),
      cityImprovementRegistry = new CityImprovementRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      tileImprovementRegistry = new TileImprovementRegistry(),
      engine = new Engine(),
      world = new World(new FillGenerator(7, 7, Grassland), ruleRegistry),
      events: [City, Tile][] = [];

    await world.build();

    ruleRegistry.register(
      ...built(tileImprovementRegistry, engine),
      ...pollutionDivisor(cityImprovementRegistry),
      ...pollution(
        cityRegistry,
        cityImprovementRegistry,
        cityGrowthRegistry,
        playerResearchRegistry,
        tileImprovementRegistry,
        new GameDifficultyRegistry(),
        ruleRegistry,
        engine,
        (): number => rolls.shift() ?? 0
      )
    );

    const city = await setUpCity({
        size,
        world,
        tile: world.get(3, 3),
        ruleRegistry,
        cityGrowthRegistry,
        tileImprovementRegistry,
      }),
      playerResearch = new PlayerResearch(
        city.player(),
        new AdvanceRegistry(),
        ruleRegistry
      );

    cityRegistry.register(city);
    playerResearchRegistry.register(playerResearch);
    engine.on('city:polluted', (pollutingCity: City, tile: Tile) =>
      events.push([pollutingCity, tile])
    );

    const build = (...Improvements: (typeof CityImprovement)[]): void =>
        Improvements.forEach((Improvement) =>
          cityImprovementRegistry.register(new Improvement(city, ruleRegistry))
        ),
      points = (cityYields: Yield[]): number =>
        pollutionPoints(
          city,
          cityYields,
          ruleRegistry,
          cityImprovementRegistry,
          cityGrowthRegistry,
          playerResearchRegistry
        ),
      processTurn = (shields: number): void => {
        const cityYields = [new Production(shields)];

        ruleRegistry.process(
          ProcessYield,
          new Production(shields, 'Consolidated'),
          city,
          cityYields
        );
      },
      polluted = (): Tile[] =>
        city
          .tiles()
          .entries()
          .filter((tile: Tile): boolean =>
            tileImprovementRegistry
              .getByTile(tile)
              .some((improvement) => improvement instanceof Pollution)
          );

    return {
      build,
      city,
      cityGrowthRegistry,
      cityImprovementRegistry,
      playerResearchRegistry,
      cityRegistry,
      events,
      playerResearch,
      points,
      polluted,
      processTurn,
      ruleRegistry,
      world,
    };
  };

  describe('pollution points', (): void => {
    it('counts shields over 20, before unit support', async (): Promise<void> => {
      const { points } = await setUp(1);

      expect(points([new Production(30)])).to.equal(10);
      expect(
        points([new Production(30), new UnitSupportProduction(5)])
      ).to.equal(10);
      expect(points([new Production(12)])).to.equal(-8);
    });

    it('halves shields with a Hydro or Nuclear Plant, and thirds them with a Recycling Center instead', async (): Promise<void> => {
      for (const [Improvements, expected] of [
        [[HydroPlant], 2],
        [[NuclearPlant], 2],
        [[RecyclingCenter], -5],
        [[HydroPlant, RecyclingCenter], -5],
      ] as [(typeof CityImprovement)[], number][]) {
        const { build, points } = await setUp(1);

        build(...Improvements);

        // 45 shields: 22 halved, 15 thirded.
        expect(points([new Production(45)])).to.equal(expected);
      }
    });

    it('adds size × polluting advances ÷ 4, but none with Mass Transit', async (): Promise<void> => {
      const { build, playerResearch, points } = await setUp(10);

      [Industrialization, Automobile, MassProduction].forEach((Advance) =>
        playerResearch.addAdvance(Advance)
      );

      // 10 × 3 ÷ 4 = 7.
      expect(points([new Production(20)])).to.equal(7);

      build(MassTransit);

      expect(points([new Production(20)])).to.equal(0);
    });
  });

  describe('pollution data', (): void => {
    // civ-clone/web-renderer#402: what the city screen draws.
    it('sends the pollution over 20, and never less than none', async (): Promise<void> => {
      const {
          build,
          city,
          cityGrowthRegistry,
          cityImprovementRegistry,
          playerResearchRegistry,
          ruleRegistry,
        } = await setUp(1),
        [additionalData] = pollutionData(
          ruleRegistry,
          cityImprovementRegistry,
          cityGrowthRegistry,
          playerResearchRegistry
        );
      let cityYields: Yield[] = [new Production(30)];

      city.yields = (): Yield[] => cityYields;

      expect(additionalData.key()).to.equal('pollution');
      expect(additionalData.data(city)).to.equal(10);

      // 30 shields halved.
      build(HydroPlant);

      expect(additionalData.data(city)).to.equal(0);

      cityYields = [new Production(12)];

      expect(additionalData.data(city)).to.equal(0);
    });
  });

  describe('each turn', (): void => {
    it('pollutes a square around the city when 2 × points beats the roll', async (): Promise<void> => {
      // 30 shields is 10 points. With no level chosen the game is played at King, so with 1 advance known the roll is
      //  out of 256 − floor(1 × 3 ÷ 2) = 255: 20 beats a roll of 19, but not one of 20.
      const passes = await setUp(1, [19.5 / 256, 0]);

      passes.processTurn(30);

      expect(passes.polluted().length).to.equal(1);
      expect(passes.events.length).to.equal(1);
      expect(passes.events[0][0]).to.equal(passes.city);
      expect(passes.events[0][1]).to.equal(passes.polluted()[0]);

      const fails = await setUp(1, [20.5 / 256, 0]);

      fails.processTurn(30);

      expect(fails.polluted().length).to.equal(0);
      expect(fails.events.length).to.equal(0);
    });

    it('never pollutes without points', async (): Promise<void> => {
      const { events, processTurn } = await setUp(1, [0, 0]);

      processTurn(20);

      expect(events.length).to.equal(0);
    });

    it("doesn't pollute Ocean, a city or a polluted square, and doesn't roll again", async (): Promise<void> => {
      for (const prepare of [
        (tile: Tile): void => tile.setTerrain(new Ocean()),
        (tile: Tile, { cityRegistry, ruleRegistry, city }: any): void =>
          cityRegistry.register(
            new City(city.player(), tile, 'B', ruleRegistry)
          ),
        (tile: Tile, { ruleRegistry }: any): void =>
          void new Pollution(tile, ruleRegistry),
      ]) {
        const setup = await setUp(1, [0, 0, 0, 0]),
          [first] = setup.city
            .tiles()
            .entries()
            .filter((tile: Tile): boolean => tile !== setup.city.tile());

        prepare(first, setup);

        const before = setup.polluted().length;

        setup.processTurn(30);

        expect(setup.events.length).to.equal(0);
        expect(setup.polluted().length).to.equal(before);
      }
    });
  });
});
