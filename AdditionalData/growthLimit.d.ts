import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import AdditionalData from '@civ-clone/core-data-object/AdditionalData';
export type GrowthLimit = {
  size: number;
  needs: string;
};
/**
 * What the city needs before it can grow past its size (`lib/growthLimit`), so a renderer can say so rather than count
 * the turns to a growth that won't happen (civ-clone/web-renderer#781). `needs` is the improvement's type name. `null`
 * when nothing holds the city back.
 */
export declare const getAdditionalData: (
  cityImprovementRegistry?: CityImprovementRegistry
) => AdditionalData[];
export default getAdditionalData;
