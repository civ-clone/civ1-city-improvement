import {
  Aqueduct,
  Barracks,
  CityWalls,
  Colosseum,
  Courthouse,
  Granary,
  Library,
  Marketplace,
  Palace,
  Temple,
} from '../../CityImprovements';
import {
  BuildCost,
  buildCost,
} from '@civ-clone/core-city-build/Rules/BuildCost';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';

export const getRules: () => BuildCost[] = () => [
  ...([
    [Aqueduct, 120],
    [Barracks, 40],
    [CityWalls, 120],
    [Colosseum, 100],
    [Courthouse, 80],
    [Granary, 60],
    [Library, 80],
    [Marketplace, 80],
    [Palace, 200],
    [Temple, 40],
  ] as [
    typeof CityImprovement,
    number
  ][]).flatMap(
    ([CityImprovementType, cost]: [
      typeof CityImprovement,
      number
    ]): BuildCost[] => buildCost(CityImprovementType, cost)
  ),
];

export default getRules;
