import { SportType, SportGroup, GearCategory } from '../types/app';

export interface CategoryInfo {
  key: GearCategory;
  label: string;
  shortLabel: string;
  desc: string;
}

export const GEAR_CATEGORIES: CategoryInfo[] = [
  { 
    key: 'backpack', 
    label: 'Taschen & Rucksäcke', 
    shortLabel: 'Rucksäcke', 
    desc: 'Tagesrucksack, Skitourenrucksack, Trailrunning-Weste, Hüfttasche & Dry-Bags' 
  },
  { 
    key: 'baselayer', 
    label: 'Baselayer (Unterwäsche / Shirts)', 
    shortLabel: 'Baselayer', 
    desc: 'Merino/Funktions-Unterwäsche, T-Shirts, Longsleeves' 
  },
  { 
    key: 'midlayer', 
    label: 'Midlayer (Fleece / Daune / Isolation)', 
    shortLabel: 'Midlayer', 
    desc: 'Fleece, Daunenjacke, Primaloft, Isolationsweste' 
  },
  { 
    key: 'hardshell', 
    label: 'Hardshell (Wetterschutz / Regen)', 
    shortLabel: 'Hardshell', 
    desc: 'Gore-Tex Jacke, Paclite Regenhose, Windbreaker' 
  },
  { 
    key: 'pants', 
    label: 'Hosen (Softshell / Trekking)', 
    shortLabel: 'Hosen', 
    desc: 'Softshellhose, Tourenhose, Trekkinghose' 
  },
  { 
    key: 'footwear', 
    label: 'Schuhe (Bergschuhe / Trailrunner)', 
    shortLabel: 'Schuhe', 
    desc: 'Kategorie B/C Stiefel, Trailrunner, Gamaschen' 
  },
  { 
    key: 'hardware', 
    label: 'Hardware (Steigeisen / Helm / Stöcke)', 
    shortLabel: 'Hardware', 
    desc: 'Steigeisen, Pickel, Klettergurt, Helm, Stöcke, Fahrrad-Tool' 
  },
  { 
    key: 'safety', 
    label: 'Sicherheit (LVS / Sonde / Erste Hilfe)', 
    shortLabel: 'Sicherheit', 
    desc: '3-Antennen LVS, Lawinensonde, Aluschaufel, Biwaksack' 
  },
  { 
    key: 'accessories', 
    label: 'Zubehör (Handschuhe / Brillen / Stirnlampe)', 
    shortLabel: 'Zubehör', 
    desc: 'Gletscherbrille, Mütze, Handschuhe, Stirnlampe' 
  },
  { 
    key: 'food_hydration', 
    label: 'Verpflegung & Thermosflaschen', 
    shortLabel: 'Verpflegung', 
    desc: 'Thermosflasche, Trinkblase, Energieriegel, Notverpflegung' 
  }
];

export interface SportInfo {
  key: SportType;
  label: string;
  icon: string;
  group: SportGroup;
  groupLabel: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  shortDesc: string;
  typicalSafetyGear: string[];
}

export const SPORT_GROUPS: { key: SportGroup; label: string; icon: string; desc: string }[] = [
  { key: 'wandern', label: 'Wandern & Trails', icon: '🥾', desc: 'Bergwandern, Weitwandern, Trailrunning & Winterwandern' },
  { key: 'alpin', label: 'Klettern & Alpin', icon: '🧗', desc: 'Hochtouren, Klettersteige, Alpinklettern & Bouldern' },
  { key: 'bike', label: 'Bike & Rad', icon: '🚵', desc: 'Mountainbike, E-Bike, Gravelbike & Rennrad' },
  { key: 'winter', label: 'Winter & Schnee', icon: '❄️', desc: 'Skitouren, Freeride, Schneeschuh & Langlauf' }
];

export const SPORTS_MAP: Record<SportType, SportInfo> = {
  // Wandern & Gehen
  hiking: {
    key: 'hiking',
    label: 'Bergwandern',
    icon: '🥾',
    group: 'wandern',
    groupLabel: 'Wandern & Trails',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-800/60',
    shortDesc: 'Klassische Alm- und Gipfelwanderungen, Bergwege',
    typicalSafetyGear: ['Erste-Hilfe-Set', 'Rettungsdecke', 'Stirnlampe']
  },
  trekking: {
    key: 'trekking',
    label: 'Weitwandern / Fernwege',
    icon: '🎒',
    group: 'wandern',
    groupLabel: 'Wandern & Trails',
    badgeBg: 'bg-teal-950/60',
    badgeText: 'text-teal-400',
    badgeBorder: 'border-teal-800/60',
    shortDesc: 'Mehrtagestouren, Hüttentrekking & Fernwanderwege',
    typicalSafetyGear: ['Hüttenschlafsack', 'Powerbank', 'Biwaksack', 'Erste-Hilfe-Set']
  },
  trailrunning: {
    key: 'trailrunning',
    label: 'Trailrunning',
    icon: '🏃',
    group: 'wandern',
    groupLabel: 'Wandern & Trails',
    badgeBg: 'bg-cyan-950/60',
    badgeText: 'text-cyan-400',
    badgeBorder: 'border-cyan-800/60',
    shortDesc: 'Sportlicher Berglauf über Trails, Schotter und Grate',
    typicalSafetyGear: ['Laufweste / Trinkrucksack', 'Ultraleicht-Windweste', 'Notfallfolie']
  },
  winter_hiking: {
    key: 'winter_hiking',
    label: 'Winterwandern',
    icon: '☃️',
    group: 'wandern',
    groupLabel: 'Wandern & Trails',
    badgeBg: 'bg-sky-950/60',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-800/60',
    shortDesc: 'Gewalzte Winterwanderwege und verschneite Almtäler',
    typicalSafetyGear: ['Grödel / Schuhspikes', 'Gamaschen', 'Thermoskanne']
  },

  // Klettern & Alpin
  mountaineering: {
    key: 'mountaineering',
    label: 'Hochtour / Bergsteigen',
    icon: '⛰️',
    group: 'alpin',
    groupLabel: 'Klettern & Alpin',
    badgeBg: 'bg-indigo-950/60',
    badgeText: 'text-indigo-400',
    badgeBorder: 'border-indigo-800/60',
    shortDesc: 'Gletscherüberschreitungen, ausgesetzte Grate & 3.000er',
    typicalSafetyGear: ['Steigeisen', 'Eispickel', 'Klettergurt & Seil', 'Gletscherbrille Kat. 4']
  },
  via_ferrata: {
    key: 'via_ferrata',
    label: 'Klettersteig (Via Ferrata)',
    icon: '🧗',
    group: 'alpin',
    groupLabel: 'Klettern & Alpin',
    badgeBg: 'bg-amber-950/60',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-800/60',
    shortDesc: 'Drahtseilgesicherte Steige in Felswänden (A bis F)',
    typicalSafetyGear: ['Klettersteigset mit Bandfalldämpfer', 'Klettergurt', 'Steinschlaghelm', 'Klettersteighandschuhe']
  },
  climbing: {
    key: 'climbing',
    label: 'Alpinklettern & Sportklettern',
    icon: '🧗‍♂️',
    group: 'alpin',
    groupLabel: 'Klettern & Alpin',
    badgeBg: 'bg-orange-950/60',
    badgeText: 'text-orange-400',
    badgeBorder: 'border-orange-800/60',
    shortDesc: 'Mehrseillängenrouten im alpinen Fels & Klettergärten',
    typicalSafetyGear: ['Kletterhelm', 'Klettergurt', 'Expressschlingen', 'Abseilgerät', 'Chalkbag']
  },
  bouldering: {
    key: 'bouldering',
    label: 'Bouldern',
    icon: '🧱',
    group: 'alpin',
    groupLabel: 'Klettern & Alpin',
    badgeBg: 'bg-yellow-950/60',
    badgeText: 'text-yellow-400',
    badgeBorder: 'border-yellow-800/60',
    shortDesc: 'Seilfreies Klettern an Felsblöcken in Absprunghöhe',
    typicalSafetyGear: ['Crashpad / Bouldermatte', 'Kletterschuhe', 'Chalkbag & Bürste']
  },

  // Bike & Rad
  mountainbike: {
    key: 'mountainbike',
    label: 'Mountainbike (MTB)',
    icon: '🚵',
    group: 'bike',
    groupLabel: 'Bike & Rad',
    badgeBg: 'bg-lime-950/60',
    badgeText: 'text-lime-400',
    badgeBorder: 'border-lime-800/60',
    shortDesc: 'Alpenüberquerungen, Singletrails, Forst- und Wurzelwege',
    typicalSafetyGear: ['Fahrradhelm', 'Multitool & Tubeless-Flickzeug', 'Minipumpe', 'Knieschoner']
  },
  ebike: {
    key: 'ebike',
    label: 'E-Mountainbike / E-Bike',
    icon: '⚡',
    group: 'bike',
    groupLabel: 'Bike & Rad',
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-700/60',
    shortDesc: 'Ausgedehnte Alm- und Höhenrouten mit Motorunterstützung',
    typicalSafetyGear: ['Helm', 'Ladekabel / Ersatzakku', 'Werkzeugset & Flickzeug']
  },
  gravel_bike: {
    key: 'gravel_bike',
    label: 'Gravelbike',
    icon: '🚴',
    group: 'bike',
    groupLabel: 'Bike & Rad',
    badgeBg: 'bg-yellow-950/60',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-700/60',
    shortDesc: 'Schotterstraßen, Waldautobahnen & Bikepacking-Routen',
    typicalSafetyGear: ['Helm', 'Ersatzschlauch / Tubeless-Kit', 'Rahmentaschen']
  },
  road_bike: {
    key: 'road_bike',
    label: 'Rennrad / Alpenpässe',
    icon: '🚴‍♂️',
    group: 'bike',
    groupLabel: 'Bike & Rad',
    badgeBg: 'bg-rose-950/60',
    badgeText: 'text-rose-400',
    badgeBorder: 'border-rose-800/60',
    shortDesc: 'Asphaltierte Pässe, Stilfser Joch, Großglockner & Co.',
    typicalSafetyGear: ['Aero-Helm', 'Windweste für Passabfahrten', 'CO2-Kartuschenpumpe']
  },

  // Winter & Schnee
  skitour: {
    key: 'skitour',
    label: 'Skitour / Skibergsteigen',
    icon: '⛷️',
    group: 'winter',
    groupLabel: 'Winter & Schnee',
    badgeBg: 'bg-blue-950/60',
    badgeText: 'text-blue-400',
    badgeBorder: 'border-blue-800/60',
    shortDesc: 'Aufstieg mit Fellen, Tiefschneeabfahrten im Gelände',
    typicalSafetyGear: ['3-Antennen LVS-Gerät', 'Lawinensonde', 'Metall-Lawinenschaufel', 'Harscheisen']
  },
  freeride: {
    key: 'freeride',
    label: 'Freeride / Variantenfahren',
    icon: '🎿',
    group: 'winter',
    groupLabel: 'Winter & Schnee',
    badgeBg: 'bg-indigo-950/60',
    badgeText: 'text-indigo-300',
    badgeBorder: 'border-indigo-700/60',
    shortDesc: 'Tiefschnee-Abfahrten abseits gesicherter Pisten',
    typicalSafetyGear: ['Lawinen-Airbag-Rucksack', 'LVS-Gerät', 'Schaufel & Sonde', 'Rückenprotektor']
  },
  snowshoe: {
    key: 'snowshoe',
    label: 'Schneeschuhwandern',
    icon: '❄️',
    group: 'winter',
    groupLabel: 'Winter & Schnee',
    badgeBg: 'bg-violet-950/60',
    badgeText: 'text-violet-300',
    badgeBorder: 'border-violet-800/60',
    shortDesc: 'Wandern abseits gebahnter Wege durch Tiefschneefelder',
    typicalSafetyGear: ['Schneeschuhe mit Harscheisenkrallen', 'Teleskopstöcke mit Wintertellern', 'Gamaschen', 'LVS-Set']
  },
  cross_country_ski: {
    key: 'cross_country_ski',
    label: 'Langlaufen (Klassisch / Skating)',
    icon: '🎿',
    group: 'winter',
    groupLabel: 'Winter & Schnee',
    badgeBg: 'bg-teal-950/60',
    badgeText: 'text-teal-300',
    badgeBorder: 'border-teal-700/60',
    shortDesc: 'Präparierte Loipen im Tal oder auf Höhenloipen',
    typicalSafetyGear: ['Atmungsaktive Langlaufbekleidung', 'Langlaufbrille / Visier', 'Schlauchschal']
  },
  sledging: {
    key: 'sledging',
    label: 'Rodeln / Schlitteln',
    icon: '🛷',
    group: 'winter',
    groupLabel: 'Winter & Schnee',
    badgeBg: 'bg-red-950/60',
    badgeText: 'text-red-400',
    badgeBorder: 'border-red-800/60',
    shortDesc: 'Naturrodelbahnen, Hüttenabfahrten mit Rodelschlitten',
    typicalSafetyGear: ['Ski- oder Rodelhelm', 'Skibrille', 'Stabile Bergschuhe mit Bremsprofil', 'Warme Fäustlinge']
  },
  ice_climbing: {
    key: 'ice_climbing',
    label: 'Eisklettern',
    icon: '🧊',
    group: 'winter',
    groupLabel: 'Winter & Schnee',
    badgeBg: 'bg-sky-950/60',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-700/60',
    shortDesc: 'Gefrorene Wasserfälle und vertikale Eiswände',
    typicalSafetyGear: ['2x Steileisgeräte', 'Monozacken-Steigeisen', 'Eisschrauben', 'Steinschlag- & Eisschlaghelm']
  }
};

export const ALL_SPORTS: SportInfo[] = Object.values(SPORTS_MAP);

export function getSportInfo(sport: SportType | string): SportInfo {
  if (sport in SPORTS_MAP) {
    return SPORTS_MAP[sport as SportType];
  }
  return {
    key: 'hiking' as SportType,
    label: typeof sport === 'string' ? sport : 'Bergwandern',
    icon: '⛰️',
    group: 'wandern',
    groupLabel: 'Wandern',
    badgeBg: 'bg-slate-800',
    badgeText: 'text-slate-300',
    badgeBorder: 'border-slate-700',
    shortDesc: 'Alpine Bergtour',
    typicalSafetyGear: ['Erste-Hilfe-Set']
  };
}

export function isWinterSport(sport: SportType): boolean {
  return SPORTS_MAP[sport]?.group === 'winter';
}

export function isBikeSport(sport: SportType): boolean {
  return SPORTS_MAP[sport]?.group === 'bike';
}

export function isClimbingSport(sport: SportType): boolean {
  return sport === 'climbing' || sport === 'via_ferrata' || sport === 'bouldering' || sport === 'ice_climbing' || sport === 'mountaineering';
}
