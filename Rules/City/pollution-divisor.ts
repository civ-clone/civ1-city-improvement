import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  HydroPlant,
  NuclearPlant,
  RecyclingCenter,
} from '../../CityImprovements';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import PollutionDivisor from '../PollutionDivisor';

// A Hydro or Nuclear Plant halves the shields that count towards pollution, and a Recycling Center thirds them in
//  place of that (v474.05 `CityWorker.cs` ~L714-761).
export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry
) => PollutionDivisor[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): PollutionDivisor[] =>
  (
    [
      [HydroPlant, 2],
      [NuclearPlant, 2],
      [RecyclingCenter, 3],
    ] as [typeof CityImprovement, number][]
  ).map(
    ([Improvement, divisor]): PollutionDivisor =>
      new PollutionDivisor(
        `civ1-city-improvement:city/pollution-divisor/${Improvement.name}`,
        new Criterion((city: City): boolean =>
          cityImprovementRegistry
            .getByCity(city)
            .some(
              (cityImprovement: CityImprovement): boolean =>
                cityImprovement instanceof Improvement
            )
        ),
        new Effect((): number => divisor)
      )
  );

export default getRules;
