import {
  Aqueduct,
  Bank,
  Barracks,
  Cathedral,
  CityWalls,
  Colosseum,
  Courthouse,
  Factory,
  Granary,
  HydroPlant,
  Library,
  ManufacturingPlant,
  Marketplace,
  MassTransit,
  NuclearPlant,
  Palace,
  PowerPlant,
  RecyclingCenter,
  SdiDefence,
  Temple,
  University,
} from '../../CityImprovements';
import {
  BuildCost,
  buildCost,
} from '@civ-clone/core-city-build/Rules/BuildCost';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Buildable from '@civ-clone/core-city-build/Buildable';

export const getRules: () => BuildCost[] = () => [
  ...(
    [
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
      [Bank, 120],
      [Cathedral, 160],
      [Factory, 200],
      [HydroPlant, 240],
      [MassTransit, 160],
      [ManufacturingPlant, 320],
      [NuclearPlant, 160],
      [PowerPlant, 160],
      [RecyclingCenter, 200],
      [SdiDefence, 200],
      [University, 160],
    ] as [typeof CityImprovement, number][]
  ).flatMap(
    ([CityImprovementType, cost]: [
      typeof CityImprovement,
      number
    ]): BuildCost[] =>
      buildCost(CityImprovementType as unknown as typeof Buildable, cost)
  ),
];

export default getRules;
