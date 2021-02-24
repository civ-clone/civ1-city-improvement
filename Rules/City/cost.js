"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const CityImprovements_1 = require("../../CityImprovements");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Cost_1 = require("@civ-clone/core-city/Rules/Cost");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Yields_1 = require("@civ-clone/civ1-city/Yields");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance
// playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance,
) => [
    ...[
        [CityImprovements_1.Aqueduct, Yields_1.Gold, 2],
        [CityImprovements_1.CityWalls, Yields_1.Gold, 2],
        [CityImprovements_1.Colosseum, Yields_1.Gold, 2],
        [CityImprovements_1.Courthouse, Yields_1.Gold, 1],
        [CityImprovements_1.Granary, Yields_1.Gold, 1],
        [CityImprovements_1.Library, Yields_1.Gold, 1],
        [CityImprovements_1.Marketplace, Yields_1.Gold, 1],
        [CityImprovements_1.Temple, Yields_1.Gold, 1],
    ].map(([CityImprovementType, YieldType, cost]) => new Cost_1.default(new Criterion_1.default((cityYield, city) => cityYield instanceof YieldType), new Criterion_1.default((cityYield, city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovementType)), new Effect_1.default((cityYield) => cityYield.subtract(cost)))),
    // ...([
    //   // [Barracks, Gold, 1, Industrialization, Automobile],
    // ] as [typeof CityImprovement, typeof Yield, number, ...typeof Advance[]][]).map(([CityImprovementType, YieldType, cost, RequiredAdvance, ObseletionAdvance]): Cost => new Cost(
    //   new Criterion((cityYield: Yield, city: City): boolean => cityYield instanceof YieldType),
    //   new Criterion((cityYield: Yield, city: City): boolean => cityImprovementRegistry.getByCity(city)
    //     .some((cityImprovement: CityImprovement): boolean => cityImprovement instanceof CityImprovementType)
    //   ),
    //   new Criterion((cityYield: Yield, city: City): boolean => playerResearchRegistry.getByPlayer(city.player())
    //     .completed(RequiredAdvance)
    //   ),
    //   new Criterion((cityYield: Yield, city: City): boolean => playerResearchRegistry.getByPlayer(city.player())
    //     .completed(ObseletionAdvance)
    //   ),
    //   new Effect((cityYield: Yield): void => cityYield.subtract(cost)),
    // )),
    // ...([
    //   // [Barracks, Gold, 2, Automobile],
    // ] as [typeof CityImprovement, typeof Yield, number, ...typeof Advance[]][]).map(([CityImprovementType, YieldType, cost, RequiredAdvance]): Cost => new Cost(
    //   new Criterion((cityYield: Yield, city: City): boolean => cityYield instanceof YieldType),
    //   new Criterion((cityYield: Yield, city: City): boolean => cityImprovementRegistry.getByCity(city)
    //     .some((cityImprovement: CityImprovement): boolean => cityImprovement instanceof CityImprovementType)
    //   ),
    //   new Criterion((cityYield: Yield, city: City): boolean => playerResearchRegistry.getByPlayer(city.player())
    //     .completed(RequiredAdvance)
    //   ),
    //   new Effect((cityYield: Yield): void => cityYield.subtract(cost)),
    // )),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=cost.js.map