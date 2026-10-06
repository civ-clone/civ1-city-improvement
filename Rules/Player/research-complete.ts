import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import { Combustion, Gunpowder } from '@civ-clone/civ1-science/Advances';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import Advance from '@civ-clone/core-science/Advance';
import { Barracks } from '../../CityImprovements';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Complete from '@civ-clone/core-science/Rules/Complete';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';

export const getRules: (
  cityImprovementRegistry?: CityImprovementRegistry,
  cityRegistry?: CityRegistry,
  engine?: Engine
) => Complete[] = (
  cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
  cityRegistry: CityRegistry = cityRegistryInstance,
  engine: Engine = engineInstance
): Complete[] =>
  (
    [
      // As v474.05: each discovery removes the discovering player's Barracks, without refunding them, and the player is
      //  told even when there were none to remove. They can be built again, at a higher upkeep (see `cost.ts`).
      [Barracks, Gunpowder],
      [Barracks, Combustion],
    ] as [typeof CityImprovement, typeof Advance][]
  ).map(
    ([ImprovementType, ObsoletingAdvance]): Complete =>
      new Complete(
        new Criterion(
          (playerResearch: PlayerResearch, advance: Advance): boolean =>
            advance instanceof ObsoletingAdvance
        ),
        new Effect((playerResearch: PlayerResearch, advance: Advance): void => {
          const player = playerResearch.player(),
            obsolete = cityRegistry
              .getByPlayer(player)
              .flatMap((city: City): CityImprovement[] =>
                cityImprovementRegistry
                  .getByCity(city)
                  .filter(
                    (cityImprovement: CityImprovement): boolean =>
                      cityImprovement instanceof ImprovementType
                  )
              );

          obsolete.forEach((cityImprovement: CityImprovement): void =>
            cityImprovement.destroy()
          );

          engine.emit(
            'city-improvement:obsolete',
            player,
            advance,
            ImprovementType,
            obsolete
          );
        })
      )
  );

export default getRules;
