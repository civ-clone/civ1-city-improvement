import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Aqueduct } from '../CityImprovements';
import CityGrowth from '@civ-clone/core-city-growth/CityGrowth';
/** The largest a city grows without an Aqueduct, as v474.05. */
export declare const aqueductSizeLimit: number;
/**
 * What a city needs before it can grow any larger: `Aqueduct` once it has reached `aqueductSizeLimit` without one, or
 * `null` when nothing holds it back. The `Grow` rule that shrinks it back (`Rules/City/grow`) and the data a renderer
 * is sent (`AdditionalData/growthLimit`) both read this, so they can't disagree (civ-clone/web-renderer#781).
 */
export declare const growthLimit: (
  cityGrowth: CityGrowth,
  cityImprovementRegistry?: CityImprovementRegistry
) => typeof Aqueduct | null;
export default growthLimit;
