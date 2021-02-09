import {
  Aqueduct,
  CityWalls,
  Colosseum,
  Courthouse,
  Granary,
  Library,
  Marketplace,
  Palace,
  Temple,
} from '../../CityImprovements';
import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import {
  CeremonialBurial,
  CodeOfLaws,
  Construction,
  Currency,
  Masonry,
  Pottery,
  Writing,
} from '@civ-clone/civ1-science/Advances';
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
  ...([
    [Aqueduct, Construction],
    [CityWalls, Masonry],
    [Colosseum, Construction],
    [Courthouse, CodeOfLaws],
    [Granary, Pottery],
    [Library, Writing],
    [Marketplace, Currency],
    [Palace, Masonry],
    [Temple, CeremonialBurial],
  ] as [typeof CityImprovement, typeof Advance][]).map(
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
  ...([
    // [Bank, Marketplace],
    // [University, Library],
  ] as [typeof CityImprovement, ...typeof CityImprovement[]][]).map(
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
  ...([[Courthouse, Palace]] as [
    typeof CityImprovement,
    ...typeof CityImprovement[]
  ][]).map(
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
];

export default getRules;
