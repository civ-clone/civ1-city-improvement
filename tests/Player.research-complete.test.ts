import {
  Automobile,
  Combustion,
  Gunpowder,
} from '@civ-clone/civ1-science/Advances';
import { Barracks, Temple } from '../CityImprovements';
import Advance from '@civ-clone/core-science/Advance';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Engine from '@civ-clone/core-engine/Engine';
import Player from '@civ-clone/core-player/Player';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { expect } from 'chai';
import researchComplete from '../Rules/Player/research-complete';
import setUpCity from '@civ-clone/civ1-city/tests/lib/setUpCity';

describe('Player.research-complete', (): void => {
  const setUp = async () => {
    const ruleRegistry = new RuleRegistry(),
      advanceRegistry = new AdvanceRegistry(),
      cityImprovementRegistry = new CityImprovementRegistry(),
      cityRegistry = new CityRegistry(),
      engine = new Engine(),
      events: [Player, Advance, typeof CityImprovement, CityImprovement[]][] =
        [],
      [playerResearch, rivalResearch] = [
        new Player(ruleRegistry),
        new Player(ruleRegistry),
      ].map(
        (player: Player): PlayerResearch =>
          new PlayerResearch(player, advanceRegistry, ruleRegistry)
      ),
      [city1, city2, rivalCity] = await Promise.all(
        [
          playerResearch.player(),
          playerResearch.player(),
          rivalResearch.player(),
        ].map(
          (player: Player): Promise<City> =>
            setUpCity({
              player,
              ruleRegistry,
              // Each city gets a world of its own, so each needs its own `PlayerWorld`.
              playerWorldRegistry: new PlayerWorldRegistry(),
            })
        )
      ),
      [barracks1, barracks2, rivalBarracks] = [city1, city2, rivalCity].map(
        (city: City): CityImprovement => new Barracks(city, ruleRegistry)
      ),
      temple = new Temple(city1, ruleRegistry);

    ruleRegistry.register(
      ...researchComplete(cityImprovementRegistry, cityRegistry, engine)
    );

    cityRegistry.register(city1, city2, rivalCity);
    cityImprovementRegistry.register(
      barracks1,
      barracks2,
      rivalBarracks,
      temple
    );

    engine.on('city-improvement:obsolete', (...args) =>
      events.push(
        args as [Player, Advance, typeof CityImprovement, CityImprovement[]]
      )
    );

    return {
      barracks1,
      barracks2,
      city1,
      city2,
      cityImprovementRegistry,
      events,
      playerResearch,
      rivalBarracks,
      rivalResearch,
      ruleRegistry,
      temple,
    };
  };

  ([Gunpowder, Combustion] as (typeof Advance)[]).forEach(
    (ObsoletingAdvance): void => {
      it(`should remove the discovering player's Barracks on discovering ${ObsoletingAdvance.name}`, async (): Promise<void> => {
        const {
          barracks1,
          barracks2,
          events,
          playerResearch,
          rivalBarracks,
          temple,
        } = await setUp();

        playerResearch.addAdvance(ObsoletingAdvance);

        expect(barracks1.destroyed()).to.true;
        expect(barracks2.destroyed()).to.true;
        expect(temple.destroyed()).to.false;
        expect(rivalBarracks.destroyed()).to.false;

        expect(events.length).to.equal(1);

        const [[player, advance, ImprovementType, removed]] = events;

        expect(player).to.equal(playerResearch.player());
        expect(advance).to.instanceof(ObsoletingAdvance);
        expect(ImprovementType).to.equal(Barracks);
        expect(removed).to.have.members([barracks1, barracks2]);
      });
    }
  );

  it('should remove rebuilt Barracks again on discovering Combustion', async (): Promise<void> => {
    const {
      city1,
      cityImprovementRegistry,
      events,
      playerResearch,
      ruleRegistry,
    } = await setUp();

    playerResearch.addAdvance(Gunpowder);

    const rebuilt = new Barracks(city1, ruleRegistry);

    cityImprovementRegistry.register(rebuilt);

    expect(rebuilt.destroyed()).to.false;

    playerResearch.addAdvance(Combustion);

    expect(rebuilt.destroyed()).to.true;
    expect(events.length).to.equal(2);
    expect(events[1][3]).to.have.members([rebuilt]);
  });

  it('should still announce the obsolescence when there are no Barracks to remove', async (): Promise<void> => {
    const { events, rivalResearch } = await setUp();

    rivalResearch.addAdvance(Gunpowder);
    rivalResearch.addAdvance(Combustion);

    expect(events.length).to.equal(2);

    const [player, advance, , removed] = events[1];

    expect(player).to.equal(rivalResearch.player());
    expect(advance).to.instanceof(Combustion);
    expect(removed).to.be.empty;
  });

  it('should leave Barracks alone on discovering other advances', async (): Promise<void> => {
    const { barracks1, events, playerResearch } = await setUp();

    playerResearch.addAdvance(Automobile);

    expect(barracks1.destroyed()).to.false;
    expect(events).to.be.empty;
  });
});
