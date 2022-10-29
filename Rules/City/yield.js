"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Governments_1 = require("@civ-clone/civ1-government/Governments");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Yields_1 = require("../../Yields");
const CityImprovements_1 = require("../../CityImprovements");
const PlayerGovernmentRegistry_1 = require("@civ-clone/core-government/PlayerGovernmentRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Priorities_1 = require("@civ-clone/core-rule/Priorities");
const Priority_1 = require("@civ-clone/core-rule/Priority");
const Yield_1 = require("@civ-clone/core-city/Rules/Yield");
const reduceYields_1 = require("@civ-clone/core-yield/lib/reduceYields");
const getRules = (cityImprovementRegistry = CityImprovementRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, playerGovernmentRegistry = PlayerGovernmentRegistry_1.instance) => [
    new Yield_1.default(new Priorities_1.Low(), new Effect_1.default((city, yields) => {
        // Corruption Formula: p223-224, Wilson, J.L & Emrich A. (1992). Sid Meier's Civilization, or Rome on 640K a Day. Rocklin, CA: Prima Publishing
        const playerGovernment = playerGovernmentRegistry.getByPlayer(city.player()), [capital] = cityImprovementRegistry
            .filter((cityImprovement) => cityImprovement instanceof CityImprovements_1.Palace &&
            city.player() === cityImprovement.city().player())
            .map((cityImprovement) => cityImprovement.city()), currentTrade = (0, reduceYields_1.reduceYield)(yields, Yields_1.Trade), distanceFromCapital = playerGovernment.is(Governments_1.Communism)
            ? 10
            : playerGovernment.is(Governments_1.Democracy)
                ? 0
                : capital
                    ? capital.tile().distanceFrom(city.tile())
                    : 32, 
        // These values could be provided by `Rule`s to allow other government types to be created
        [governmentModifier] = [
            [Governments_1.Anarchy, 8],
            [Governments_1.Communism, 20],
            [Governments_1.Democracy, 0],
            [Governments_1.Despotism, 12],
            [Governments_1.Monarchy, 16],
            [Governments_1.Republic, 24],
        ]
            .filter(([GovernmentType]) => playerGovernment.is(GovernmentType))
            .map(([, modifier]) => modifier);
        return new Yields_1.Corruption(governmentModifier
            ? // Assuming `floor` here, although it might be `round`ed... Need to check in Civ.
                Math.min(Math.floor((currentTrade * distanceFromCapital * 3) /
                    (10 * governmentModifier)), currentTrade)
            : 0, distanceFromCapital.toFixed(2));
    })),
    new Yield_1.default(new Priority_1.default(1500), new Criterion_1.default((city) => cityImprovementRegistry
        .getByCity(city)
        .some((cityImprovement) => cityImprovement instanceof CityImprovements_1.Courthouse)), new Effect_1.default((city, yields) => new Yields_1.Corruption(
    // This feels a little nicer, assuming that you've built a `Courthouse` you'd be annoyed if it didn't change the `Corruption` at all...
    -Math.floor((0, reduceYields_1.reduceYield)(yields, Yields_1.Corruption) / 2), CityImprovements_1.Courthouse.name))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=yield.js.map