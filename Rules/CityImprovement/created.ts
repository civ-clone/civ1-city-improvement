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
import Effect from '@civ-clone/core-rule/Effect';

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
  new Created(
    new Effect((cityImprovement: CityImprovement, city: City): void => {
      engine.emit('city-improvement:created', cityImprovement, city);
    })
  ),
];

export default getRules;
