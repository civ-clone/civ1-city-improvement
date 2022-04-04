import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import cityBuild from './Rules/City/build';
import cityBuildCost from './Rules/City/build-cost';
import cityCreated from './Rules/City/created';
import cityGrow from './Rules/City/grow';
import cityImprovementCreated from './Rules/City/improvement-created';
import cityYield from './Rules/City/yield';
import cityYieldModifier from './Rules/City/yield-modifier';
import unitCreated from './Rules/Unit/created';

ruleRegistryInstance.register(
  ...cityBuild(),
  ...cityBuildCost(),
  ...cityCreated(),
  ...cityGrow(),
  ...cityImprovementCreated(),
  ...cityYield(),
  ...cityYieldModifier(),
  ...unitCreated()
);
