import { GearItem, GpxTour, UserProfile } from '../types/app';

export const INITIAL_GEAR: GearItem[] = [
  // Baselayer
  {
    id: 'gear-1',
    name: 'Merinowolle Longsleeve 200g/m²',
    brand: 'Icebreaker Oasis',
    category: 'baselayer',
    weightGrams: 210,
    tempMin: -15,
    tempMax: 12,
    isWaterproof: false,
    isWindproof: false,
    sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe'],
    condition: 'Sehr gut',
    isFavorite: true,
    notes: 'Geruchshemmend, wärmt auch in feuchtem Zustand.'
  },
  {
    id: 'gear-2',
    name: 'Technisches Kurzarm-Shirt Coolmax',
    brand: 'Patagonia Capilene',
    category: 'baselayer',
    weightGrams: 115,
    tempMin: 12,
    tempMax: 32,
    isWaterproof: false,
    isWindproof: false,
    sports: ['hiking', 'trailrunning', 'via_ferrata', 'gravel_bike'],
    condition: 'Neuwertig',
    notes: 'Extrem schnelltrocknend für schweißtreibende Aufstiege.'
  },

  // Midlayer
  {
    id: 'gear-3',
    name: 'Waffelfleece Midlayer mit Kapuze',
    brand: 'Ortovox Fleece Light',
    category: 'midlayer',
    weightGrams: 330,
    tempMin: -5,
    tempMax: 15,
    isWaterproof: false,
    isWindproof: false,
    sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe', 'via_ferrata'],
    condition: 'Sehr gut',
    notes: 'Atmungsaktive Waffelstruktur innen, ergonomische Helm-Kapuze.'
  },
  {
    id: 'gear-4',
    name: 'Ultraleichte Daunenjacke 800 cuin',
    brand: 'Mountain Equipment Frostline',
    category: 'midlayer',
    weightGrams: 360,
    tempMin: -25,
    tempMax: 5,
    isWaterproof: false,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe'],
    condition: 'Neuwertig',
    notes: 'Gipfel- und Rast-Isolation, komprimierbar auf Faustgröße.'
  },

  // Hardshell & Wetterschutz
  {
    id: 'gear-5',
    name: 'Gore-Tex Pro 3-Lagen Alpinjacke',
    brand: 'Mammut Nordwand Pro',
    category: 'hardshell',
    weightGrams: 490,
    tempMin: -30,
    tempMax: 10,
    isWaterproof: true,
    isWindproof: true,
    sports: ['mountaineering', 'skitour', 'snowshoe', 'hiking'],
    condition: 'Sehr gut',
    isFavorite: true,
    notes: '28.000 mm Wassersäule, helmtauglich, sturmfest am Grat.'
  },
  {
    id: 'gear-6',
    name: 'Paclite Not-Regenhose 2.5 Lagen',
    brand: 'Black Diamond StormLine',
    category: 'hardshell',
    weightGrams: 275,
    tempMin: -10,
    tempMax: 15,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'via_ferrata', 'gravel_bike'],
    condition: 'Sehr gut',
    notes: 'Durchgehende Seitenreißverschlüsse für schnelles Überziehen mit Schuhen.'
  },

  // Hosen
  {
    id: 'gear-7',
    name: 'Robuste 4-Wege-Stretch Softshellhose',
    brand: 'Salewa Terminal DST',
    category: 'pants',
    weightGrams: 390,
    tempMin: -5,
    tempMax: 18,
    isWaterproof: false,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'via_ferrata', 'snowshoe'],
    condition: 'Sehr gut',
    notes: 'Wasserabweisend DWR, Kantenschutz an den Beinenden.'
  },

  // Schuhe
  {
    id: 'gear-8',
    name: 'Bergschuhe Kat. B/C steigeisenfest (Kipphebel hinten)',
    brand: 'La Sportiva Nepal Trek',
    category: 'footwear',
    weightGrams: 1580,
    tempMin: -20,
    tempMax: 15,
    isWaterproof: true,
    isWindproof: true,
    sports: ['mountaineering', 'snowshoe', 'hiking'],
    condition: 'Sehr gut',
    notes: 'Steife Brandsohle für Steigeisen & Schotterkare.'
  },
  {
    id: 'gear-9',
    name: 'Gore-Tex Trailrunningschuhe mit Spikegrip',
    brand: 'Salomon Speedcross 6 GTX',
    category: 'footwear',
    weightGrams: 640,
    tempMin: 0,
    tempMax: 22,
    isWaterproof: true,
    isWindproof: true,
    sports: ['trailrunning', 'hiking'],
    condition: 'Gebraucht',
    notes: 'Tiefes Chevron-Stollenprofil für Schlamm, Nässe und weichen Boden.'
  },

  // Hardware & Technische Ausrüstung
  {
    id: 'gear-10',
    name: 'Leichtsteigeisen 10-Zacker mit Antistollplatten',
    brand: 'Petzl Vasak Leverlock',
    category: 'hardware',
    weightGrams: 810,
    tempMin: -30,
    tempMax: 5,
    isWaterproof: true,
    isWindproof: true,
    sports: ['mountaineering', 'skitour'],
    condition: 'Neuwertig',
    notes: 'Unverzichtbar bei Altschneefeldern, Gletscherquerungen und vereisten Rinnen.'
  },
  {
    id: 'gear-11',
    name: 'MSR Lightning Ascent Schneeschuhe 25"',
    brand: 'MSR Lightning',
    category: 'hardware',
    weightGrams: 1910,
    tempMin: -30,
    tempMax: 5,
    isWaterproof: true,
    isWindproof: true,
    sports: ['snowshoe'],
    condition: 'Sehr gut',
    notes: 'Aggressive 360°-Traktionsrahmen und Ergo-Steighilfe für steiles Wintergelände.'
  },
  {
    id: 'gear-12',
    name: 'Grödel / Schuhketten Pro Spikes',
    brand: 'Snowline Chainsen Pro',
    category: 'hardware',
    weightGrams: 360,
    tempMin: -20,
    tempMax: 5,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'snowshoe', 'trailrunning'],
    condition: 'Sehr gut',
    notes: '1cm lange Stahlkrallen für vereiste Wanderwege und feste Schneedecken.'
  },
  {
    id: 'gear-13',
    name: 'Klettersteigset mit Bandfalldämpfer',
    brand: 'Edelrid Cable Comfort 5.0',
    category: 'hardware',
    weightGrams: 570,
    tempMin: -10,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['via_ferrata', 'mountaineering'],
    condition: 'Neuwertig',
    notes: 'One-Touch Karabiner mit Wirbel gegen Verdrehen der Arme.'
  },
  {
    id: 'gear-14',
    name: 'Bergsteiger- & Klettersteighelm EPS',
    brand: 'Petzl Meteor',
    category: 'hardware',
    weightGrams: 240,
    tempMin: -20,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['via_ferrata', 'mountaineering', 'skitour'],
    condition: 'Neuwertig',
    notes: 'Zertifiziert für Steinschlag und Skitourennorm CE PCSR-001.'
  },

  // ZWINGENDE SICHERHEITSAUSRÜSTUNG (LVS etc.)
  {
    id: 'gear-15',
    name: 'LVS-Gerät 3-Antennen Digital (Suchbreite 70m)',
    brand: 'Mammut Barryvox S',
    category: 'safety',
    weightGrams: 210,
    tempMin: -25,
    tempMax: 10,
    isWaterproof: true,
    isWindproof: true,
    sports: ['skitour', 'snowshoe', 'mountaineering'],
    condition: 'Neuwertig',
    isMandatorySafety: true,
    isFavorite: true,
    notes: 'Akustische und optische Zielführung, Gruppentest-Funktion, W-Link.'
  },
  {
    id: 'gear-16',
    name: 'Lawinensonde Aluminium 280cm mit Schnellspannsystem',
    brand: 'Ortovox Alu 280+ PFA',
    category: 'safety',
    weightGrams: 310,
    tempMin: -30,
    tempMax: 10,
    isWaterproof: true,
    isWindproof: true,
    sports: ['skitour', 'snowshoe', 'mountaineering'],
    condition: 'Neuwertig',
    isMandatorySafety: true,
    notes: 'Tiefenskalierung mit Farbcodierung, blitzschnell gespannt.'
  },
  {
    id: 'gear-17',
    name: 'Lawinenschaufel Gehärtetes Aluminium mit D-Griff',
    brand: 'Ortovox Pro Alu III',
    category: 'safety',
    weightGrams: 770,
    tempMin: -30,
    tempMax: 10,
    isWaterproof: true,
    isWindproof: true,
    sports: ['skitour', 'snowshoe', 'mountaineering'],
    condition: 'Neuwertig',
    isMandatorySafety: true,
    notes: 'Scharfe Schneide, 90°-Räumfunktion (Hackfunktion) für Hartschnee.'
  },
  {
    id: 'gear-18',
    name: 'Alpine Notfalltasche (Erste-Hilfe + Rettungsdecke)',
    brand: 'Deuter First Aid Kit Pro',
    category: 'safety',
    weightGrams: 340,
    tempMin: -30,
    tempMax: 40,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'trailrunning', 'mountaineering', 'skitour', 'snowshoe', 'via_ferrata', 'gravel_bike'],
    condition: 'Sehr gut',
    isMandatorySafety: true,
    notes: 'Verbandsmaterial, Sam-Splint Schiene, Zeckenzange, Dreiecktuch.'
  },
  {
    id: 'gear-19',
    name: 'Biwaksack Thermo 2 Personen reflektierend',
    brand: 'Ortovox Bivy Double',
    category: 'safety',
    weightGrams: 390,
    tempMin: -30,
    tempMax: 20,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe', 'via_ferrata'],
    condition: 'Neuwertig',
    isMandatorySafety: true,
    notes: 'Silberbeschichtung innen zur Wärmereflexion bei ungeplantem Notbiwak.'
  },
  {
    id: 'gear-20',
    name: 'Stirnlampe 450 Lumen mit Rotlicht & Akku',
    brand: 'Petzl Actik Core',
    category: 'safety',
    weightGrams: 75,
    tempMin: -20,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'trailrunning', 'mountaineering', 'skitour', 'snowshoe', 'via_ferrata'],
    condition: 'Sehr gut',
    isMandatorySafety: true,
    notes: 'USB-C wiederaufladbar, IPX4 spritzwassergeschützt.'
  },

  // Zubehör & Essen
  {
    id: 'gear-21',
    name: 'Gletscher- & Höhen-Sonnenbrille Kat. 4 mit Seitenschutz',
    brand: 'Julbo Explorer 2.0',
    category: 'accessories',
    weightGrams: 44,
    tempMin: -30,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['mountaineering', 'skitour', 'snowshoe', 'hiking'],
    condition: 'Sehr gut',
    notes: '95% UV/Lichtfilterung gegen Schneeblindheit im Hochgebirge.'
  },
  {
    id: 'gear-22',
    name: 'Winddichte Softshell-Fingerhandschuhe',
    brand: 'Black Diamond Wind Hood Grid Tech',
    category: 'accessories',
    weightGrams: 90,
    tempMin: -2,
    tempMax: 12,
    isWaterproof: false,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe', 'trailrunning'],
    condition: 'Sehr gut',
    notes: 'Mit verstaubarer winddichter Fäustling-Kappe.'
  },
  {
    id: 'gear-23',
    name: 'Expeditions-Fausthandschuhe Primaloft Gold',
    brand: 'Hestra Army Leather Extreme',
    category: 'accessories',
    weightGrams: 280,
    tempMin: -30,
    tempMax: -5,
    isWaterproof: true,
    isWindproof: true,
    sports: ['skitour', 'snowshoe', 'mountaineering'],
    condition: 'Sehr gut',
    notes: 'Für bittere Kälte, stürmische Grate und Wintergipfel.'
  },
  {
    id: 'gear-24',
    name: 'Isolierte Edelstahl-Thermosflasche 1.0L',
    brand: 'Thermos Mountain FFB',
    category: 'food_hydration',
    weightGrams: 480,
    tempMin: -30,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe', 'winter_hiking', 'ice_climbing'],
    condition: 'Sehr gut',
    notes: 'Hält heißen Ingwer-Tee bis zu 24 Stunden dampfend warm.'
  },
  // Neue Ausrüstung für Bergfex-Sportarten
  {
    id: 'gear-25',
    name: 'Alpin-Klettergurt verstellbar',
    brand: 'Petzl Corax LT',
    category: 'hardware',
    weightGrams: 420,
    tempMin: -25,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['via_ferrata', 'climbing', 'mountaineering', 'ice_climbing'],
    condition: 'Neuwertig',
    isMandatorySafety: true,
    isFavorite: true,
    notes: '4 Materialschlaufen, weite Beinschlaufen für dicke Hochtourenhosen.'
  },
  {
    id: 'gear-26',
    name: 'Klettersteigset mit Bandfalldämpfer',
    brand: 'Edelrid Cable Comfort 5.0',
    category: 'safety',
    weightGrams: 540,
    tempMin: -20,
    tempMax: 40,
    isWaterproof: true,
    isWindproof: true,
    sports: ['via_ferrata'],
    condition: 'Neuwertig',
    isMandatorySafety: true,
    isFavorite: true,
    notes: 'One-Touch Karabiner mit Klemmschutz, elastische Äste.'
  },
  {
    id: 'gear-27',
    name: 'MTB Enduro- & Trail-Helm mit MIPS',
    brand: 'POC Kortal Race MIPS',
    category: 'safety',
    weightGrams: 390,
    tempMin: -10,
    tempMax: 40,
    isWaterproof: true,
    isWindproof: false,
    sports: ['mountainbike', 'ebike', 'gravel_bike'],
    condition: 'Neuwertig',
    isMandatorySafety: true,
    isFavorite: true,
    notes: 'Erweiterte Schläfen- und Hinterkopfabdeckung, RECCO-Reflektor.'
  },
  {
    id: 'gear-28',
    name: 'Fahrrad-Multitool & Tubeless-Reparaturset',
    brand: 'Topeak Alien II + TubiCartridge',
    category: 'hardware',
    weightGrams: 290,
    tempMin: -20,
    tempMax: 45,
    isWaterproof: true,
    isWindproof: true,
    sports: ['mountainbike', 'ebike', 'gravel_bike', 'road_bike'],
    condition: 'Sehr gut',
    isMandatorySafety: true,
    notes: 'Kettennieter, Speichenschlüssel, Inbusschlüssel, Plugs gegen Durchstiche.'
  },
  {
    id: 'gear-29',
    name: 'Hüttenschlafsack Seide ultraleicht',
    brand: 'Cocoon Silk MummyLiner',
    category: 'accessories',
    weightGrams: 135,
    tempMin: 0,
    tempMax: 25,
    isWaterproof: false,
    isWindproof: false,
    sports: ['trekking', 'hiking', 'mountaineering'],
    condition: 'Neuwertig',
    notes: 'Pflicht auf allen Alpenvereinshütten (DAV/ÖAV/SAC).'
  },
  {
    id: 'gear-30',
    name: 'Steileisgeräte-Paar mit Schaufel & Hammer',
    brand: 'Petzl Nomic Eisgeräte',
    category: 'hardware',
    weightGrams: 1170,
    tempMin: -35,
    tempMax: 5,
    isWaterproof: true,
    isWindproof: true,
    sports: ['ice_climbing', 'mountaineering'],
    condition: 'Sehr gut',
    isMandatorySafety: true,
    notes: 'Ergonomischer Hydroform-Griff für technisches Wasserfalleisklettern.'
  },
  {
    id: 'gear-31',
    name: 'Schuh-Spikes / Grödel mit Edelstahlzacken',
    brand: 'Nortec Trail Spikes',
    category: 'hardware',
    weightGrams: 180,
    tempMin: -25,
    tempMax: 10,
    isWaterproof: true,
    isWindproof: true,
    sports: ['winter_hiking', 'hiking', 'trailrunning'],
    condition: 'Sehr gut',
    isMandatorySafety: true,
    notes: 'Schnelles Überziehen über normale Schuhe bei vereisten Berg- und Winterwegen.'
  },
  {
    id: 'gear-32',
    name: 'Langlauf-Windblocker Weste & Handschuhe',
    brand: 'Löffler Windstopper Transtex',
    category: 'midlayer',
    weightGrams: 220,
    tempMin: -15,
    tempMax: 8,
    isWaterproof: false,
    isWindproof: true,
    sports: ['cross_country_ski', 'trailrunning'],
    condition: 'Sehr gut',
    notes: 'Gore Windstopper Membran vorne, hochelastischer Transtex-Rücken.'
  },

  // TASCHEN & RUCKSÄCKE (Rucksäcke, Westen, Packbeutel, Hüfttaschen)
  {
    id: 'gear-bp-1',
    name: 'Deuter Futura Pro 28 Berg- & Tagesrucksack',
    brand: 'Deuter',
    category: 'backpack',
    volumeLiters: 28,
    backpackType: 'daypack',
    weightGrams: 1280,
    tempMin: -25,
    tempMax: 40,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'via_ferrata', 'snowshoe', 'winter_hiking', 'sledging'],
    condition: 'Sehr gut',
    isFavorite: true,
    features: [
      'Belüfteter Aircomfort Netzrücken',
      'Integrierte abnehmbare Regenhülle (Signalgelb)',
      'Trinkblasenvorbereitung (bis 3.0 Liter)',
      'Trekkingstock- und Pickelhalterung',
      'Geräumige Hüftflossentaschen für Smartphone/Riegel'
    ],
    notes: 'Der ideale Allround-Tagesrucksack für Tagestouren im Mittel- und Hochgebirge. Perfekte Lastverteilung.'
  },
  {
    id: 'gear-bp-2',
    name: 'Ortovox Peak 35 Skitouren- & Hochtourenrucksack',
    brand: 'Ortovox',
    category: 'backpack',
    volumeLiters: 35,
    backpackType: 'alpine_tour',
    weightGrams: 1440,
    tempMin: -35,
    tempMax: 25,
    isWaterproof: true,
    isWindproof: true,
    sports: ['skitour', 'mountaineering', 'freeride', 'snowshoe', 'ice_climbing'],
    condition: 'Neuwertig',
    isFavorite: true,
    isMandatorySafety: true,
    features: [
      'Separates Lawinensicherheitsfach für Schaufel & Sonde (Sekundenschneller Zugriff)',
      'Diagonale und seitliche D-Skifixierung',
      'Swisswool-Vollkontakt-Rücken (trockenes Tragegefühl)',
      'Seilfixierung oben und 2 Eispickelhalterungen',
      'Umlaufender Front-Reißverschluss für Direktzugriff'
    ],
    notes: 'Robuster Alpinrucksack aus reißfestem Nylon 420D Oxford. Unverzichtbar für anspruchsvolle Ski- & Hochtouren.'
  },
  {
    id: 'gear-bp-3',
    name: 'Salomon Active Skin 8/12 Trailrunning-Laufweste',
    brand: 'Salomon',
    category: 'backpack',
    volumeLiters: 10,
    backpackType: 'trail_vest',
    weightGrams: 240,
    tempMin: -10,
    tempMax: 38,
    isWaterproof: false,
    isWindproof: false,
    sports: ['trailrunning', 'hiking', 'cross_country_ski'],
    condition: 'Neuwertig',
    isFavorite: true,
    features: [
      'Inkl. 2x 500ml Softflasks mit Beißventil vorn',
      'Sensifit-Konstruktion für scheuerfreien, körpernahen Sitz',
      'Elastische Custom-Pole Stockhalterung',
      'Rückenfach für ultraleichte Windjacke & Notfall-Biwaksack',
      'Integrierte Signalpfeife & Reflektoren'
    ],
    notes: 'Maximaler Komfort und Bewegungsfreiheit bei schnellen Bergläufen und Speed-Hikes. Kein Hüpfen der Last.'
  },
  {
    id: 'gear-bp-4',
    name: 'EVOC FR Trail 20L Protektor-Bikerucksack',
    brand: 'EVOC',
    category: 'backpack',
    volumeLiters: 20,
    backpackType: 'bike_bag',
    weightGrams: 1300,
    tempMin: -10,
    tempMax: 40,
    isWaterproof: true,
    isWindproof: true,
    sports: ['mountainbike', 'ebike', 'gravel_bike', 'road_bike'],
    condition: 'Sehr gut',
    isMandatorySafety: true,
    features: [
      'Integrierter Liteshield Rückenprotektor (CE-Norm EN 1621-2, Level 2, 95% Stoßdämpfung)',
      'Separates Werkzeugfach mit Schnellzugriff',
      'Helmträger für XC- und Fullface-Helme',
      'Trinkblasenfach bis 3 Liter isoliert',
      'Breiter, elastischer Airo-Flex Hüftgurt'
    ],
    notes: 'Kombiniert vollwertigen TÜV-geprüften Wirbelsäulenschutz mit optimalem Stauraum für technische Bike-Trails.'
  },
  {
    id: 'gear-bp-5',
    name: 'Ortlieb Dry-Bag PS10 Wasserdichter Packsack 10L',
    brand: 'Ortlieb',
    category: 'backpack',
    volumeLiters: 10,
    backpackType: 'dry_bag',
    weightGrams: 70,
    tempMin: -35,
    tempMax: 50,
    isWaterproof: true,
    isWindproof: true,
    sports: ['hiking', 'mountaineering', 'skitour', 'trekking', 'trailrunning'],
    condition: 'Neuwertig',
    features: [
      'IP64 staub- und spritzwasserdichter Rollverschluss mit Steckschnalle',
      'Extrem reißfestes, silikonisiertes Nylongewebe PS10',
      'Knicksicherer Rundboden mit Halteschlaufe zum schnellen Entleeren',
      'Schützt Daunenschlafsack, Daunenjacke & Elektronik absolut zuverlässig'
    ],
    notes: 'Federleichter Kompressions-Packbeutel. Hält Wechselwäsche und Daunenjacke im Rucksack selbst bei Wolkenbruch trocken.'
  },
  {
    id: 'gear-bp-6',
    name: 'EVOC Hip Pack Pro 3.5L Ergonomische Hüfttasche',
    brand: 'EVOC',
    category: 'backpack',
    volumeLiters: 4,
    backpackType: 'hip_bag',
    weightGrams: 390,
    tempMin: -5,
    tempMax: 38,
    isWaterproof: true,
    isWindproof: true,
    sports: ['mountainbike', 'gravel_bike', 'trailrunning', 'hiking', 'ebike'],
    condition: 'Sehr gut',
    features: [
      'Venti-Flap System: Vergrößert Rückenabstand für maximale Belüftung bergauf',
      '2 Flaschenhalterungen mit Sicherheitsfixierung',
      'Organizer-Fach für Minitool, Schlauch und Energieriegel',
      'Komfortabler Air-Flow Contact Rücken'
    ],
    notes: 'Perfekt für schweißfreie Feierabendrunden und kurze Bergtouren, wenn ein voller Rucksack zu warm ist.'
  },
  {
    id: 'gear-bp-7',
    name: 'Osprey Atmos AG 50 Trekking- & Mehrtagesrucksack',
    brand: 'Osprey',
    category: 'backpack',
    volumeLiters: 50,
    backpackType: 'trekking',
    weightGrams: 1960,
    tempMin: -30,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['trekking', 'mountaineering', 'hiking'],
    condition: 'Sehr gut',
    features: [
      'AntiGravity 3D-Netztragesystem (Last schwebt förmlich am Rücken)',
      'Verstellbare Fit-on-the-Fly Hüft- und Schultergurte',
      'Separates Schlafsack-Bodenfach mit interner Trennwand',
      'Stow-on-the-Go Trekkingstock-Halterung während des Gehens',
      'Integrierte, PFC-freie Regenhülle'
    ],
    notes: 'Das Nonplusultra für Mehrtageshütten-Touren, Alpenüberquerungen und Trekking mit voller Ausrüstung.'
  },
  {
    id: 'gear-bp-8',
    name: 'Mammut Trion Nordwand 20 Alpin- & Kletterrucksack',
    brand: 'Mammut',
    category: 'backpack',
    volumeLiters: 20,
    backpackType: 'alpine_tour',
    weightGrams: 580,
    tempMin: -30,
    tempMax: 35,
    isWaterproof: true,
    isWindproof: true,
    sports: ['climbing', 'via_ferrata', 'mountaineering', 'bouldering'],
    condition: 'Neuwertig',
    features: [
      'Weste-ähnliches Tragesystem für volle Schulterfreiheit beim Klettern',
      'Extrem abriebfestes Cordura-Ripstop-Gewebe',
      'Sichere Seilfixierung auf dem Rolltop',
      '2 stabile Eispickel- und Stockhalterungen',
      'Netztaschen an den Trägern für Topos & Energieriegel'
    ],
    notes: 'Entwickelt mit Mammut-Profialpinisten Dani Arnold für Speed-Begehungen an steilen Nordwänden und Graten.'
  }
];

export const INITIAL_TOURS: GpxTour[] = [
  {
    id: 'tour-1',
    name: 'Zugspitz-Gatterl & Knorrhütte',
    sport: 'hiking',
    region: 'Wettersteingebirge / Tirol & Bayern',
    isFavorite: true,
    distanceKm: 14.8,
    elevationGainM: 1480,
    elevationLossM: 420,
    maxAltitudeM: 2215,
    minAltitudeM: 1100,
    estimatedHours: 5.5,
    technicalDifficulty: 'T3',
    terrain: ['Almboden', 'Schotter & Felsstufen', 'Drahtseilsicherung am Gatterl'],
    description: 'Klassische Überschreitung von Ehrwald über das Gatterl auf das Zugspitzplatt. Abwechslungsreich mit Panoramablick auf die Mieminger Kette.',
    profilePoints: [
      { distKm: 0, altitudeM: 1100 },
      { distKm: 2.5, altitudeM: 1450 },
      { distKm: 5.2, altitudeM: 1720 },
      { distKm: 7.8, altitudeM: 1980 },
      { distKm: 9.4, altitudeM: 2215 },
      { distKm: 11.5, altitudeM: 2051 },
      { distKm: 14.8, altitudeM: 1950 }
    ]
  },
  {
    id: 'tour-2',
    name: 'Watzmann-Überschreitung (Hocheck – Mittelspitze – Südspitze)',
    sport: 'mountaineering',
    region: 'Berchtesgadener Alpen',
    distanceKm: 22.4,
    elevationGainM: 2390,
    elevationLossM: 2390,
    maxAltitudeM: 2713,
    minAltitudeM: 630,
    estimatedHours: 11.5,
    technicalDifficulty: 'T5',
    terrain: ['Ausgesetzter Felsgrat', 'Drahtseile I-II', 'Brüchiges Gestein', 'Steiler Abstieg Wimbachgries'],
    description: 'Eine der spektakulärsten Gratüberschreitungen der Ostalpen. Extrem ausgesetzt, konditionell sehr fordernd. Steinschlaghelm und Trittsicherheit Pflicht!',
    profilePoints: [
      { distKm: 0, altitudeM: 630 },
      { distKm: 4.0, altitudeM: 1390 },
      { distKm: 7.0, altitudeM: 1930 },
      { distKm: 9.5, altitudeM: 2651 }, // Hocheck
      { distKm: 11.0, altitudeM: 2713 }, // Mittelspitze
      { distKm: 12.8, altitudeM: 2712 }, // Südspitze
      { distKm: 16.5, altitudeM: 1320 }, // Wimbachgries
      { distKm: 22.4, altitudeM: 630 }
    ]
  },
  {
    id: 'tour-3',
    name: 'Silvretta Skitour Piz Buin (3.312m)',
    sport: 'skitour',
    region: 'Silvretta / Vorarlberg-Graubünden',
    isFavorite: true,
    distanceKm: 17.2,
    elevationGainM: 1340,
    elevationLossM: 1340,
    maxAltitudeM: 3312,
    minAltitudeM: 2037,
    estimatedHours: 6.5,
    technicalDifficulty: 'T4',
    terrain: ['Gletscher (Ochsentaler)', 'Spaltenzonen', 'Steile Gipfelflanke 38°', 'Kombiniertes Gelände'],
    description: 'Traumhafte Hochgebirgs-Skitour auf das Wahrzeichen der Silvretta. Pflicht: Komplette LVS-Ausrüstung, Harscheisen, Steigeisen & Pickel für die Gipfelscharte.',
    profilePoints: [
      { distKm: 0, altitudeM: 2037 },
      { distKm: 3.5, altitudeM: 2440 },
      { distKm: 7.2, altitudeM: 2850 },
      { distKm: 9.0, altitudeM: 3054 }, // Buinlücke
      { distKm: 10.2, altitudeM: 3312 }, // Gipfel
      { distKm: 12.0, altitudeM: 2850 },
      { distKm: 17.2, altitudeM: 2037 }
    ]
  },
  {
    id: 'tour-4',
    name: 'Fellhorn Winter-Grat-Schneeschuhtour',
    sport: 'snowshoe',
    region: 'Allgäuer Alpen / Oberstdorf',
    distanceKm: 11.5,
    elevationGainM: 890,
    elevationLossM: 890,
    maxAltitudeM: 2038,
    minAltitudeM: 1180,
    estimatedHours: 4.5,
    technicalDifficulty: 'T3',
    terrain: ['Tiefschnee', 'Verwehte Grate', 'Mäßig steile Nordwesthänge'],
    description: 'Wunderschöne Schneeschuhtour mit Weitblick in die schneebedeckten Allgäuer Hochalpen. Lawinenlagebericht zwingend beachten!',
    profilePoints: [
      { distKm: 0, altitudeM: 1180 },
      { distKm: 2.8, altitudeM: 1450 },
      { distKm: 5.5, altitudeM: 1780 },
      { distKm: 7.2, altitudeM: 2038 }, // Gipfel
      { distKm: 9.0, altitudeM: 1650 },
      { distKm: 11.5, altitudeM: 1180 }
    ]
  },
  {
    id: 'tour-5',
    name: 'Karwendel Alpine Trailrun: Scharnitz nach Halleranger',
    sport: 'trailrunning',
    region: 'Karwendel Gebirge',
    distanceKm: 19.1,
    elevationGainM: 1150,
    elevationLossM: 410,
    maxAltitudeM: 1768,
    minAltitudeM: 964,
    estimatedHours: 3.2,
    technicalDifficulty: 'T2',
    terrain: ['Forstwege', 'Schotter-Singletrails', 'Stufen & Wurzelpassagen'],
    description: 'Flotter Trailrun durch das wildromantische Hinterautal bis zum Fuß des Lafatscher Jochs. Leichtes Gepäck & Windweste empfohlen.',
    profilePoints: [
      { distKm: 0, altitudeM: 964 },
      { distKm: 6.0, altitudeM: 1120 },
      { distKm: 11.0, altitudeM: 1280 },
      { distKm: 15.5, altitudeM: 1520 },
      { distKm: 19.1, altitudeM: 1768 }
    ]
  },
  {
    id: 'tour-6',
    name: 'Innsbrucker Klettersteig (Nordkette Panoramagrat)',
    sport: 'via_ferrata',
    region: 'Karwendel / Nordkette Innsbruck',
    isFavorite: true,
    distanceKm: 8.4,
    elevationGainM: 920,
    elevationLossM: 920,
    maxAltitudeM: 2506,
    minAltitudeM: 1905,
    estimatedHours: 4.8,
    technicalDifficulty: 'T4',
    terrain: ['Felsgrat C/D', 'Drahtseile', 'Kaminpassagen', 'Hängebrücke'],
    description: 'Spektakulärer Grat-Klettersteig mit Tiefblick auf die Olympiastadt Innsbruck und ins wilde Karwendel. Klettersteigset mit Bandfalldämpfer und Steinschlaghelm obligatorisch.',
    profilePoints: [
      { distKm: 0, altitudeM: 1905 },
      { distKm: 1.5, altitudeM: 2260 },
      { distKm: 3.2, altitudeM: 2450 },
      { distKm: 4.5, altitudeM: 2506 }, // Hafelekarspitze
      { distKm: 6.0, altitudeM: 2320 },
      { distKm: 8.4, altitudeM: 1905 }
    ]
  },
  {
    id: 'tour-7',
    name: 'Karwendel-Runde MTB (Scharnitz – Karwendelhaus – Falkenhütte)',
    sport: 'mountainbike',
    region: 'Karwendelgebirge / Tirol',
    isFavorite: true,
    distanceKm: 58.2,
    elevationGainM: 1820,
    elevationLossM: 1820,
    maxAltitudeM: 1848,
    minAltitudeM: 964,
    estimatedHours: 5.5,
    technicalDifficulty: 'T2',
    terrain: ['Schotterwege', 'Steile Rampen bis 22%', 'Trails', 'Almböden'],
    description: 'Der König unter den Tiroler Mountainbike-Klassikern. Gewaltige Felswände der Laliderer Wände, rasante Schotterabfahrten und Einkehr auf der Falkenhütte.',
    profilePoints: [
      { distKm: 0, altitudeM: 964 },
      { distKm: 18.0, altitudeM: 1771 }, // Karwendelhaus
      { distKm: 26.5, altitudeM: 1050 }, // Kleiner Ahornboden
      { distKm: 36.0, altitudeM: 1848 }, // Falkenhütte
      { distKm: 45.0, altitudeM: 1200 },
      { distKm: 58.2, altitudeM: 964 }
    ]
  },
  {
    id: 'tour-8',
    name: 'Wilder Kaiser: Alpinklettern Fleischbank Ostwand (Dülfer)',
    sport: 'climbing',
    region: 'Kaisergebirge / Tirol',
    distanceKm: 6.8,
    elevationGainM: 1180,
    elevationLossM: 1180,
    maxAltitudeM: 2187,
    minAltitudeM: 820,
    estimatedHours: 7.5,
    technicalDifficulty: 'T5',
    terrain: ['Steiler Kalkfels UIAA V+', 'Wasserrillen', 'Ausgesetzte Standplätze', 'Schotterzustieg'],
    description: 'Historische alpine Meilenstein-Kletterei im Herzen des Wilden Kaisers. Solide alpine Absicherungserfahrung, Halbseile und Kletterhelm unerlässlich.',
    profilePoints: [
      { distKm: 0, altitudeM: 820 },
      { distKm: 2.5, altitudeM: 1570 },
      { distKm: 3.4, altitudeM: 2187 }, // Gipfel Fleischbank
      { distKm: 5.0, altitudeM: 1570 },
      { distKm: 6.8, altitudeM: 820 }
    ]
  },
  {
    id: 'tour-9',
    name: 'Berliner Höhenweg: Zillertaler Alpen Etappe Schönbichler Horn',
    sport: 'trekking',
    region: 'Zillertaler Alpen',
    distanceKm: 14.5,
    elevationGainM: 1380,
    elevationLossM: 1210,
    maxAltitudeM: 3134,
    minAltitudeM: 1876,
    estimatedHours: 6.8,
    technicalDifficulty: 'T4',
    terrain: ['Blockgelände', 'Drahtseile', 'Altschneefelder', 'Gipfelgrat über 3.000m'],
    description: 'Königsetappe der berühmten Hüttentour von der Berliner Hütte zum Furtschaglhaus. Querung des 3.134m hohen Schönbichler Horns mit atemberaubender Gletscherkulisse.',
    profilePoints: [
      { distKm: 0, altitudeM: 2042 }, // Berliner Hütte
      { distKm: 4.2, altitudeM: 2580 },
      { distKm: 7.8, altitudeM: 3134 }, // Schönbichler Horn
      { distKm: 11.2, altitudeM: 2295 }, // Furtschaglhaus
      { distKm: 14.5, altitudeM: 1876 }
    ]
  },
  {
    id: 'tour-10',
    name: 'Seefeld WM-Panoramaloipe Leutasch (Skating & Klassisch)',
    sport: 'cross_country_ski',
    region: 'Olympiaregion Seefeld / Leutaschtal',
    distanceKm: 24.0,
    elevationGainM: 260,
    elevationLossM: 260,
    maxAltitudeM: 1210,
    minAltitudeM: 1130,
    estimatedHours: 2.0,
    technicalDifficulty: 'T1',
    terrain: ['Perfekt präparierte Doppelspur', 'Breite Skating-Trasse', 'Leichte Wellen'],
    description: 'Weite Schneeflächen des Hochtals mit Blick auf Wetterstein und Karwendel. Ideale Bedingungen für Skating und klassischen Langlauf.',
    profilePoints: [
      { distKm: 0, altitudeM: 1130 },
      { distKm: 6.0, altitudeM: 1170 },
      { distKm: 12.0, altitudeM: 1210 },
      { distKm: 18.0, altitudeM: 1160 },
      { distKm: 24.0, altitudeM: 1130 }
    ]
  },
  {
    id: 'tour-11',
    name: 'Tannheimer Tal: Romantische Winterwanderung Vilsalpsee',
    sport: 'winter_hiking',
    region: 'Allgäuer Alpen / Tannheimer Tal',
    distanceKm: 9.8,
    elevationGainM: 190,
    elevationLossM: 190,
    maxAltitudeM: 1180,
    minAltitudeM: 1070,
    estimatedHours: 2.5,
    technicalDifficulty: 'T1',
    terrain: ['Gewalzter Winterwanderweg', 'Verschneiter Seeuferweg', 'Almwiesen'],
    description: 'Traumhafte Winterwanderung durch das Naturschutzgebiet Vilsalpsee. Klare Winterluft und grandiose Kulisse der schneebedeckten Tannheimer Berge.',
    profilePoints: [
      { distKm: 0, altitudeM: 1070 },
      { distKm: 4.9, altitudeM: 1180 },
      { distKm: 9.8, altitudeM: 1070 }
    ]
  },
  {
    id: 'tour-12',
    name: 'Taschachschlucht Pitztal: Wasserfalleisklettern (Eiswand WI4)',
    sport: 'ice_climbing',
    region: 'Ötztaler Alpen / Pitztal',
    distanceKm: 3.6,
    elevationGainM: 420,
    elevationLossM: 420,
    maxAltitudeM: 1940,
    minAltitudeM: 1520,
    estimatedHours: 4.5,
    technicalDifficulty: 'T5',
    terrain: ['Vertikales Blaueis 85°', 'Gefrorener Wasserfall', 'Eisschrauben-Standplätze'],
    description: 'Eines der schneesichersten Eiskletter-Eldorados Tirols. Technische Steileisgeräte, Monozacken-Steigeisen, Eisschrauben und Helm mit Visier erforderlich.',
    profilePoints: [
      { distKm: 0, altitudeM: 1520 },
      { distKm: 1.2, altitudeM: 1720 },
      { distKm: 1.8, altitudeM: 1940 }, // Eiswand Ausstieg
      { distKm: 3.6, altitudeM: 1520 }
    ]
  },
  {
    id: 'tour-13',
    name: 'Kitzbüheler Alpen: Großer Rettenstein E-MTB Panorama-Runde',
    sport: 'ebike',
    region: 'Kitzbüheler Alpen / Aschau',
    distanceKm: 34.6,
    elevationGainM: 1340,
    elevationLossM: 1340,
    maxAltitudeM: 1812,
    minAltitudeM: 860,
    estimatedHours: 3.5,
    technicalDifficulty: 'T2',
    terrain: ['Almfahrwege', 'Forststraßen', 'Panoramagrate mit Weitblick'],
    description: 'Aussichtsreiche E-Bike Rundfahrt rund um das markante Felsmassiv des Großen Rettensteins. Zahlreiche Akku-Ladestationen an den Almen.',
    profilePoints: [
      { distKm: 0, altitudeM: 860 },
      { distKm: 10.0, altitudeM: 1350 },
      { distKm: 18.5, altitudeM: 1812 },
      { distKm: 26.0, altitudeM: 1240 },
      { distKm: 34.6, altitudeM: 860 }
    ]
  }
];

export const INITIAL_USER_PROFILES: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Christian (Ich)',
    coldSensitivity: 'frierend', // Kälteempfindlich -> System schlägt wärmeren Midlayer vor
    safetyPriority: 'sicherheit_zuerst',
    experienceLevel: 'Fortgeschritten',
    feedbackHistory: [
      {
        id: 'fb-1',
        tourId: 'tour-1',
        tourName: 'Zugspitz-Gatterl',
        date: '2026-09-14',
        tempFeeling: 'zu_kalt',
        weightRating: 'optimal',
        gearMissed: ['Winddichte Handschuhe', 'Schlauchtuch'],
        gearUnused: ['Kurze Hose'],
        notes: 'Am Gatterl pfiff ein eisiger Nordwind bei 4°C. Hände waren ohne Handschuhe schnell klamm.'
      }
    ]
  },
  {
    id: 'user-2',
    name: 'Tourenpartner (Schnell schwitzend)',
    coldSensitivity: 'schwitzend',
    safetyPriority: 'ausgewogen',
    experienceLevel: 'Alpinist',
    feedbackHistory: []
  },
  {
    id: 'user-3',
    name: 'Gast / Neuer Account',
    coldSensitivity: 'normal',
    safetyPriority: 'ausgewogen',
    experienceLevel: 'Einsteiger',
    feedbackHistory: []
  }
];
