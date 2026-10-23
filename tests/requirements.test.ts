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
  Temple,
} from '../CityImprovements';
import {
  Banking,
  CeremonialBurial,
  Industrialization,
  Refining,
} from '@civ-clone/civ1-science/Advances';
import {
  buildRequirements,
  describedRequirements,
  excludedBy,
  hydroPlantSite,
  notBuilt,
  requiresImprovement,
} from '../Requirements';
import Build from '@civ-clone/core-city-build/Rules/Build';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import { Game } from '@civ-clone/core-game/Game';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import { Requirement } from '@civ-clone/core-requirement/Requirement';
import Rule from '@civ-clone/core-rule/Rule';
import { expect } from 'chai';
import getRules from '../Rules/City/build';
import register from '../registerRules';

// Through `register(game)`, as a game gets them: the entries in `game.requirements`, and the rules made from them in
//  `game.rules` under the same ids (civ-clone/web-renderer#37).
const setUp = () => {
  const game = new Game();

  register(game);

  const player = new Player(game.rules),
    research = new PlayerResearch(player, game.advances, game.rules),
    city = { player: () => player } as unknown as City;

  game.playerResearch.register(research);

  // Whether every one of `game`'s build rules about `Item` lets `city` build it.
  const canBuild = (Item: Function): boolean =>
    game.rules
      .get(Build)
      .filter((rule: Build): boolean => rule.validate(city, Item as any))
      .every((rule: Build): boolean =>
        rule.process(city, Item as any).validate()
      );

  // Gives `city` an improvement of the type `Improvement`.
  const add = (Improvement: typeof CityImprovement): CityImprovement => {
    const improvement = new Improvement(city, game.rules);

    game.cityImprovements.register(improvement);

    return improvement;
  };

  return { add, canBuild, game, research };
};

const ids = (rules: Rule[]): (string | null)[] =>
  rules.map((rule: Rule): string | null => rule.id());

describe('civ1-city-improvement requirements', (): void => {
  it('should make one build rule for each entry that needs one, under its id, and none for the others', (): void => {
    const { game } = setUp();

    buildRequirements.forEach((entry: Requirement): void => {
      const rules = game.requirements.rulesFor(entry.id);

      expect(rules, entry.id).length(1);
      expect(rules[0], entry.id).instanceOf(Build);
      expect(game.rules.getById(entry.id), entry.id).equal(rules[0]);
    });

    describedRequirements.forEach((entry: Requirement): void => {
      expect(game.requirements.rulesFor(entry.id), entry.id).eql([]);
    });

    // The not-built and Hydro Plant site rules are still the hand-written ones.
    expect(game.rules.getById(notBuilt.id)).instanceOf(Build);
    expect(game.rules.getById(hydroPlantSite.id)).instanceOf(Build);
  });

  it('should have an entry for every build rule it registers', (): void => {
    const { game } = setUp(),
      buildRuleIds = ids(game.rules.get(Build));

    expect(buildRuleIds.length).equal(2 + buildRequirements.length);
    buildRuleIds.forEach((id: string | null): void => {
      expect(game.requirements.getById(id as string), id as string).not.null;
    });
  });

  it('should register the rules in the order they always were', (): void => {
    const { game } = setUp();

    // The build rules' ids in the order `Rules/City/build` registered them before they were made from entries,
    //  written out rather than read from the same entries, so a reordered table fails here.
    expect(ids(game.rules.get(Build))).eql(ids(getRules()));
    expect(ids(getRules())).eql([
      'civ1-city-improvement:city/build/not-built',
      'civ1-city-improvement:city/build/requires-advance/Aqueduct',
      'civ1-city-improvement:city/build/requires-advance/CityWalls',
      'civ1-city-improvement:city/build/requires-advance/Colosseum',
      'civ1-city-improvement:city/build/requires-advance/Courthouse',
      'civ1-city-improvement:city/build/requires-advance/Granary',
      'civ1-city-improvement:city/build/requires-advance/Library',
      'civ1-city-improvement:city/build/requires-advance/Marketplace',
      'civ1-city-improvement:city/build/requires-advance/Palace',
      'civ1-city-improvement:city/build/requires-advance/Temple',
      'civ1-city-improvement:city/build/requires-advance/Bank',
      'civ1-city-improvement:city/build/requires-advance/Cathedral',
      'civ1-city-improvement:city/build/requires-advance/Factory',
      'civ1-city-improvement:city/build/requires-advance/HydroPlant',
      'civ1-city-improvement:city/build/requires-advance/MassTransit',
      'civ1-city-improvement:city/build/requires-advance/ManufacturingPlant',
      'civ1-city-improvement:city/build/requires-advance/NuclearPlant',
      'civ1-city-improvement:city/build/requires-advance/PowerPlant',
      'civ1-city-improvement:city/build/requires-advance/RecyclingCenter',
      'civ1-city-improvement:city/build/requires-advance/SdiDefence',
      'civ1-city-improvement:city/build/requires-advance/University',
      'civ1-city-improvement:city/build/requires-improvement/Bank',
      'civ1-city-improvement:city/build/requires-improvement/University',
      'civ1-city-improvement:city/build/requires-improvement/PowerPlant',
      'civ1-city-improvement:city/build/excluded-by/Courthouse',
      'civ1-city-improvement:city/build/excluded-by/Factory',
      'civ1-city-improvement:city/build/excluded-by/HydroPlant',
      'civ1-city-improvement:city/build/excluded-by/NuclearPlant',
      'civ1-city-improvement:city/build/excluded-by/PowerPlant',
      'civ1-city-improvement:city/build/hydro-plant-site',
    ]);
  });

  it('should say whose improvements count, and how many of them', (): void => {
    [...requiresImprovement, ...excludedBy].forEach(
      (entry: Requirement): void => {
        expect(entry.mode, entry.id).equal('any');
        expect(entry.range, entry.id).equal('city');
      }
    );
  });

  it('should read the graph both ways', (): void => {
    const { game } = setUp();

    expect(
      game.requirements
        .for(PowerPlant)
        .map((entry: Requirement): string => entry.id)
    ).eql([
      'civ1-city-improvement:city/build/requires-advance/PowerPlant',
      'civ1-city-improvement:city/build/requires-improvement/PowerPlant',
      'civ1-city-improvement:city/build/excluded-by/PowerPlant',
      'civ1-city-improvement:city/build/not-built',
    ]);
    expect(
      game.requirements
        .leadsTo(Factory)
        .map((entry: Requirement): string => entry.id)
    ).eql(['civ1-city-improvement:city/build/requires-improvement/PowerPlant']);
    expect(
      game.requirements
        .leadsTo(NuclearPlant)
        .map((entry: Requirement): string => entry.id)
    ).eql([
      'civ1-city-improvement:city/build/excluded-by/HydroPlant',
      'civ1-city-improvement:city/build/excluded-by/PowerPlant',
    ]);
    expect(
      game.requirements
        .for(HydroPlant)
        .map((entry: Requirement): string => entry.id)
    ).include('civ1-city-improvement:city/build/hydro-plant-site');
  });

  it('should build as the entries say', (): void => {
    const { add, canBuild, research } = setUp();

    expect(canBuild(Temple)).false;

    research.addAdvance(CeremonialBurial);

    expect(canBuild(Temple)).true;

    add(Temple);

    expect(canBuild(Temple)).false;

    research.addAdvance(Industrialization);
    research.addAdvance(Refining);

    expect(canBuild(Factory)).true;
    expect(canBuild(PowerPlant)).false;

    add(Factory);

    expect(canBuild(PowerPlant)).true;

    add(NuclearPlant);

    expect(canBuild(PowerPlant)).false;

    add(Palace);

    expect(canBuild(Courthouse)).false;
  });

  it('should change what a city can build when a plugin changes an entry', (): void => {
    const { add, canBuild, game, research } = setUp();

    game.requirements.replace(
      'civ1-city-improvement:city/build/requires-improvement/Bank',
      new Requirement({
        id: 'civ1-city-improvement:city/build/requires-improvement/Bank',
        subject: Bank,
        relation: 'requires',
        targets: [Marketplace, Library],
        mode: 'all',
        range: 'city',
      })
    );
    game.requirements.remove(
      'civ1-city-improvement:city/build/excluded-by/Factory'
    );

    research.addAdvance(Banking);
    research.addAdvance(Industrialization);
    add(Marketplace);
    add(ManufacturingPlant);

    expect(canBuild(Bank)).false;
    expect(canBuild(Factory)).true;

    add(Library);

    expect(canBuild(Bank)).true;
  });
});
