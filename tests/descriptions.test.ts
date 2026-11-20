import * as CityImprovements from '../CityImprovements';
import { EffectDescription } from '@civ-clone/core-rule/Description';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Rule from '@civ-clone/core-rule/Rule';
import Yield from '@civ-clone/core-yield/Yield';
import { expect } from 'chai';
import cost from '../Rules/City/cost';
import grow from '../Rules/City/grow';
import pollution from '../Rules/City/pollution';
import pollutionDivisor from '../Rules/City/pollution-divisor';
import unitCreated from '../Rules/Unit/created';
import yieldModifier from '../Rules/City/yield-modifier';

// What the rules say they do, for the Civilopedia (civ-clone/web-renderer#1196), checked against what they do.

type Class = Function & { name: string };

// A registry where every city has `improvements`, made without a city, as the rules only ask `instanceof`.
const registryOf = (...improvements: Class[]): any => ({
    getByCity: (): CityImprovement[] =>
      improvements.map((Improvement) => Object.create(Improvement.prototype)),
  }),
  described = (rules: Rule[]): [Rule, EffectDescription][] =>
    rules.flatMap((rule: Rule) =>
      rule
        .descriptions()
        .map((description): [Rule, EffectDescription] => [rule, description])
    ),
  city: any = { player: (): null => null };

describe('descriptions', (): void => {
  it('a yield modifier adds the share of the yield it says it does', (): void => {
    const cases = described(yieldModifier(registryOf()));

    expect(cases.length).to.be.greaterThan(0);

    cases.forEach(([, description]): void => {
      expect(description.type).to.equal('yield_percent');

      const Subject = description.subject as Class,
        YieldType = description.yield as typeof Yield,
        needed = (description.needs as Class[] | undefined) ?? [],
        // One of each it needs: a plant needs a Factory or a Mfg. Plant, and a Factory adds twice a plant's share.
        [rule] = yieldModifier(registryOf(Subject, ...needed.slice(-1))).filter(
          (rule: Rule) =>
            rule
              .descriptions()
              .some(
                (other) =>
                  other.subject === Subject && other.yield === YieldType
              )
        ),
        given = [new YieldType(40)],
        result = rule.process(city, given, given) as Yield;

      expect(rule.validate(city, given, given)).to.true;
      expect(result).to.instanceOf(YieldType);
      expect(Math.abs(result.value())).to.equal(
        Math.floor(40 * Math.abs(description.value as number))
      );
    });
  });

  it('an improvement costs the upkeep it says it does', (): void => {
    const cases = described(cost(registryOf()));

    cases.forEach(([rule, description]): void => {
      expect(description.type).to.equal('upkeep');

      const [ruled] = cost(registryOf(description.subject as Class)).filter(
          (other: Rule) =>
            other.descriptions()[0].subject === description.subject &&
            other.descriptions()[0].from === description.from
        ),
        result = ruled.process(city) as Yield;

      // Upkeep is gold lost, so it is counted below 0.
      expect(result.value()).to.equal(-(description.value as number));
      expect(result).to.instanceOf(description.yield as typeof Yield);
      expect(rule.descriptions()).to.have.length(1);
    });
  });

  it('every Civ1 improvement says what it costs to keep', (): void => {
    const subjects = described(cost(registryOf())).map(
      ([, description]) => description.subject
    );

    Object.values(CityImprovements).forEach((Improvement): void => {
      expect(subjects, Improvement.name).to.include(Improvement);
    });
  });

  it('a Granary keeps the share of the food box it says it does', (): void => {
    const [[rule, description]] = described(
        grow(registryOf(CityImprovements.Granary))
      ).filter(([, description]) => description.type === 'growth_store'),
      added: Yield[] = [];

    rule.process(
      {
        city: () => city,
        cost: () => ({ value: () => 30 }),
        add: (value: Yield) => added.push(value),
      } as any,
      null
    );

    expect(description.subject).to.equal(CityImprovements.Granary);
    expect(added.map((value) => value.value())).to.eql([
      30 * (description.value as number),
    ]);
  });

  it('an Aqueduct lifts the size limit it says it does', (): void => {
    const descriptions = described(grow(registryOf())).filter(
      ([, description]) => description.type === 'size_limit'
    );

    expect(descriptions.map(([, description]) => description)).to.eql([
      { type: 'size_limit', subject: CityImprovements.Aqueduct, value: 10 },
    ]);
  });

  it('a pollution divisor divides by what it says it does', (): void => {
    described(pollutionDivisor(registryOf())).forEach(
      ([rule, description]): void => {
        expect(description.type).to.equal('pollution_divisor');
        expect(rule.process(city)).to.equal(description.value);
      }
    );
  });

  it('Mass Transit stops the population polluting, on the rule that rolls for pollution', (): void => {
    expect(described(pollution()).map(([, description]) => description)).to.eql(
      [
        {
          type: 'pollution_source_removed',
          subject: CityImprovements.MassTransit,
          source: 'population',
        },
      ]
    );
  });

  it('Barracks give the unit improvement they say they do', (): void => {
    const registered: unknown[] = [],
      [[rule, description]] = described(
        unitCreated(registryOf(CityImprovements.Barracks), {
          register: (improvement: unknown) => registered.push(improvement),
        } as any)
      );

    rule.process({ city: () => city } as any);

    expect(description.type).to.equal('unit_improvement');
    expect(registered).to.have.length(1);
    expect(registered[0]).to.instanceOf(description.improvement as Class);
  });
});
