import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Camera, 
  RotateCcw, 
  Sparkles, 
  Weight, 
  Thermometer, 
  ShieldCheck, 
  Shirt,
  Backpack,
  Filter,
  Star,
  SlidersHorizontal,
  Pencil
} from 'lucide-react';
import { GearCategory, GearItem, SportType } from '../types/app';
import { INITIAL_GEAR } from '../data/outdoorData';
import { getSportInfo, SPORTS_MAP } from '../utils/sportsConstants';

interface GearClosetViewProps {
  gear: GearItem[];
  setGear: React.Dispatch<React.SetStateAction<GearItem[]>>;
  onOpenAiScanner: () => void;
  onToggleFavoriteGear: (gearId: string) => void;
  onEditGear?: (item: GearItem) => void;
}

export const GearClosetView: React.FC<GearClosetViewProps> = ({
  gear,
  setGear,
  onOpenAiScanner,
  onToggleFavoriteGear,
  onEditGear
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<GearCategory>('backpack');
  const [volumeLiters, setVolumeLiters] = useState('28');
  const [backpackType, setBackpackType] = useState<GearItem['backpackType']>('daypack');
  const [weight, setWeight] = useState('1100');
  const [tempMin, setTempMin] = useState('-25');
  const [tempMax, setTempMax] = useState('35');
  const [isWaterproof, setIsWaterproof] = useState(true);
  const [isWindproof, setIsWindproof] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [condition, setCondition] = useState<any>('Sehr gut');
  const [notes, setNotes] = useState('');

  const categoriesMap: Record<GearCategory, string> = {
    backpack: 'Taschen & Rucksäcke (Tages-, Ski-, Bikerucksäcke, Westen, Hüfttaschen, Drybags)',
    baselayer: 'Baselayer (Unterwäsche / Shirts)',
    midlayer: 'Midlayer (Fleece / Daune / Isolation)',
    hardshell: 'Hardshell (Wetterschutz / Regen)',
    pants: 'Hosen (Softshell / Trekking)',
    footwear: 'Schuhe (Bergschuhe / Trailrunner)',
    hardware: 'Hardware (Steigeisen / Schneeschuhe / Klettersteig)',
    safety: 'Sicherheit (LVS / Sonde / Schaufel / Erste Hilfe)',
    accessories: 'Zubehör (Handschuhe / Brillen / Stirnlampe)',
    food_hydration: 'Verpflegung & Thermosflaschen'
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: GearItem = {
      id: `gear-${Date.now()}`,
      name: name.trim(),
      brand: brand.trim() || 'Outdoor',
      category,
      volumeLiters: category === 'backpack' ? (parseInt(volumeLiters, 10) || 28) : undefined,
      backpackType: category === 'backpack' ? backpackType : undefined,
      weightGrams: parseInt(weight, 10) || (category === 'backpack' ? 1200 : 250),
      tempMin: parseInt(tempMin, 10) || -10,
      tempMax: parseInt(tempMax, 10) || 20,
      isWaterproof,
      isWindproof,
      isFavorite,
      sports: ['hiking', 'mountaineering', 'skitour', 'snowshoe'],
      condition,
      notes: notes.trim()
    };

    setGear(prev => [newItem, ...prev]);
    setName('');
    setBrand('');
    setNotes('');
    setIsFavorite(false);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setGear(prev => prev.filter(g => g.id !== id));
  };

  const handleReset = () => {
    setGear(INITIAL_GEAR);
  };

  const favoriteGearCount = gear.filter(g => !!g.isFavorite).length;

  const filteredGear = gear.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.brand.toLowerCase().includes(search.toLowerCase()) ||
                          (item.notes || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesFav = !showFavoritesOnly || !!item.isFavorite;
    const matchesSport = selectedSport === 'all' || (item.sports && item.sports.includes(selectedSport as SportType));
    return matchesSearch && matchesCat && matchesFav && matchesSport;
  });

  const totalClosetWeightKg = Math.round(gear.reduce((acc, g) => acc + g.weightGrams, 0) / 100) / 10;
  const safetyCount = gear.filter(g => g.category === 'safety' || g.isMandatorySafety).length;

  return (
    <div className="space-y-6 py-2">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Shirt className="w-4 h-4" />
              Mein Ausrüstungsschrank (Gear Closet)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
              Ausrüstung & Bekleidung verwalten
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Erfasse dein Equipment mit Gewichten und Temperaturbereichen für millimetergenaue Touren-Vorschläge.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleReset}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              onClick={onOpenAiScanner}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Mit KI-Kamera scannen</span>
            </button>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Manuell erfassen</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Gesamt im Schrank</div>
            <div className="text-lg font-bold text-white mt-0.5">{gear.length} Artikel</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              Favoriten (Go-To)
            </div>
            <div className="text-lg font-bold text-amber-300 mt-0.5">{favoriteGearCount} Teile</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Sicherheitsausrüstung</div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">{safetyCount} Teile</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400">Gesamtgewicht Schrank</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5 font-mono">
              {totalClosetWeightKg} kg
            </div>
          </div>
        </div>
      </div>

      {/* Manual Add Gear Form */}
      {isAdding && (
        <form 
          onSubmit={handleAdd}
          className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Neues Kleidungsstück / Ausrüstung erfassen
            </h3>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Abbrechen
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Artikelname *</label>
              <input
                type="text"
                required
                placeholder="z.B. Gore-Tex Pro Hardshelljacke oder Steigeisen 10-Zack"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Marke / Hersteller</label>
              <input
                type="text"
                placeholder="z.B. Ortovox, Mammut, Petzl"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Kategorie</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as GearCategory)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {Object.entries(categoriesMap).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {category === 'backpack' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-indigo-300 mb-1">
                    Volumen (Liter) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={volumeLiters}
                    onChange={e => setVolumeLiters(e.target.value)}
                    placeholder="z.B. 28"
                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-indigo-300 mb-1">
                    Taschen- / Rucksacktyp
                  </label>
                  <select
                    value={backpackType}
                    onChange={e => setBackpackType(e.target.value as GearItem['backpackType'])}
                    className="w-full bg-slate-950 border border-indigo-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="daypack">Tages- / Bergwanderrucksack (18-32L)</option>
                    <option value="alpine_tour">Alpin- & Skitourenrucksack (25-42L)</option>
                    <option value="trail_vest">Trailrunning-Laufweste (5-14L)</option>
                    <option value="bike_bag">Protektor- / Bikerucksack (12-25L)</option>
                    <option value="hip_bag">Hüfttasche / Hip Pack (2-6L)</option>
                    <option value="dry_bag">Wasserdichter Packbeutel / Drybag (5-20L)</option>
                    <option value="trekking">Trekking- & Schwerlastrucksack (45-75L)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Gewicht (Gramm)</label>
              <input
                type="number"
                min="0"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Zustand</label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Neuwertig">Neuwertig</option>
                <option value="Sehr gut">Sehr gut</option>
                <option value="Gebraucht">Gebraucht</option>
                <option value="Erneuerungsbedürftig">Erneuerungsbedürftig</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Min. Komfort-Temp (°C)</label>
              <input
                type="number"
                value={tempMin}
                onChange={e => setTempMin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Max. Komfort-Temp (°C)</label>
              <input
                type="number"
                value={tempMax}
                onChange={e => setTempMax(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWaterproof}
                  onChange={e => setIsWaterproof(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Wasserdicht</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWindproof}
                  onChange={e => setIsWindproof(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <span>Winddicht</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-amber-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={e => setIsFavorite(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0"
                />
                <span className="flex items-center gap-1 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Favorit
                </span>
              </label>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-slate-300 mb-1">Hinweise & Spezifikationen</label>
              <input
                type="text"
                placeholder="z.B. Gore-Tex Membran, Steigeisenfest, 3-Antennen LVS..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-slate-300 hover:text-white"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-sm"
            >
              Ausrüstung speichern
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Ausrüstung nach Name, Marke oder Eigenschaft durchsuchen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Favorites Filter Button */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
              showFavoritesOnly
                ? 'bg-amber-500 border-amber-500 text-slate-950'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-400'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-slate-950 text-slate-950' : 'fill-amber-400 text-amber-400'}`} />
            <span>Favoriten ({favoriteGearCount})</span>
          </button>

          {/* Sport Filter */}
          <select
            value={selectedSport}
            onChange={e => setSelectedSport(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Alle Sportarten (Bergfex)</option>
            {Object.values(SPORTS_MAP).map(sp => (
              <option key={sp.key} value={sp.key}>{sp.icon} {sp.label}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Alle Kategorien ({gear.length})</option>
            {Object.entries(categoriesMap).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gear Item List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredGear.map(item => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
              item.isFavorite
                ? 'bg-slate-900 border-amber-500/30 hover:border-amber-500/60 shadow-xs'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {item.name}
                    </h4>
                    {item.isFavorite && (
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 flex-wrap">
                    <span className="font-medium text-emerald-400">{item.brand}</span>
                    <span>·</span>
                    <span className="capitalize">{item.category === 'backpack' ? 'Taschen & Rucksack' : item.category}</span>
                    <span>·</span>
                    <span>{item.condition}</span>
                    {item.category === 'backpack' && typeof item.volumeLiters === 'number' && (
                      <span className="ml-1 px-2 py-0.5 rounded-md bg-indigo-950 border border-indigo-500/50 text-indigo-300 font-mono font-bold text-[11px] flex items-center gap-1">
                        <Backpack className="w-3 h-3 text-indigo-400" />
                        {item.volumeLiters} Liter
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {/* Manual Edit / Korrigieren Button */}
                  {onEditGear && (
                    <button
                      onClick={() => onEditGear(item)}
                      title="Ausrüstung manuell korrigieren / bearbeiten"
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-emerald-300 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                      aria-label="Ausrüstung korrigieren"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}

                  {/* Star Favorite Toggle */}
                  <button
                    onClick={() => onToggleFavoriteGear(item.id)}
                    title={item.isFavorite ? 'Aus Favoriten entfernen' : 'Als Favorit markieren'}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    aria-label="Favorit umschalten"
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Aus Schrank entfernen"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    aria-label="Löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Backpack Feature Highlights */}
              {item.features && item.features.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2.5 p-2 rounded-lg bg-slate-950/70 border border-indigo-900/40 text-[11px] text-slate-300">
                  {item.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 truncate">
                      <span className="text-indigo-400 font-bold">✓</span>
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sport Chips */}
              {item.sports && item.sports.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {item.sports.slice(0, 3).map(sportKey => {
                    const info = getSportInfo(sportKey);
                    return (
                      <span
                        key={sportKey}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 ${info.badgeBg} ${info.badgeText} ${info.badgeBorder}`}
                        title={info.label}
                      >
                        <span>{info.icon}</span>
                        <span>{info.label}</span>
                      </span>
                    );
                  })}
                  {item.sports.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-slate-800/60 border border-slate-700/50">
                      +{item.sports.length - 3} weitere
                    </span>
                  )}
                </div>
              )}

              {item.notes && (
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {item.notes}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-slate-300">
                <Weight className="w-3.5 h-3.5 text-slate-500" />
                {item.weightGrams}g
              </span>

              <span>
                {item.tempMin}°C bis {item.tempMax}°C
              </span>

              <div className="flex items-center gap-2 font-sans text-[11px]">
                {item.isWaterproof && <span className="text-cyan-400">Wasserdicht</span>}
                {item.isMandatorySafety && <span className="text-rose-400 font-bold">LVS/Sicherheit</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
