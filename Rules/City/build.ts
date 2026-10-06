import {
  Aqueduct,
  Bank,
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
  Banking,
  CeremonialBurial,
  CodeOfLaws,
  Construction,
  Currency,
  Electronics,
  Industrialization,
  Masonry,
  MassProduction,
  NuclearPower,
  Pottery,
  Recycling,
  Refining,
  Religion,
  Robotics,
  Superconductor,
  University as UniversityAdvance,
  Writing,
} from '@civ-clone/civ1-science/Advances';
import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import { Mountains, River } from '@civ-clone/civ1-world/Terrains';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import Advance from '@civ-clone/core-science/Advance';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Tile from '@civ-clone/core-world/Tile';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  playerResearchRegistry?: PlayerResearchRegistry
) => Build[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): Build[] => [
  new Build(
    new Effect(
      (city: City, BuildItem: IConstructor): IBuildCriterion =>
        new Criterion(
          (): boolean =>
            !cityImprovementRegistry
              .getByCity(city)
              .some(
                (improvement: CityImprovement): boolean =>
                  improvement instanceof BuildItem
              )
        )
    )
  ),
  ...(
    [
      [Aqueduct, Construction],
      [CityWalls, Masonry],
      [Colosseum, Construction],
      [Courthouse, CodeOfLaws],
      [Granary, Pottery],
      [Library, Writing],
      [Marketplace, Currency],
      [Palace, Masonry],
      [Temple, CeremonialBurial],
      [Bank, Banking],
      [Cathedral, Religion],
      [Factory, Industrialization],
      [HydroPlant, Electronics],
      [MassTransit, MassProduction],
      [ManufacturingPlant, Robotics],
      [NuclearPlant, NuclearPower],
      [PowerPlant, Refining],
      [RecyclingCenter, Recycling],
      [SdiDefence, Superconductor],
      [University, UniversityAdvance],
    ] as [typeof CityImprovement, typeof Advance][]
  ).map(
    ([CityImprovementType, RequiredAdvance]): Build =>
      new Build(
        new Criterion(
          (city: City, BuildItem: IConstructor): boolean =>
            BuildItem === CityImprovementType
        ),
        new Effect(
          (city: City): IBuildCriterion =>
            new Criterion((): boolean =>
              playerResearchRegistry
                .getByPlayer(city.player())
                .completed(RequiredAdvance)
            )
        )
      )
  ),
  ...(
    [
      [Bank, Marketplace],
      [University, Library],
      [HydroPlant, Factory],
      [NuclearPlant, Factory],
      [PowerPlant, Factory],
      [ManufacturingPlant, HydroPlant, NuclearPlant, PowerPlant],
    ] as [typeof CityImprovement, ...(typeof CityImprovement)[]][]
  ).map(
    ([Improvement, ...Requires]): Build =>
      new Build(
        new Criterion(
          (city: City, BuildItem: IConstructor): boolean =>
            BuildItem === Improvement
        ),
        new Effect(
          (city: City): IBuildCriterion =>
            new Criterion((): boolean =>
              cityImprovementRegistry
                .getByCity(city)
                .some((improvement: CityImprovement): boolean =>
                  Requires.some(
                    (Required: typeof CityImprovement): boolean =>
                      improvement instanceof Required
                  )
                )
            )
        )
      )
  ),
  ...(
    [
      [Courthouse, Palace],
      [HydroPlant, NuclearPlant, PowerPlant],
      [NuclearPlant, PowerPlant, HydroPlant],
      [PowerPlant, HydroPlant, NuclearPlant],
    ] as [typeof CityImprovement, ...(typeof CityImprovement)[]][]
  ).map(
    ([Improvement, ...Prevents]) =>
      new Build(
        new Criterion(
          (city: City, BuildItem: IConstructor): boolean =>
            BuildItem === Improvement
        ),
        new Effect(
          (city: City): IBuildCriterion =>
            new Criterion((): boolean =>
              cityImprovementRegistry
                .getByCity(city)
                .every(
                  (improvement: CityImprovement): boolean =>
                    !Prevents.some(
                      (Prevent: typeof CityImprovement): boolean =>
                        improvement instanceof Prevent
                    )
                )
            )
        )
      )
  ),
  // As v474.05, which checks the eight squares around the city, but not the city's own square (OpenCivOne's decompile,
  //  `Overlay_20.cs` `F20_0000_0000`). The book's "on or near" is looser.
  new Build(
    new Criterion(
      (city: City, BuildItem: IConstructor): boolean => BuildItem === HydroPlant
    ),
    new Effect(
      (city: City): IBuildCriterion =>
        new Criterion((): boolean =>
          city
            .tile()
            .getNeighbours()
            .some(
              (tile: Tile): boolean =>
                tile.terrain() instanceof Mountains ||
                tile.terrain() instanceof River
            )
        )
    )
  ),
];

export default getRules;
