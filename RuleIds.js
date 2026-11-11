"use strict";
// The ids of this package's rules that another package is expected to name (civ-clone/web-renderer#954), as a rule
//  set that supersedes one does: imported, a rename breaks the other package's build rather than leaving both rules
//  running.
Object.defineProperty(exports, "__esModule", { value: true });
exports.HYDRO_PLANT_SITE_RULE = void 0;
/** Whether a city may build a Hydro Plant where it stands: Mountains or a River among its eight neighbours. */
exports.HYDRO_PLANT_SITE_RULE = 'civ1-city-improvement:city/build/hydro-plant-site';
//# sourceMappingURL=RuleIds.js.map