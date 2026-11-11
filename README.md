# civ1-city-improvement

Contains the `Rule`s for dealing with `CityImprovement`s. This includes availability (controlled via discovered
`Advance`s), `Cost` (including build cost and maintenance cost) and the effects as they are in Civ 1.

## Pollution

As v474.05, only the human's cities roll for pollution (`civ1-city-improvement:city/process-yield/pollution`, through
`lib/pollute`). v474.05's one human is, here, every player whose seat is not played by the computer (`civ1-difficulty`'s
`isHuman`: a player with a client, none of them an `AIClient`). In a game with no such seat (all computer players, or a
game only watched), no city pollutes. `civ1-enhanced` rolls for every city, superseding this rule while its set is on
(civ-clone/web-renderer#954).