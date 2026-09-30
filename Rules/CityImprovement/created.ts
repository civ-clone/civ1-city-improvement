import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Created from '@civ-clone/core-city-improvement/Rules/Created';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Palace } from '../../CityImprovements';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  engine?: Engine
) => Created[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  engine: Engine = engineInstance
): Created[] => [
  new Created(
    new Effect((cityImprovement: CityImprovement): void =>
      cityImprovementRegistry.register(cityImprovement)
    )
  ),
  // Building a Palace moves the capital: the player's old Palace is removed.
  new Created(
    new Criterion(
      (cityImprovement: CityImprovement): boolean =>
        cityImprovement instanceof Palace
    ),
    new Effect((palace: CityImprovement, city: City): void =>
      cityImprovementRegistry
        .filter(
          (cityImprovement: CityImprovement): boolean =>
            cityImprovement instanceof Palace &&
            cityImprovement !== palace &&
            !cityImprovement.destroyed() &&
            cityImprovement.city().player() === city.player()
        )
        .forEach((oldPalace: CityImprovement): void => oldPalace.destroy())
    )
  ),
  new Created(
    new Effect((cityImprovement: CityImprovement, city: City): void => {
      engine.emit('city-improvement:created', cityImprovement, city);
    })
  ),
];

export default getRules;
