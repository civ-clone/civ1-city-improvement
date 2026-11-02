import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import AdditionalData from '@civ-clone/core-data-object/AdditionalData';
import CityGrowth from '@civ-clone/core-city-growth/CityGrowth';
import growthLimit, { aqueductSizeLimit } from '../lib/growthLimit';
import { typeNameOf } from '@civ-clone/core-data-object/DataObject';

// `size` is the largest the city grows without `needs`.
export type GrowthLimit = { size: number; needs: string };

/**
 * What the city needs before it can grow past its size (`lib/growthLimit`), so a renderer can say so rather than count
 * the turns to a growth that won't happen (civ-clone/web-renderer#781). `needs` is the improvement's type name. `null`
 * when nothing holds the city back.
 */
export const getAdditionalData = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance
): AdditionalData[] => [
  new AdditionalData(
    CityGrowth,
    'limit',
    (cityGrowth: CityGrowth): GrowthLimit | null => {
      const needs = growthLimit(cityGrowth, cityImprovementRegistry);

      return needs === null
        ? null
        : { size: aqueductSizeLimit, needs: typeNameOf(needs) };
    }
  ),
];

export default getAdditionalData;
