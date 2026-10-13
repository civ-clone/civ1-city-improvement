import City from '@civ-clone/core-city/City';
import Rule from '@civ-clone/core-rule/Rule';

// What a city's shields are divided by before they count towards pollution (civ-clone/web-renderer#32). The largest
//  divisor any rule gives applies, or 1 when none does.
export class PollutionDivisor extends Rule<[City], number> {}

export default PollutionDivisor;
