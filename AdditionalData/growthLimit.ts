import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import AdditionalData from '@civ-clone/core-data-object/AdditionalData';
import CityGrowth from '@civ-clone/core-city-growth/CityGrowth';
import {
  GrowthLimitData,
  growthLimitData,
} from '@civ-clone/base-city-growth-limit/lib/growthLimit';
import { growthLimits } from '../lib/growthLimit';

// `size` is the limit itself: a city can be past it (captured, or joined by Settlers), and still not grow without
//  `needs`.
export type GrowthLimit = GrowthLimitData;

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
    (cityGrowth: CityGrowth): GrowthLimit | null =>
      growthLimitData(cityGrowth, growthLimits, cityImprovementRegistry)
  ),
];

export default getAdditionalData;
