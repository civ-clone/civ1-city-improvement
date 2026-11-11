// The ids of this package's rules that another package is expected to name (civ-clone/web-renderer#954), as a rule
//  set that supersedes one does: imported, a rename breaks the other package's build rather than leaving both rules
//  running.

/** Whether a city may build a Hydro Plant where it stands: Mountains or a River among its eight neighbours. */
export const HYDRO_PLANT_SITE_RULE =
  'civ1-city-improvement:city/build/hydro-plant-site';
