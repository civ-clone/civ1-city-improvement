import { instance as ruleRegistryInstance } from '@civ-clone/core-rule/RuleRegistry';
import build from './Rules/City/build';
import buildCost from './Rules/City/build-cost';
import created from './Rules/City/created';
import grow from './Rules/City/grow';
import improvementCreated from './Rules/City/improvement-created';
import unitCreated from './Rules/Unit/created';

ruleRegistryInstance.register(
  ...build(),
  ...buildCost(),
  ...created(),
  ...grow(),
  ...improvementCreated(),
  ...unitCreated()
);
