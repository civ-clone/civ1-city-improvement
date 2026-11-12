import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  GrowthLimit,
  growthLimit as reachedGrowthLimit,
} from '@civ-clone/base-city-growth-limit/lib/growthLimit';
import { Aqueduct } from '../CityImprovements';
import CityGrowth from '@civ-clone/core-city-growth/CityGrowth';

/** The largest a city grows without an Aqueduct, as v474.05. */
export const aqueductSizeLimit: number = 10;

/** Civ1's one size cap, as `base-city-growth-limit` reads it. */
export const growthLimits: GrowthLimit<typeof Aqueduct>[] = [
  [aqueductSizeLimit, Aqueduct],
];

/**
 * What a city needs before it can grow any larger: `Aqueduct` once it has reached `aqueductSizeLimit` without one, or
 * `null` when nothing holds it back. The `Grow` rule that shrinks it back (`Rules/City/grow`) and the data a renderer
 * is sent (`AdditionalData/growthLimit`) both read `growthLimits`, so they can't disagree
 * (civ-clone/web-renderer#781).
 */
export const growthLimit = (
  cityGrowth: CityGrowth,
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): typeof Aqueduct | null =>
  reachedGrowthLimit(cityGrowth, growthLimits, cityImprovementRegistry)?.[1] ??
  null;

export default growthLimit;
