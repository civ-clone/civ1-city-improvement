import {
  Aqueduct,
  Barracks,
  CityWalls,
  Courthouse,
  Factory,
  Granary,
  Library,
  Marketplace,
  PowerPlant,
  Temple,
} from '../CityImprovements';
import {
  Corruption,
  Food,
  Gold,
  Production,
  Research,
  Unhappiness,
} from '@civ-clone/library-city/Yields';
import BuildPriority from '@civ-clone/core-city-build/Rules/BuildPriority';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityGrowthRegistry from '@civ-clone/core-city-growth/CityGrowthRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import InteractionRegistry from '@civ-clone/core-diplomacy/InteractionRegistry';
import { Never } from '@civ-clone/core-diplomacy/Expiries';
import Peace from '@civ-clone/base-diplomacy-declaration-peace/Peace';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import buildPriority from '../Rules/City/build-priority';
import { expect } from 'chai';

describe('city:build-priority', (): void => {
  const setUp = (size: number = 4) => {
    const ruleRegistry = new RuleRegistry(),
      cityImprovementRegistry = new CityImprovementRegistry(),
      interactionRegistry = new InteractionRegistry(),
      playerResearchRegistry = new PlayerResearchRegistry(),
      player = new Player(ruleRegistry),
      enemy = new Player(ruleRegistry),
      nearby = {} as Tile,
      nearbyUnits: Unit[] = [],
      city = {
        player: (): Player => player,
        tile: () => ({
          getSurroundingArea: () => ({ entries: (): Tile[] => [nearby] }),
        }),
      } as unknown as City,
      cityBuild = { city: (): City => city } as unknown as CityBuild;

    playerResearchRegistry.register(new PlayerResearch(player, ruleRegistry));

    ruleRegistry.register(
      ...buildPriority(
        {
          getByCity: () => ({ size: (): number => size }),
        } as unknown as CityGrowthRegistry,
        cityImprovementRegistry,
        interactionRegistry,
        playerResearchRegistry,
        { getByTile: () => null } as unknown as CityRegistry,
        {
          getByTile: (tile: Tile): Unit[] =>
            tile === nearby ? nearbyUnits : [],
        } as unknown as UnitRegistry
      )
    );

    const score = (Item: typeof CityImprovement, ...yields: Yield[]): number =>
      ruleRegistry
        .process(BuildPriority, cityBuild, Item as any, yields)
        .reduce((total: number, value: number): number => total + value, 0);

    return {
      city,
      cityImprovementRegistry,
      enemy,
      interactionRegistry,
      nearbyUnits,
      player,
      ruleRegistry,
      score,
    };
  };

  it('should not want a Granary in a city with Food to spare when it could use something else', (): void => {
    const { score } = setUp(),
      yields = [new Food(5), new Research(6), new Gold(4)];

    expect(score(Library, ...yields)).greaterThan(score(Granary, ...yields));
  });

  it('should want a Granary most in a city short of Food', (): void => {
    const { score } = setUp(),
      yields = [new Food(-1), new Research(2), new Gold(2)];

    expect(score(Granary, ...yields)).greaterThan(score(Library, ...yields));
    expect(score(Granary, ...yields)).greaterThan(
      score(Marketplace, ...yields)
    );
  });

  it('should want an Aqueduct as a city nears the size it needs one for, sooner with Food to spare', (): void => {
    expect(setUp(5).score(Aqueduct, new Food(2), new Gold(2))).equal(0);
    expect(setUp(6).score(Aqueduct, new Food(4), new Gold(2))).greaterThan(0);
    expect(setUp(9).score(Aqueduct, new Food(2), new Gold(2))).greaterThan(
      setUp(8).score(Aqueduct, new Food(2), new Gold(2))
    );
  });

  it('should want a Temple for unhappy citizens', (): void => {
    const { score } = setUp(3);

    expect(score(Temple, new Gold(2))).lessThan(
      score(Temple, new Unhappiness(1), new Gold(2))
    );
    expect(score(Temple, new Unhappiness(2), new Gold(2))).greaterThan(
      score(Library, new Unhappiness(2), new Research(4), new Gold(2))
    );
  });

  it('should want a plant only in a city with a Factory', (): void => {
    const { city, cityImprovementRegistry, ruleRegistry, score } = setUp(),
      yields = [new Production(12), new Gold(4)];

    expect(score(PowerPlant, ...yields)).equal(0);

    cityImprovementRegistry.register(new Factory(city, ruleRegistry));

    expect(score(PowerPlant, ...yields)).greaterThan(0);
  });

  it('should want Barracks and City Walls before anything else with an enemy near, and not at all in peace', (): void => {
    const {
        enemy,
        interactionRegistry,
        nearbyUnits,
        player,
        ruleRegistry,
        score,
      } = setUp(),
      yields = [new Food(0), new Unhappiness(3), new Research(8), new Gold(4)],
      others = [Granary, Temple, Library, Marketplace].map((Item) =>
        score(Item, ...yields)
      );

    expect(score(Barracks, ...yields)).equal(0);
    expect(score(CityWalls, ...yields)).equal(0);

    nearbyUnits.push({ player: () => player } as unknown as Unit);

    expect(score(CityWalls, ...yields)).equal(0);

    nearbyUnits.push({ player: () => enemy } as unknown as Unit);

    [Barracks, CityWalls].forEach((Item): void => {
      expect(score(Item, ...yields)).greaterThan(Math.max(...others));
    });

    interactionRegistry.register(
      new Peace(player, enemy, new Never(), ruleRegistry)
    );

    expect(score(Barracks, ...yields)).equal(0);
  });

  it('should want a Courthouse for what a city loses to corruption', (): void => {
    const { score } = setUp();

    expect(score(Courthouse, new Corruption(-4), new Gold(2))).greaterThan(
      score(Courthouse, new Corruption(-1), new Gold(2))
    );
  });

  it('should want an everyday improvement a little, whatever the city needs, but not one only needed at times', (): void => {
    const { score } = setUp(1),
      yields = [new Food(2), new Gold(2)];

    [Granary, Library, Marketplace, Temple].forEach((Item): void => {
      expect(score(Item, ...yields)).greaterThan(0);
    });
    [Aqueduct, Barracks, CityWalls, Factory, PowerPlant].forEach(
      (Item): void => {
        expect(score(Item, ...yields)).equal(0);
      }
    );
  });

  it('should want an improvement less the more of what the city makes in gold it would cost to keep', (): void => {
    const { score } = setUp();

    expect(score(Library, new Research(6), new Gold(1))).lessThan(
      score(Library, new Research(6), new Gold(10))
    );
  });
});
