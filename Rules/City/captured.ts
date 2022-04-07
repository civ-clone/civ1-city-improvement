import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import Captured from '@civ-clone/core-city/Rules/Captured';
import City from '@civ-clone/core-city/City';
import Effect from '@civ-clone/core-rule/Effect';
import { Palace } from '../../CityImprovements';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry
) => Captured[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): Captured[] => [
  new Captured(
    new Effect((capturedCity: City): void => {
      const [palace] = cityImprovementRegistry
        .getByCity(capturedCity)
        .filter((cityImprovement) => cityImprovement instanceof Palace);

      if (!palace) {
        return;
      }

      cityImprovementRegistry.unregister(palace);
    })
  ),
];

export default getRules;
