import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Aqueduct } from '../CityImprovements';
import CityGrowth from '@civ-clone/core-city-growth/CityGrowth';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';

/** The largest a city grows without an Aqueduct, as v474.05. */
export const aqueductSizeLimit: number = 10;

/**
 * What a city needs before it can grow any larger: `Aqueduct` once it has reached `aqueductSizeLimit` without one, or
 * `null` when nothing holds it back. The `Grow` rule that shrinks it back (`Rules/City/grow`) and the data a renderer
 * is sent (`AdditionalData/growthLimit`) both read this, so they can't disagree (civ-clone/web-renderer#781).
 */
export const growthLimit = (
  cityGrowth: CityGrowth,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): typeof Aqueduct | null =>
  cityGrowth.size() >= aqueductSizeLimit &&
  !cityImprovementRegistry
    .getByCity(cityGrowth.city())
    .some(
      (improvement: CityImprovement): boolean => improvement instanceof Aqueduct
    )
    ? Aqueduct
    : null;

export default growthLimit;
