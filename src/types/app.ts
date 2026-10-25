export type SportGroup = 'wandern' | 'bike' | 'winter' | 'alpin';

export type SportType = 
  // Wandern & Berggehen
  | 'hiking'
  | 'trekking'
  | 'trailrunning'
  | 'winter_hiking'
  // Klettern & Alpin
  | 'mountaineering'
  | 'climbing'
  | 'via_ferrata'
  | 'bouldering'
  // Bike & Rad
  | 'mountainbike'
  | 'ebike'
  | 'gravel_bike'
  | 'road_bike'
  // Winter & Schnee
  | 'skitour'
  | 'freeride'
  | 'snowshoe'
  | 'cross_country_ski'
  | 'sledging'
  | 'ice_climbing';

export type GearCategory = 
  | 'baselayer'
  | 'midlayer'
  | 'hardshell'
  | 'pants'
  | 'footwear'
  | 'backpack'
  | 'hardware'
  | 'safety'
  | 'accessories'
  | 'food_hydration';

export interface GearItem {
  id: string;
  name: string;
  brand: string;
  category: GearCategory;
  weightGrams: number;
  tempMin: number; // in °C
  tempMax: number; // in °C
  isWaterproof: boolean;
  isWindproof: boolean;
  sports: SportType[];
  notes?: string;
  condition: 'Neuwertig' | 'Sehr gut' | 'Gebraucht' | 'Erneuerungsbedürftig';
  imageSrc?: string;
  isMandatorySafety?: boolean;
  isFavorite?: boolean;
  volumeLiters?: number; // Fassungsvermögen für Rucksäcke & Taschen
  backpackType?: 'daypack' | 'alpine_tour' | 'trail_vest' | 'hip_bag' | 'dry_bag' | 'trekking' | 'bike_bag';
  features?: string[];
}

export interface ProfilePoint {
  distKm: number;
  altitudeM: number;
}

export interface GpxTour {
  id: string;
  name: string;
  sport: SportType;
  region: string;
  distanceKm: number;
  elevationGainM: number;
  elevationLossM: number;
  maxAltitudeM: number;
  minAltitudeM: number;
  estimatedHours: number;
  technicalDifficulty: 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6';
  terrain: string[];
  description: string;
  profilePoints: ProfilePoint[];
  gpxRaw?: string;
  isFavorite?: boolean;
}

export interface WeatherCondition {
  valleyTempC: number;
  mountainTempC: number;
  windKmh: number;
  precipitation: 'sun' | 'cloudy' | 'rain' | 'snow' | 'storm';
  avalancheLevel: 1 | 2 | 3 | 4 | 5; // Europäische Lawinengefahrenstufe 1-5
  avalancheWarning: string;
  freezingAltitudeM: number; // Nullgradgrenze
  regionName?: string;
  fetchedViaGoogleSearch?: boolean;
  lastUpdated?: string;
  searchSummary?: string;
  searchSources?: string[];
  isLiveLoading?: boolean;
}

export interface TourFeedback {
  id: string;
  tourId: string;
  tourName: string;
  date: string;
  tempFeeling: 'zu_kalt' | 'genau_richtig' | 'zu_warm';
  weightRating: 'zu_schwer' | 'optimal' | 'leicht';
  gearMissed: string[];
  gearUnused: string[];
  notes: string;
}

export interface UserProfile {
  id: string;
  name: string;
  coldSensitivity: 'frierend' | 'normal' | 'schwitzend'; // Kälteempfindlich vs. schwitzt schnell
  safetyPriority: 'ultralight' | 'ausgewogen' | 'sicherheit_zuerst';
  experienceLevel: 'Einsteiger' | 'Fortgeschritten' | 'Alpinist';
  feedbackHistory: TourFeedback[];
}

export interface BreakRecommendation {
  km: number;
  altitudeM: number;
  title: string;
  timeEstimate: string;
  tip: string;
  clothingTip: string;
  hydrationKcal: string;
}

export type ExposureMode = 'active_continuous' | 'static_standing' | 'alternating_indoor_outdoor';

export interface ActivityExposureScenario {
  mode: ExposureMode;
  staticDurationHours: number; // e.g. 2 for "2 Std draußen stehen"
  indoorOutdoorCycle?: 'frequent' | 'balanced' | 'occasional'; // für wechselnd innen/außen
  customNote?: string;
}

export interface PackingRecommendation {
  tour: GpxTour;
  weather: WeatherCondition;
  wearOnBody: GearItem[];
  packInBackpack: GearItem[];
  mandatorySafety: Array<{ item: GearItem; reason: string; isHighAlert: boolean }>;
  missingEssentialGear: string[];
  breaks: BreakRecommendation[];
  totalWeightKg: number;
  avalancheRiskAlert?: {
    level: number;
    title: string;
    mandatoryChecklist: string[];
  };
  adaptiveLearningNote?: string;
  appliedScenario?: ActivityExposureScenario;
  scenarioAdvice?: {
    title: string;
    badge: string;
    description: string;
    metabolicNote: string;
    tips: string[];
  };
  // Rucksack- & Taschen-Empfehlung
  recommendedBackpack?: GearItem;
  availableBackpacks?: GearItem[];
  totalRequiredVolumeLiters?: number;
  backpackUtilizationPercent?: number;
  backpackAdvice?: {
    title: string;
    badge: string;
    description: string;
    packingZones: Array<{ zone: string; items: string; tip: string }>;
    tips: string[];
  };
}

