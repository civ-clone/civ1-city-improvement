import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Destroyed from '@civ-clone/core-city/Rules/Destroyed';
import Effect from '@civ-clone/core-rule/Effect';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry
) => Destroyed[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): Destroyed[] => [
  new Destroyed(
    new Criterion(
      (city: City): boolean =>
        cityImprovementRegistry.getByCity(city).length > 0
    ),
    new Effect((city: City): void =>
      cityImprovementRegistry
        .getByCity(city)
        .forEach((cityImprovement) => cityImprovement.destroy())
    )
  ),
];

export default getRules;
