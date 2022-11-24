import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import Captured from '@civ-clone/core-city/Rules/Captured';
import City from '@civ-clone/core-city/City';
import Effect from '@civ-clone/core-rule/Effect';
import { Palace } from '../../CityImprovements';
import Wonder from '@civ-clone/core-wonder/Wonder';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  randomNumberGenerator?: () => number
) => Captured[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  randomNumberGenerator: () => number = () => Math.random()
): Captured[] => [
  new Captured(
    new Effect((capturedCity: City): void => {
      const cityImprovements = cityImprovementRegistry
          .getByCity(capturedCity)
          .filter((cityImprovement) => !(cityImprovement instanceof Wonder)),
        [palace] = cityImprovements.filter(
          (cityImprovement) => cityImprovement instanceof Palace
        );

      if (palace) {
        palace.destroy();

        cityImprovements.splice(cityImprovements.indexOf(palace), 1);
      }

      while (cityImprovements.length > 0 && randomNumberGenerator() > 0.7) {
        const randomImprovement =
          cityImprovements[
            Math.floor(randomNumberGenerator() * cityImprovements.length)
          ];

        if (!randomImprovement) {
          break;
        }

        randomImprovement.destroy();

        cityImprovements.splice(cityImprovements.indexOf(randomImprovement), 1);
      }
    })
  ),
];

export default getRules;
