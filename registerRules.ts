import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import cityBuild from './Rules/City/build';
import cityBuildCost from './Rules/City/build-cost';
import cityCaptured from './Rules/City/captured';
import cityCost from './Rules/City/cost';
import cityCreated from './Rules/City/created';
import cityDestroyed from './Rules/City/destroyed';
import cityGrow from './Rules/City/grow';
import cityImprovementCreated from './Rules/City/improvement-created';
import cityYield from './Rules/City/yield';
import cityYieldModifier from './Rules/City/yield-modifier';
import unitCreated from './Rules/Unit/created';

ruleRegistryInstance.register(
  ...cityBuild(),
  ...cityBuildCost(),
  ...cityCaptured(),
  ...cityCost(),
  ...cityCreated(),
  ...cityDestroyed(),
  ...cityGrow(),
  ...cityImprovementCreated(),
  ...cityYield(),
  ...cityYieldModifier(),
  ...unitCreated()
);
