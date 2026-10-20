"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.isThreatened = exports.threatRadius = exports.warPriority = exports.everyday = exports.needs = void 0;
const CityImprovements_1 = require("../../CityImprovements");
const CityGrowthRegistry_1 = require("@civ-clone/core-city-growth/CityGrowthRegistry");
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Yields_1 = require("@civ-clone/library-city/Yields");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const InteractionRegistry_1 = require("@civ-clone/core-diplomacy/InteractionRegistry");
const PlayerResearchRegistry_1 = require("@civ-clone/core-science/PlayerResearchRegistry");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const BuildPriority_1 = require("@civ-clone/core-city-build/Rules/BuildPriority");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Peace_1 = require("@civ-clone/base-diplomacy-declaration-peace/Peace");
const cost_1 = require("./cost");
const total = (yields, YieldType) => yields
    .filter((cityYield) => cityYield instanceof YieldType)
    .reduce((sum, cityYield) => sum + cityYield.value(), 0);
// The size above which a city needs an Aqueduct to grow (`Rules/City/grow`).
const aqueductSize = 10;
// How much a city needs each improvement, before what it costs to keep, from 0 (not at all). The rules of thumb follow
//  Civ1's feel, not its code (civ-clone/web-renderer#194): a starving city wants a Granary, and so, a little, does one
//  of size 3 or more with 1 Food or less to spare (in the arena, wanting one in every small city short of Food cost
//  computer players shields and score). A city near the size cap wants an Aqueduct (sooner with Food to spare),
//  unhappy citizens a Temple, then a Colosseum, then a Cathedral, trade the buildings that multiply what it's spent
//  on, corruption a Courthouse, and shields a Factory and then a plant.
exports.needs = [
    [
        CityImprovements_1.Granary,
        ({ food, size }) => (food < 0 ? 3 : food <= 1 && size >= 3 ? 1 : 0),
    ],
    [
        CityImprovements_1.Aqueduct,
        ({ food, size }) => size >= aqueductSize - 2
            ? (size - (aqueductSize - 3)) * 2 + (food >= 4 ? 2 : 0)
            : food >= 4 && size >= aqueductSize - 4
                ? 2
                : 0,
    ],
    [
        CityImprovements_1.Temple,
        ({ size, unhappy }) => unhappy > 0 ? 2 + unhappy * 2 : size >= 5 ? 1 : 0,
    ],
    [CityImprovements_1.Colosseum, ({ unhappy }) => Math.max(0, unhappy - 2) * 2],
    [CityImprovements_1.Cathedral, ({ unhappy }) => Math.max(0, unhappy - 3) * 2],
    [CityImprovements_1.Marketplace, ({ gold, luxuries }) => (gold + luxuries) * 0.5],
    [CityImprovements_1.Library, ({ research }) => research * 0.5],
    [CityImprovements_1.Bank, ({ gold, luxuries }) => (gold + luxuries) * 0.3],
    [CityImprovements_1.University, ({ research }) => research * 0.3],
    [
        CityImprovements_1.Courthouse,
        ({ corruption }) => (corruption >= 2 ? corruption * 0.5 : 0),
    ],
    [
        CityImprovements_1.Factory,
        ({ production }) => (production >= 8 ? production * 0.25 : 0),
    ],
];
// Improvements worth having in any city sooner or later, so a city on Auto always has one to build: they score at
//  least `everyday` whatever the city needs now, which any real need outranks.
const everydayImprovements = [
    CityImprovements_1.Bank,
    CityImprovements_1.Courthouse,
    CityImprovements_1.Granary,
    CityImprovements_1.Library,
    CityImprovements_1.Marketplace,
    CityImprovements_1.Temple,
    CityImprovements_1.University,
];
exports.everyday = 0.1;
// Improvements that add to what a Factory adds, so only needed where there is one (or a Mfg. Plant, for a plant).
const withFactory = [
    [CityImprovements_1.ManufacturingPlant, 0.2],
    [CityImprovements_1.HydroPlant, 0.15],
    [CityImprovements_1.NuclearPlant, 0.15],
    [CityImprovements_1.PowerPlant, 0.15],
];
// Improvements that only help a city under threat: they come before anything else then (civ-clone/web-renderer#194).
const forWar = [CityImprovements_1.Barracks, CityImprovements_1.CityWalls];
// The priority of an improvement a threatened city needs, above any of its other needs.
exports.warPriority = 100;
// How near another player's unit or city has to be to threaten a city.
exports.threatRadius = 5;
// Whether a unit or city of a player `city`'s owner isn't at peace with is within `threatRadius` tiles of it. Civ1 has
//  no declared war: two players who've met are at war until they agree peace, so having met isn't enough on its own.
const isThreatened = (city, cityRegistry = CityRegistry_1.instance, interactionRegistry = InteractionRegistry_1.instance, unitRegistry = UnitRegistry_1.instance) => {
    const player = city.player(), atPeace = new Set(), isEnemy = (other) => other !== player && !atPeace.has(other);
    interactionRegistry
        .getByPlayer(player)
        .forEach((interaction) => {
        if (interaction instanceof Peace_1.default && interaction.active()) {
            interaction.players().forEach((other) => atPeace.add(other));
        }
    });
    return city
        .tile()
        .getSurroundingArea(exports.threatRadius)
        .entries()
        .some((tile) => {
        const tileCity = cityRegistry.getByTile(tile);
        return ((tileCity !== null && isEnemy(tileCity.player())) ||
            unitRegistry
                .getByTile(tile)
                .some((unit) => isEnemy(unit.player())));
    });
};
exports.isThreatened = isThreatened;
const getRules = (cityGrowthRegistry = CityGrowthRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, interactionRegistry = InteractionRegistry_1.instance, playerResearchRegistry = PlayerResearchRegistry_1.instance, cityRegistry = CityRegistry_1.instance, unitRegistry = UnitRegistry_1.instance) => {
    const cityNeeds = (city, yields) => ({
        city,
        // Corruption yields are negative: what the city loses.
        corruption: -total(yields, Yields_1.Corruption),
        food: total(yields, Yields_1.Food),
        gold: total(yields, Yields_1.Gold),
        luxuries: total(yields, Yields_1.Luxuries),
        production: total(yields, Yields_1.Production),
        research: total(yields, Yields_1.Research),
        size: cityGrowthRegistry.getByCity(city).size(),
        unhappy: total(yields, Yields_1.Unhappiness),
    }), 
    // What the improvement costs to keep, against what the city makes in gold: half as needed when it would cost all the
    //  city makes, and hardly at all in a city making none.
    affordable = (Item, city, gold) => (1 + Math.max(0, gold)) /
        (1 +
            Math.max(0, gold) +
            (0, cost_1.upkeep)(Item, city.player(), playerResearchRegistry)), hasFactory = (city) => cityImprovementRegistry
        .getByCity(city)
        .some((improvement) => improvement instanceof CityImprovements_1.Factory ||
        improvement instanceof CityImprovements_1.ManufacturingPlant), isItem = (Item) => (cityBuild, BuildItem) => BuildItem === Item;
    return [
        ...exports.needs.map(([Item, need]) => new BuildPriority_1.default(`civ1-city-improvement:city/build-priority/${Item.name}`, new Criterion_1.default(isItem(Item)), new Effect_1.default((cityBuild, BuildItem, yields) => {
            const needs = cityNeeds(cityBuild.city(), yields);
            return (Math.max(need(needs), everydayImprovements.includes(Item) ? exports.everyday : 0) * affordable(Item, needs.city, needs.gold));
        }))),
        ...withFactory.map(([Item, share]) => new BuildPriority_1.default(`civ1-city-improvement:city/build-priority/${Item.name}`, new Criterion_1.default(isItem(Item)), new Criterion_1.default((cityBuild) => hasFactory(cityBuild.city())), new Effect_1.default((cityBuild, BuildItem, yields) => {
            const needs = cityNeeds(cityBuild.city(), yields);
            return (needs.production *
                share *
                affordable(Item, needs.city, needs.gold));
        }))),
        ...forWar.map((Item) => new BuildPriority_1.default(`civ1-city-improvement:city/build-priority/${Item.name}`, new Criterion_1.default(isItem(Item)), new Criterion_1.default((cityBuild) => (0, exports.isThreatened)(cityBuild.city(), cityRegistry, interactionRegistry, unitRegistry)), new Effect_1.default(() => exports.warPriority))),
    ];
};
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build-priority.js.map