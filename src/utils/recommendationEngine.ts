import { 
  GpxTour, 
  WeatherCondition, 
  UserProfile, 
  GearItem, 
  PackingRecommendation, 
  BreakRecommendation,
  ActivityExposureScenario 
} from '../types/app';

export function calculateEffectiveTemperature(
  valleyTempC: number,
  altitudeGainM: number,
  windKmh: number
): { summitTempC: number; windchillC: number } {
  // Standard atmospheric lapse rate in the Alps: ~0.65°C drop per 100m
  const altitudeDrop = (altitudeGainM / 100) * 0.65;
  const summitTempC = Math.round((valleyTempC - altitudeDrop) * 10) / 10;

  // Approximate windchill for outdoor conditions
  let windchillC = summitTempC;
  if (windKmh > 10) {
    windchillC = Math.round(
      (13.12 + 0.6215 * summitTempC - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * summitTempC * Math.pow(windKmh, 0.16)) * 10
    ) / 10;
  }

  return { summitTempC, windchillC };
}

export function generatePackingRecommendation(
  tour: GpxTour,
  weather: WeatherCondition,
  profile: UserProfile,
  closet: GearItem[],
  scenario?: ActivityExposureScenario
): PackingRecommendation {
  const elevDiff = Math.max(0, tour.maxAltitudeM - tour.minAltitudeM);
  const { summitTempC, windchillC } = calculateEffectiveTemperature(weather.valleyTempC, elevDiff, weather.windKmh);

  // Default scenario if none supplied: active continuous
  const activeScenario: ActivityExposureScenario = scenario || {
    mode: 'active_continuous',
    staticDurationHours: 2,
    indoorOutdoorCycle: 'balanced'
  };

  // Check feedback history for learned preferences
  let coldBuffer = 0;
  let learnedNotice = '';
  const coldComplaints = profile.feedbackHistory.filter(f => f.tempFeeling === 'zu_kalt');
  const warmComplaints = profile.feedbackHistory.filter(f => f.tempFeeling === 'zu_warm');

  if (profile.coldSensitivity === 'frierend' || coldComplaints.length > 0) {
    coldBuffer = 4; // Shift target temps 4 degrees warmer
    learnedNotice = `Die App hat aus ${coldComplaints.length > 0 ? `${coldComplaints.length} Tour-Feedbacks` : 'deinem Profil'} gelernt: Du kühlst schneller aus. Es werden zusätzliche Isolationsschichten & Handwärmer priorisiert.`;
  } else if (profile.coldSensitivity === 'schwitzend' || warmComplaints.length > 0) {
    coldBuffer = -3;
    learnedNotice = `Die App hat gelernt: Du kommst schnell ins Schwitzen. Fokus auf hochgradig atmungsaktive Baselayer und leichtere Midlayer.`;
  }

  // Thermal impact from Activity & Exposure Scenario
  let scenarioChillPenalty = 0;
  let scenarioAdvice: PackingRecommendation['scenarioAdvice'] = undefined;

  if (activeScenario.mode === 'static_standing') {
    // Human metabolic heat rate drops from ~450-600W (alpine hiking) to ~80-100W (basal standing).
    // Standing in the open without movement causes rapid evaporative & radiative cooling.
    // Penalty: ~2.5°C equivalent felt chill per hour of standing, capped at 11°C.
    const duration = activeScenario.staticDurationHours || 2;
    scenarioChillPenalty = Math.min(11, Math.round(duration * 2.5 * 10) / 10);

    scenarioAdvice = {
      title: `Statische Exposition (${duration} Std. draußen stehen)`,
      badge: `Stoffwechsel ~90W (+${scenarioChillPenalty.toFixed(1)}°C Kälte-Zuschlag)`,
      description: `Beim Stehen ohne Muskelbewegung produziert der Körper nur ca. 90 Watt Eigenwärme (statt 500W beim Gehen). Die Kälte dringt nach 20–30 Minuten bis auf die Knochen vor.`,
      metabolicNote: `Wärmebedarf drastisch erhöht: Dicke Daunen-/Primaloftschicht, warme Handschuhe & heiße Thermoskanne zwingend erforderlich!`,
      tips: [
        `Isolationsjacke (Daune/Primaloft) SOFORT bei Beginn des Stehens überziehen – nicht erst warten, bis man fröstelt!`,
        `Kältebrücke von unten stoppen: Nicht direkt auf eisigen Steinen/Schnee stehen; isolierendes Sitzkissen oder Rucksack unterlegen.`,
        `Regelmäßig heißen Tee/Brühe aus der Thermosflasche trinken, um die Körperkerntemperatur stabil zu halten.`,
        `Gegen Auskühlung alle 15–20 Minuten Wadenheber, Armkreisen und Zehenwackeln durchführen.`
      ]
    };
  } else if (activeScenario.mode === 'alternating_indoor_outdoor') {
    // Frequent temperature jumps between ~20°C inside (mountain hut/gondola) and -5°C to 8°C outside.
    // Major threat: sweating profusely inside, resulting in freezing sweat shock outside.
    scenarioAdvice = {
      title: `Wechselnd Innen / Außen (Hütten, Bergbahn & Stop & Go)`,
      badge: `Temperatursprung: Bis zu 25°C Differenz (Warm drinnen, eisig draußen)`,
      description: `Häufiges Ein- und Ausgehen zwischen geheizten Räumen (Berghütte, Seilbahngondel, Berggasthaus) und alpiner Außenluft erfordert ein aktives Schichtenmanagement ("Zwiebelprinzip").`,
      metabolicNote: `Fokus auf Belüftung mit Reißverschlüssen. Nasse Schichten in der Hütte sofort lüften oder wechseln!`,
      tips: [
        `Beim Betreten von warmen Innenräumen Außenjacke und Mütze unverzüglich öffnen oder ablegen, um Durchschwitzen zu verhindern.`,
        `Jacken mit 2-Wege-Frontzipper und Unterarmbelüftung (Pit-Zips) bevorzugen.`,
        `Trockenes Ersatz-Baselayer im Rucksack mitführen – nach längerer Hüttenrast feuchtes Shirt wechseln.`,
        `Vor Verlassen des Innenraums Schichten wieder schließen, um Kälteschock durch Windchill vorzubeugen.`
      ]
    };
  } else {
    // Active continuous
    scenarioAdvice = {
      title: `Sportlich aktiv / Kontinuierliche Bewegung`,
      badge: `Hohe Stoffwechselleistung: ~400–600W Eigenwärme`,
      description: `Kontinuierliche Fortbewegung generiert viel Körperwärme. Kleidung muss atmungsaktiv sein und Feuchtigkeit rasch abtransportieren.`,
      metabolicNote: `Leichter bekleidet starten ("Leicht frieren am Start"), warme Rastjacke für Gipfelpause im Rucksack mitführen.`,
      tips: [
        `Start-Regel: Am Parkplatz sollte man die ersten 5 Minuten leicht frösteln – die Muskelwärme setzt nach 10 Minuten ein.`,
        `Bei steilen Anstiegen Reißverschlüsse frühzeitig öffnen, um Überhitzung zu vermeiden.`,
        `Bei Erreichen des Rastpunkts oder Gipfels sofort die Isolationsschicht überziehen!`
      ]
    };
  }

  const effectiveFeltTemp = windchillC - coldBuffer - scenarioChillPenalty;

  const wearOnBody: GearItem[] = [];
  const packInBackpack: GearItem[] = [];
  const mandatorySafety: Array<{ item: GearItem; reason: string; isHighAlert: boolean }> = [];
  const missingEssentialGear: string[] = [];

  // Helper to find best item in closet
  const findItem = (predicate: (g: GearItem) => boolean): GearItem | undefined => {
    return closet.find(predicate);
  };

  // 1. BASELAYER
  if (weather.valleyTempC > 18 && effectiveFeltTemp > 10) {
    const lightShirt = findItem(g => g.category === 'baselayer' && g.tempMax >= 20) || closet.find(g => g.category === 'baselayer');
    if (lightShirt) wearOnBody.push(lightShirt);
  } else {
    const merino = findItem(g => g.category === 'baselayer' && g.name.toLowerCase().includes('merino')) || closet.find(g => g.category === 'baselayer');
    if (merino) wearOnBody.push(merino);
  }

  // Baselayer change logic: Always pack a dry spare baselayer for long tours OR alternating indoor/outdoor
  if (tour.elevationGainM > 800 || tour.estimatedHours > 4 || activeScenario.mode === 'alternating_indoor_outdoor') {
    const spareShirt = closet.find(g => g.category === 'baselayer' && !wearOnBody.includes(g));
    if (spareShirt && !packInBackpack.some(g => g.id === spareShirt.id)) {
      packInBackpack.push({ 
        ...spareShirt, 
        notes: activeScenario.mode === 'alternating_indoor_outdoor'
          ? 'Wechselshirt: Nach Aufenthalt im warmen Innenraum/Hütte sofort feuchtes Shirt wechseln!'
          : 'Wechselshirt: Nach dem schweißtreibenden Aufstieg sofort wechseln!' 
      });
    }
  }

  // 2. PANTS
  const pants = findItem(g => g.category === 'pants');
  if (pants) {
    wearOnBody.push(pants);
  }

  // 3. FOOTWEAR
  const isWinterOrHighAlpine = tour.sport === 'skitour' || tour.sport === 'snowshoe' || tour.maxAltitudeM > 2500 || tour.technicalDifficulty === 'T4' || tour.technicalDifficulty === 'T5';
  if (isWinterOrHighAlpine) {
    const mountaineeringBoot = findItem(g => g.category === 'footwear' && g.name.toLowerCase().includes('bergschuh')) || closet.find(g => g.category === 'footwear');
    if (mountaineeringBoot) wearOnBody.push(mountaineeringBoot);
  } else {
    const trailShoe = findItem(g => g.category === 'footwear' && g.sports.includes(tour.sport)) || closet.find(g => g.category === 'footwear');
    if (trailShoe) wearOnBody.push(trailShoe);
  }

  // 4. MIDLAYER & INSULATION
  if (effectiveFeltTemp < 15 || activeScenario.mode === 'static_standing') {
    const fleece = findItem(g => g.category === 'midlayer' && g.name.toLowerCase().includes('fleece'));
    if (fleece) {
      if (weather.valleyTempC < 10 || activeScenario.mode === 'static_standing') wearOnBody.push(fleece);
      else packInBackpack.push(fleece);
    }
  }

  const isStandingCold = activeScenario.mode === 'static_standing' && (weather.valleyTempC < 15 || effectiveFeltTemp < 12);
  if (effectiveFeltTemp < 6 || tour.maxAltitudeM > 2200 || coldBuffer > 0 || isStandingCold) {
    const downJacket = findItem(g => g.category === 'midlayer' && g.name.toLowerCase().includes('daune'));
    if (downJacket) {
      if (activeScenario.mode === 'static_standing' && weather.valleyTempC < 8) {
        if (!wearOnBody.some(g => g.id === downJacket.id)) wearOnBody.push(downJacket);
      } else {
        if (!packInBackpack.some(g => g.id === downJacket.id)) {
          packInBackpack.push({
            ...downJacket,
            notes: activeScenario.mode === 'static_standing'
              ? `Statische Kälte: Bei ${activeScenario.staticDurationHours}h Stehen ohne Muskelwärme sofort überziehen!`
              : 'Gipfel- und Rastisolation: Unbedingt bei längeren Pausen anziehen gegen Windchill!'
          });
        }
      }
    } else {
      missingEssentialGear.push(
        activeScenario.mode === 'static_standing'
          ? `Warme Daunen- oder Primaloftjacke (Pflicht bei ${activeScenario.staticDurationHours}h Stehen im Freien)`
          : 'Packbare Daunen- oder Primaloft-Isolationsjacke (Gipfelkälte < 5°C)'
      );
    }
  }

  // 5. HARDSHELL / RAIN PROTECTION
  const hardshell = findItem(g => g.category === 'hardshell' && g.isWaterproof);
  if (hardshell) {
    if (weather.precipitation === 'rain' || weather.precipitation === 'snow' || weather.windKmh > 50) {
      wearOnBody.push(hardshell);
    } else {
      packInBackpack.push({
        ...hardshell,
        notes: 'Wetterumschwung-Schutz: Im Hochgebirge auch bei Schönwetter Pflicht im Rucksack.'
      });
    }
  } else {
    missingEssentialGear.push('Wasserdichte Hardshelljacke (Alpiner Notfallschutz)');
  }

  // Rain pants if precipitation expected
  if (weather.precipitation === 'rain' || weather.precipitation === 'snow') {
    const rainPants = findItem(g => g.category === 'hardshell' && g.name.toLowerCase().includes('hose'));
    if (rainPants) packInBackpack.push(rainPants);
  }

  // 6. TECHNICAL HARDWARE
  // 6. TECHNICAL HARDWARE & SPORT-SPECIFIC SAFETY
  // Snowshoes for snowshoeing
  if (tour.sport === 'snowshoe') {
    const snowshoes = findItem(g => g.name.toLowerCase().includes('schneeschuh'));
    if (snowshoes) wearOnBody.push(snowshoes);
    else missingEssentialGear.push('Schneeschuhe mit Harscheisen');
  }

  // Ice climbing gear
  if (tour.sport === 'ice_climbing') {
    const iceAxes = findItem(g => g.name.toLowerCase().includes('eisgerät') || g.name.toLowerCase().includes('pickel'));
    const crampons = findItem(g => g.name.toLowerCase().includes('steigeisen'));
    const harness = findItem(g => g.name.toLowerCase().includes('klettergurt'));
    const helmet = findItem(g => g.name.toLowerCase().includes('helm'));

    if (iceAxes) wearOnBody.push(iceAxes);
    else missingEssentialGear.push('Paar Steileisgeräte für Wasserfalleisklettern');

    if (crampons) wearOnBody.push(crampons);
    else missingEssentialGear.push('Steigeisen mit Monozacken für Eiswände');

    if (harness) wearOnBody.push(harness);
    if (helmet) wearOnBody.push(helmet);
    else missingEssentialGear.push('Steinschlag- und Eisschlaghelm');
  }

  // Bike & Radsport (MTB, E-Bike, Gravel, Rennrad)
  const isBikeActivity = tour.sport === 'mountainbike' || tour.sport === 'ebike' || tour.sport === 'gravel_bike' || tour.sport === 'road_bike';
  if (isBikeActivity) {
    const bikeHelmet = findItem(g => g.name.toLowerCase().includes('mtb') || g.name.toLowerCase().includes('helm'));
    const repairKit = findItem(g => g.name.toLowerCase().includes('multitool') || g.name.toLowerCase().includes('reparatur') || g.name.toLowerCase().includes('schlauch'));
    
    if (bikeHelmet) {
      wearOnBody.push(bikeHelmet);
      mandatorySafety.push({ item: bikeHelmet, reason: 'Fahrradhelm obligatorisch für Trails und Passabfahrten', isHighAlert: true });
    } else {
      missingEssentialGear.push('Fahrradhelm mit MIPS / Trail-Schutz');
    }

    if (repairKit) {
      packInBackpack.push(repairKit);
      mandatorySafety.push({ item: repairKit, reason: 'Pannen-Notfall: Multitool & Tubeless-Flickzeug', isHighAlert: false });
    }
  }

  // Crampons / Grödel for alpine, snow, or winter hiking
  const hasIceOrSnow = tour.terrain.some(t => t.toLowerCase().includes('schnee') || t.toLowerCase().includes('eis') || t.toLowerCase().includes('gletscher'));
  if (tour.sport === 'winter_hiking') {
    const spikes = findItem(g => g.name.toLowerCase().includes('spikes') || g.name.toLowerCase().includes('grödel'));
    if (spikes) packInBackpack.push(spikes);
  } else if (hasIceOrSnow || tour.sport === 'mountaineering' || (weather.freezingAltitudeM < tour.maxAltitudeM && tour.sport === 'hiking')) {
    const crampons = findItem(g => g.name.toLowerCase().includes('steigeisen'));
    const spikes = findItem(g => g.name.toLowerCase().includes('grödel') || g.name.toLowerCase().includes('spikes'));
    if (tour.technicalDifficulty === 'T4' || tour.technicalDifficulty === 'T5' || tour.maxAltitudeM > 2800) {
      if (crampons) packInBackpack.push(crampons);
      else missingEssentialGear.push('Steigeisen 10-Zacker für vereiste Flanken');
    } else if (spikes) {
      packInBackpack.push(spikes);
    }
  }

  // Via Ferrata Set & Helmet & Harness
  if (tour.sport === 'via_ferrata') {
    const ferrataSet = findItem(g => g.name.toLowerCase().includes('klettersteigset'));
    const helmet = findItem(g => g.name.toLowerCase().includes('helm'));
    const harness = findItem(g => g.name.toLowerCase().includes('klettergurt'));
    
    if (ferrataSet) wearOnBody.push(ferrataSet);
    else missingEssentialGear.push('Klettersteigset mit Bandfalldämpfer (UIAA)');

    if (harness) wearOnBody.push(harness);
    else missingEssentialGear.push('Verstellbarer Klettergurt');

    if (helmet) wearOnBody.push(helmet);
    else missingEssentialGear.push('Steinschlaghelm UIAA zertifiziert');
  }

  // Rock Climbing (Alpinklettern)
  if (tour.sport === 'climbing') {
    const harness = findItem(g => g.name.toLowerCase().includes('klettergurt'));
    const helmet = findItem(g => g.name.toLowerCase().includes('helm'));
    if (harness) wearOnBody.push(harness);
    else missingEssentialGear.push('Klettergurt');
    if (helmet) wearOnBody.push(helmet);
    else missingEssentialGear.push('Kletterhelm');
  }

  // Multi-day Trekking / Hut tours
  if (tour.sport === 'trekking') {
    const hutSheet = findItem(g => g.name.toLowerCase().includes('hüttenschlafsack'));
    if (hutSheet) packInBackpack.push(hutSheet);
    else missingEssentialGear.push('Hüttenschlafsack (Pflicht auf Alpenvereinshütten)');
  }

  // 7. AVALANCHE & SAFETY GEAR (LAWINE)
  const isWinterActivity = tour.sport === 'skitour' || tour.sport === 'snowshoe' || hasIceOrSnow;
  const avalancheWarningActive = weather.avalancheLevel >= 2 || (isWinterActivity && weather.avalancheLevel >= 1);

  if (avalancheWarningActive) {
    const lvs = findItem(g => g.name.toLowerCase().includes('lvs'));
    const sonde = findItem(g => g.name.toLowerCase().includes('sonde'));
    const schaufel = findItem(g => g.name.toLowerCase().includes('schaufel'));

    if (lvs) {
      wearOnBody.push({ ...lvs, notes: 'LVS AM KÖRPER tragen (unterster Kleidungsschicht), eingeschaltet auf SENDEN!' });
      mandatorySafety.push({ item: lvs, reason: `Lawinengefahr Stufe ${weather.avalancheLevel} im Tourengebiet. LVS zwingend am Körper tragen!`, isHighAlert: true });
    } else {
      missingEssentialGear.push('Digitales 3-Antennen LVS-Gerät (Lebensrettend bei Lawinengefahr!)');
    }

    if (sonde) {
      packInBackpack.push(sonde);
      mandatorySafety.push({ item: sonde, reason: 'Lawinensonde 240cm+ für Punktortung im Schnee', isHighAlert: true });
    } else {
      missingEssentialGear.push('Lawinensonde Aluminium min. 240cm');
    }

    if (schaufel) {
      packInBackpack.push(schaufel);
      mandatorySafety.push({ item: schaufel, reason: 'Metall-Lawinenschaufel für Notfallausgrabung', isHighAlert: true });
    } else {
      missingEssentialGear.push('Stabile Lawinenschaufel mit Metallblatt');
    }
  }

  // Mandatory General Alpine Safety (First Aid, Bivy Bag, Headlamp)
  const firstAid = findItem(g => g.name.toLowerCase().includes('erste-hilfe') || g.name.toLowerCase().includes('notfall'));
  if (firstAid) {
    packInBackpack.push(firstAid);
    mandatorySafety.push({ item: firstAid, reason: 'Pflicht auf jeder Bergtour: Notfallversorgung & Rettungsdecke', isHighAlert: false });
  } else {
    missingEssentialGear.push('Alpine Notfalltasche / Erste-Hilfe-Set mit Rettungsdecke');
  }

  const bivyBag = findItem(g => g.name.toLowerCase().includes('biwaksack'));
  if (bivyBag && (tour.maxAltitudeM > 2000 || tour.estimatedHours > 4)) {
    packInBackpack.push(bivyBag);
    mandatorySafety.push({ item: bivyBag, reason: 'Alpines Notfallbiwak bei Wetterumsturz oder Verletzung', isHighAlert: false });
  }

  const headlamp = findItem(g => g.name.toLowerCase().includes('stirnlampe'));
  if (headlamp) {
    packInBackpack.push(headlamp);
    mandatorySafety.push({ item: headlamp, reason: 'Bei Verzögerung im Gebirge unverzichtbar', isHighAlert: false });
  }

  // 8. ACCESSORIES & HYDRATION
  // Sunglasses
  const sunglasses = findItem(g => g.category === 'accessories' && g.name.toLowerCase().includes('brille'));
  if (sunglasses) {
    if (isWinterOrHighAlpine || weather.precipitation === 'sun') wearOnBody.push(sunglasses);
    else packInBackpack.push(sunglasses);
  }

  // Gloves
  if (effectiveFeltTemp < 12 || windchillC < 7 || activeScenario.mode === 'static_standing') {
    const lightGloves = findItem(g => g.name.toLowerCase().includes('fingerhandschuhe'));
    if (lightGloves && !packInBackpack.some(g => g.id === lightGloves.id)) packInBackpack.push(lightGloves);
  }

  if (effectiveFeltTemp < 2 || (activeScenario.mode === 'static_standing' && weather.valleyTempC < 8) || isWinterActivity) {
    const heavyGloves = findItem(g => g.name.toLowerCase().includes('fausthandschuhe'));
    if (heavyGloves && !packInBackpack.some(g => g.id === heavyGloves.id)) packInBackpack.push(heavyGloves);
  }

  // Beanie / Warm Hat
  if (effectiveFeltTemp < 10 || activeScenario.mode === 'static_standing') {
    const beanie = findItem(g => g.category === 'accessories' && (g.name.toLowerCase().includes('mütze') || g.name.toLowerCase().includes('stirnband') || g.name.toLowerCase().includes('beanie')));
    if (beanie && !wearOnBody.some(g => g.id === beanie.id) && !packInBackpack.some(g => g.id === beanie.id)) {
      if (activeScenario.mode === 'static_standing' && weather.valleyTempC < 12) wearOnBody.push(beanie);
      else packInBackpack.push(beanie);
    }
  }

  // Thermos or Water
  const thermos = findItem(g => g.name.toLowerCase().includes('thermos'));
  if (thermos && (effectiveFeltTemp < 10 || isWinterActivity || activeScenario.mode === 'static_standing')) {
    if (!packInBackpack.some(g => g.id === thermos.id)) {
      packInBackpack.push({ 
        ...thermos, 
        notes: activeScenario.mode === 'static_standing'
          ? `Heißer Tee/Brühe: Bei ${activeScenario.staticDurationHours}h Stehen im Freien unverzichtbar gegen Auskühlung des Körperkerns!`
          : 'Mit heißem Kräuter-/Ingwertee befüllen (ca. 1 Liter).' 
      });
    }
  }

  // 9. BREAKS & PACING STRATEGY
  const breaks: BreakRecommendation[] = [];

  if (activeScenario.mode === 'static_standing') {
    // Specialized micro-break / active thermal routines for static outdoor exposure
    const duration = activeScenario.staticDurationHours || 2;
    const intervals = Math.max(2, Math.round(duration * 2)); // every 30-45 mins

    for (let i = 1; i <= intervals; i++) {
      const minutes = Math.round((i / intervals) * duration * 60);
      const isHalfway = i === Math.ceil(intervals / 2);
      breaks.push({
        km: 0,
        altitudeM: tour.minAltitudeM,
        title: isHalfway 
          ? `Heißgetränk & Kernwärme-Check (nach ${minutes} Min. Standzeit)`
          : `Wärme-Aktivierung #${i} (nach ${minutes} Min.)`,
        timeEstimate: `${minutes} Min. Standzeit`,
        tip: isHalfway
          ? 'Mindestens 200–300 ml heißen Tee/Brühe trinken. Nicht auf kaltem Untergrund verharren (Füße auf Rucksack/Matte stellen).'
          : '3 Minuten Wadenheber, Kniebeugen und Armkreisen durchführen, um den Blutfluss in die Zehen und Finger zurückzuholen.',
        clothingTip: 'Schichten geschlossen halten! Daunenkapuze oder Mütze fest über die Ohren ziehen.',
        hydrationKcal: isHalfway 
          ? '250 ml heißer Kräutertee + 250 kcal wärmende Kohlenhydrate (Nüsse, Schokolade)' 
          : 'Kleine Schlucke warmes Getränk'
      });
    }
  } else {
    const totalEle = tour.elevationGainM;
    const numBreaks = Math.max(1, Math.floor(tour.estimatedHours / 2));

    for (let i = 1; i <= numBreaks; i++) {
      const breakRatio = i / (numBreaks + 1);
      const breakKm = Math.round(tour.distanceKm * breakRatio * 10) / 10;
      const breakAlt = Math.round(tour.minAltitudeM + (totalEle * breakRatio));
      const isPeakBreak = i === Math.ceil(numBreaks / 2);

      breaks.push({
        km: breakKm,
        altitudeM: breakAlt,
        title: isPeakBreak ? `Gipfel- / Hauptpause (${breakAlt}m)` : `Trink- & Energierast #${i} (${breakAlt}m)`,
        timeEstimate: `ca. nach ${(tour.estimatedHours * breakRatio).toFixed(1)} Std. Gehzeit`,
        tip: isPeakBreak 
          ? 'Windgeschützte Mulde suchen. Ausgesetzte Grate meiden. Rundumblick genießen und Zeitplan für Abstieg prüfen.' 
          : 'Puls senken, tief atmen. Schuhe nachschnüren falls nötig.',
        clothingTip: isPeakBreak || windchillC < 10
          ? '⚠️ Daunenjacke oder Windjacke SOFORT überziehen, bevor der Schweiß verdunstet und Unterkühlung eintritt!'
          : 'Schicht öffnen oder Ärmel hochkrempeln, um Wärmestau zu vermeiden.',
        hydrationKcal: isPeakBreak 
          ? '300-400 ml Flüssigkeit + ca. 350 kcal (Vollkornbrot, Bergkäse, Nüsse)' 
          : '200 ml Elektrolytgetränk + 1 Energieriegel (ca. 150 kcal)'
      });
    }
  }

  // Helper to estimate packed volume of each item in liters
  function estimateItemVolume(item: GearItem): number {
    if (item.category === 'backpack') return 0; // The pack itself or pack liner
    if (item.category === 'hardshell') return 1.5;
    if (item.category === 'midlayer') {
      const lower = item.name.toLowerCase();
      if (lower.includes('daune')) return 2.4;
      if (lower.includes('fleece')) return 1.6;
      return 1.8;
    }
    if (item.category === 'baselayer') return 0.8;
    if (item.category === 'pants') return 1.2;
    if (item.category === 'food_hydration') return 1.8;
    if (item.category === 'safety') {
      const lower = item.name.toLowerCase();
      if (lower.includes('schaufel')) return 2.5;
      if (lower.includes('sonde')) return 0.7;
      if (lower.includes('erste-hilfe') || lower.includes('notfall')) return 1.2;
      if (lower.includes('biwak')) return 0.9;
      if (lower.includes('lvs') || lower.includes('lampe')) return 0.4;
      return 1.2;
    }
    if (item.category === 'hardware') {
      const lower = item.name.toLowerCase();
      if (lower.includes('steigeisen')) return 2.0;
      if (lower.includes('klettersteig') || lower.includes('gurt')) return 2.0;
      if (lower.includes('schneeschuh')) return 0.5; // Außen am Rucksack fixiert
      if (lower.includes('reparatur') || lower.includes('multitool')) return 0.8;
      return 1.5;
    }
    if (item.category === 'accessories') return 0.8;
    return 1.0;
  }

  // Calculate total volume needed in liters
  const itemsVolume = packInBackpack.reduce((sum, item) => sum + estimateItemVolume(item), 0);
  // Add base reserve of 3-4 liters for personal items, wallet, smartphone, topo map & breathing space
  const totalRequiredVolumeLiters = Math.round((itemsVolume + 3.2) * 10) / 10;

  // Find all available backpacks and bags in closet
  const availableBackpacks = closet.filter(g => g.category === 'backpack');

  // Match best backpack for the tour
  let recommendedBackpack: GearItem | undefined = undefined;

  if (availableBackpacks.length > 0) {
    // 1. Sport-specific matching
    if (tour.sport === 'trailrunning') {
      recommendedBackpack = availableBackpacks.find(b => b.backpackType === 'trail_vest' || b.sports.includes('trailrunning')) || availableBackpacks[0];
    } else if (tour.sport === 'mountainbike' || tour.sport === 'ebike' || tour.sport === 'gravel_bike' || tour.sport === 'road_bike') {
      // For short rides with minimal gear, consider hip bag, otherwise bike pack
      if (totalRequiredVolumeLiters <= 4.5 && availableBackpacks.some(b => b.backpackType === 'hip_bag')) {
        recommendedBackpack = availableBackpacks.find(b => b.backpackType === 'hip_bag');
      } else {
        recommendedBackpack = availableBackpacks.find(b => b.backpackType === 'bike_bag' || b.sports.includes(tour.sport)) || availableBackpacks[0];
      }
    } else if (tour.sport === 'skitour' || tour.sport === 'freeride' || tour.sport === 'ice_climbing' || tour.sport === 'mountaineering') {
      // Alpine / ski tour requires separate safety compartment & 30-40L
      recommendedBackpack = availableBackpacks.find(b => b.backpackType === 'alpine_tour' && (b.volumeLiters || 0) >= 28)
        || availableBackpacks.find(b => (b.volumeLiters || 0) >= totalRequiredVolumeLiters && b.sports.includes(tour.sport))
        || availableBackpacks[0];
    } else if (tour.sport === 'trekking') {
      // Multi-day trekking
      recommendedBackpack = availableBackpacks.find(b => b.backpackType === 'trekking' || (b.volumeLiters || 0) >= 40)
        || availableBackpacks.find(b => (b.volumeLiters || 0) >= totalRequiredVolumeLiters)
        || availableBackpacks[0];
    } else {
      // Hiking, Via Ferrata, etc.
      // Pick the best fitting pack (volume >= required volume, favor favorites)
      const fitting = availableBackpacks.filter(b => (b.volumeLiters || 20) >= totalRequiredVolumeLiters * 0.85);
      if (fitting.length > 0) {
        // Prefer favorite or closest capacity match
        recommendedBackpack = fitting.find(b => b.isFavorite) || fitting.sort((a, b) => (a.volumeLiters || 0) - (b.volumeLiters || 0))[0];
      } else {
        // Fallback to highest volume available
        recommendedBackpack = [...availableBackpacks].sort((a, b) => (b.volumeLiters || 0) - (a.volumeLiters || 0))[0];
      }
    }
  }

  // Calculate backpack utilization
  const bpCapacity = recommendedBackpack?.volumeLiters || 28;
  const backpackUtilizationPercent = Math.min(100, Math.round((totalRequiredVolumeLiters / bpCapacity) * 100));

  // Check if no backpack or if capacity is heavily overloaded
  if (!recommendedBackpack) {
    const suggestedSize = Math.max(15, Math.ceil(totalRequiredVolumeLiters / 5) * 5);
    missingEssentialGear.push(`Passender Rucksack (ca. ${suggestedSize}L für ${tour.name})`);
  } else if (backpackUtilizationPercent > 105) {
    missingEssentialGear.push(`Größerer Rucksack empfohlen (${recommendedBackpack.name} mit ${bpCapacity}L ist zu klein für ${totalRequiredVolumeLiters}L Packvolumen)`);
  }

  // Ergonomic packing zones guidance
  const backpackAdvice = {
    title: recommendedBackpack 
      ? `${recommendedBackpack.name} (${bpCapacity} Liter)` 
      : `Empfohlenes Packvolumen: ca. ${totalRequiredVolumeLiters} Liter`,
    badge: `${totalRequiredVolumeLiters}L benötigt / ${bpCapacity}L Kapazität (${backpackUtilizationPercent}% Auslastung)`,
    description: recommendedBackpack
      ? `Für diese Tour mit ${packInBackpack.length} Rucksack-Teilen ist der ${recommendedBackpack.brand} ${recommendedBackpack.name} mit ${bpCapacity}L Fassungsvermögen ideal dimensioniert.`
      : `Für die gewählte Tour und Ausrüstung wird ein Rucksack mit mindestens ${Math.ceil(totalRequiredVolumeLiters)} Litern Volumen benötigt.`,
    packingZones: [
      {
        zone: 'Bodenfach (Unten)',
        items: 'Daunenjacke, Packsack, Hüttenschlafsack',
        tip: 'Leichte, komprimierbare Daunen- und Isolationskleidung bildet ein weiches Fundament.'
      },
      {
        zone: 'Rückennah (Schwerpunkt)',
        items: 'Wasserblase/Thermoskanne, Lawinenschaufel & Sonde, Klettersteigset',
        tip: 'Schwere Ausrüstung dicht am Rücken auf Schulterhöhe zentrieren – verhindert Rücklage und Hebelkräfte!'
      },
      {
        zone: 'Hauptfach (Mitte & Außen)',
        items: 'Hardshelljacke, Wechselshirt, Proviantdose',
        tip: 'Mittelschwere Kleidung füllt den Außenbereich und stabilisiert die Ladung.'
      },
      {
        zone: 'Deckelfach / Frontzugriff (Sofort parat)',
        items: 'Erste-Hilfe-Set, Notfall-Biwaksack, Stirnlampe, Sonnenbrille & Riegel',
        tip: 'Muss in Sekundenschnelle greifbar sein, ohne den ganzen Rucksack ausräumen zu müssen.'
      }
    ],
    tips: [
      'Lastkontrollriemen an den Schultern anziehen, um den Rucksack nahe an den Körper zu holen.',
      'Hüftgurt trägt ca. 70-80% des Gewichts auf dem Beckenkamm – Schultern werden entlastet.',
      'Teleskopstöcke und Eispickel stets mit den Spitzen nach unten an den Außenschlaufen sichern.',
      'Wasserdichten Dry-Bag Packsack für Daunenjacke und Wechselwäsche nutzen, falls Dauerregen einsetzt.'
    ]
  };

  // Calculate total pack weight (including backpack own weight)
  const itemsWeightGrams = packInBackpack.reduce((acc, item) => acc + item.weightGrams, 0);
  const backpackWeightGrams = recommendedBackpack ? recommendedBackpack.weightGrams : 1200;
  const totalWeightKg = Math.round(((itemsWeightGrams + backpackWeightGrams) / 1000) * 10) / 10;

  // Avalanche alert block if level >= 2
  let avalancheRiskAlert = undefined;
  if (weather.avalancheLevel >= 2) {
    const titles = [
      '',
      'Stufe 1 (Gering): Weitgehend sichere Verhältnisse',
      'Stufe 2 (Mäßig): Gefahrenstellen an Steilhängen beachten',
      'Stufe 3 (Erheblich): KRITISCH! Auslösung bereits durch geringe Zusatzbelastung wahrscheinlich',
      'Stufe 4 (Groß): AKUTE GEFAHR! Auf mäßig steiles Gelände (< 30°) beschränken',
      'Stufe 5 (Sehr groß): Katastrophale Lage! Keine Touren im freien Gelände!'
    ];
    avalancheRiskAlert = {
      level: weather.avalancheLevel,
      title: titles[weather.avalancheLevel],
      mandatoryChecklist: [
        'LVS-Gruppentest vor Tourstart am Parkplatz durchführen (Sende- & Empfangscheck)',
        'Lawinensonde & Metall-Schaufel im Rucksack griffbereit haben (nicht tief verpackt)',
        'Hangneigungen über 30° mit Hangneigungsmesser / Karte vorab analysieren',
        'Entlastungsabstände bei Aufstieg (10m) und Abfahrt (Einzeln fahren) einhalten'
      ]
    };
  }

  return {
    tour,
    weather,
    wearOnBody,
    packInBackpack,
    mandatorySafety,
    missingEssentialGear,
    breaks,
    totalWeightKg,
    avalancheRiskAlert,
    adaptiveLearningNote: learnedNotice || undefined,
    appliedScenario: activeScenario,
    scenarioAdvice,
    recommendedBackpack,
    availableBackpacks,
    totalRequiredVolumeLiters,
    backpackUtilizationPercent,
    backpackAdvice
  };
}
