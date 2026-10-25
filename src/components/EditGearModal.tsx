import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Weight, 
  Thermometer, 
  ShieldCheck, 
  Star, 
  Trash2, 
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Info
} from 'lucide-react';
import { GearCategory, GearItem, SportType } from '../types/app';
import { SPORT_GROUPS, SPORTS_MAP, ALL_SPORTS, getSportInfo } from '../utils/sportsConstants';

interface EditGearModalProps {
  isOpen: boolean;
  item: GearItem | null;
  onClose: () => void;
  onSave: (updatedItem: GearItem) => void;
  onDelete?: (itemId: string) => void;
}

export const EditGearModal: React.FC<EditGearModalProps> = ({
  isOpen,
  item,
  onClose,
  onSave,
  onDelete
}) => {
  if (!isOpen || !item) return null;

  const [name, setName] = useState(item.name);
  const [brand, setBrand] = useState(item.brand);
  const [category, setCategory] = useState<GearCategory>(item.category);
  const [weightGrams, setWeightGrams] = useState(item.weightGrams);
  const [tempMin, setTempMin] = useState(item.tempMin);
  const [tempMax, setTempMax] = useState(item.tempMax);
  const [isWaterproof, setIsWaterproof] = useState(item.isWaterproof);
  const [isWindproof, setIsWindproof] = useState(item.isWindproof);
  const [isMandatorySafety, setIsMandatorySafety] = useState(!!item.isMandatorySafety);
  const [isFavorite, setIsFavorite] = useState(!!item.isFavorite);
  const [condition, setCondition] = useState<GearItem['condition']>(item.condition);
  const [sports, setSports] = useState<SportType[]>(item.sports || ['hiking']);
  const [notes, setNotes] = useState(item.notes || '');
  const [volumeLiters, setVolumeLiters] = useState<number | undefined>(item.volumeLiters);
  const [backpackType, setBackpackType] = useState<GearItem['backpackType']>(item.backpackType || 'daypack');

  // Reset form when item prop changes
  useEffect(() => {
    if (item) {
      setName(item.name);
      setBrand(item.brand);
      setCategory(item.category);
      setWeightGrams(item.weightGrams);
      setTempMin(item.tempMin);
      setTempMax(item.tempMax);
      setIsWaterproof(item.isWaterproof);
      setIsWindproof(item.isWindproof);
      setIsMandatorySafety(!!item.isMandatorySafety);
      setIsFavorite(!!item.isFavorite);
      setCondition(item.condition);
      setSports(item.sports || ['hiking']);
      setNotes(item.notes || '');
      setVolumeLiters(item.volumeLiters);
      setBackpackType(item.backpackType || 'daypack');
    }
  }, [item]);

  const categoriesMap: Record<GearCategory, { label: string; desc: string }> = {
    backpack: { label: 'Taschen & Rucksäcke', desc: 'Tages-, Ski- & Bikerucksäcke, Westen, Hüfttaschen, Drybags' },
    baselayer: { label: 'Baselayer', desc: 'Merino/Funktions-Unterwäsche, T-Shirts' },
    midlayer: { label: 'Midlayer', desc: 'Fleece, Daunenweste, Primaloft Jacke' },
    hardshell: { label: 'Hardshell', desc: 'Wetterschutzjacke, Regenhose (Gore-Tex)' },
    pants: { label: 'Hosen', desc: 'Softshellhose, Trekkinghose, Tourenhose' },
    footwear: { label: 'Schuhe', desc: 'Bergschuhe, Trailrunner, Gamaschen' },
    hardware: { label: 'Hardware', desc: 'Steigeisen, Schneeschuhe, Klettersteigset, Stöcke' },
    safety: { label: 'Sicherheitsausrüstung', desc: 'LVS-Gerät, Lawinensonde, Schaufel, Erste Hilfe' },
    accessories: { label: 'Zubehör', desc: 'Handschuhe, Mütze, Gletscherbrille, Stirnlampe' },
    food_hydration: { label: 'Verpflegung', desc: 'Thermosflasche, Trinkblase, Riegel, Kocher' }
  };

  const toggleSport = (sportKey: SportType) => {
    setSports(prev => 
      prev.includes(sportKey) 
        ? (prev.length > 1 ? prev.filter(s => s !== sportKey) : prev) // keep at least 1 sport
        : [...prev, sportKey]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: GearItem = {
      ...item,
      name: name.trim(),
      brand: brand.trim() || 'Outdoor',
      category,
      weightGrams: Math.max(0, Number(weightGrams) || 0),
      tempMin: Number(tempMin),
      tempMax: Number(tempMax),
      isWaterproof,
      isWindproof,
      isMandatorySafety,
      isFavorite,
      condition,
      sports: sports.length > 0 ? sports : ['hiking'],
      notes: notes.trim(),
      volumeLiters: category === 'backpack' ? (Number(volumeLiters) || 28) : undefined,
      backpackType: category === 'backpack' ? backpackType : undefined
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-xl max-h-[90vh] sm:max-h-[85vh] bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-gear-title"
      >
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 id="edit-gear-title" className="text-base font-bold text-white tracking-tight">
                Ausrüstung anpassen
              </h3>
              <p className="text-[11px] text-slate-400">
                Daten, Gewicht und Einsatzbereiche manuell korrigieren
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Section: Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bezeichnung *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="z.B. Gore-Tex Alpinjacke"
                className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Marke / Hersteller
              </label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="z.B. Ortovox, Mammut, Petzl"
                className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Section: Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kategorie
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as GearCategory)}
                  className="w-full min-h-[44px] appearance-none bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer pr-10"
                >
                  {Object.entries(categoriesMap).map(([key, info]) => (
                    <option key={key} value={key}>
                      {info.label} ({info.desc.split(',')[0]})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Zustand
              </label>
              <div className="relative">
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value as any)}
                  className="w-full min-h-[44px] appearance-none bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer pr-10"
                >
                  <option value="Neuwertig">Neuwertig</option>
                  <option value="Sehr gut">Sehr gut</option>
                  <option value="Gebraucht">Gebraucht</option>
                  <option value="Erneuerungsbedürftig">Erneuerungsbedürftig</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Dedicated Backpack / Bag Specifications */}
          {category === 'backpack' && (
            <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-500/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                <span>Rucksack- & Taschen-Spezifikation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Volumen (Liter) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={volumeLiters ?? 28}
                    onChange={e => setVolumeLiters(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    placeholder="z.B. 28"
                    className="w-full min-h-[44px] bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kategorie / Typ
                  </label>
                  <div className="relative">
                    <select
                      value={backpackType}
                      onChange={e => setBackpackType(e.target.value as any)}
                      className="w-full min-h-[44px] appearance-none bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-400 cursor-pointer pr-10"
                    >
                      <option value="daypack">Tages- & Wanderrucksack (18-32L)</option>
                      <option value="alpine_tour">Alpin- & Skitourenrucksack (25-42L)</option>
                      <option value="trail_vest">Trailrunning-Laufweste (5-14L)</option>
                      <option value="bike_bag">Protektor- & Bikerucksack (12-25L)</option>
                      <option value="hip_bag">Hüfttasche / Hip Pack (2-6L)</option>
                      <option value="dry_bag">Wasserdichter Packbeutel / Drybag (5-20L)</option>
                      <option value="trekking">Trekking- & Schwerlastrucksack (45-75L)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Weight & Temperatures */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5 text-emerald-400" />
                  Gewicht in Gramm
                </label>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {weightGrams} g ({(weightGrams / 1000).toFixed(2)} kg)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWeightGrams(prev => Math.max(0, prev - 50))}
                  className="min-h-[40px] px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer"
                >
                  -50g
                </button>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={weightGrams}
                  onChange={e => setWeightGrams(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="flex-1 min-h-[40px] bg-slate-900 border border-slate-700 rounded-lg px-3 text-sm text-center font-mono text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setWeightGrams(prev => prev + 50)}
                  className="min-h-[40px] px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer"
                >
                  +50g
                </button>
              </div>
            </div>

            {/* Min / Max Temperatures */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-cyan-400" />
                  Min. Komfort (°C)
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTempMin(prev => prev - 2)}
                    className="min-h-[38px] px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono cursor-pointer"
                  >
                    -2°
                  </button>
                  <input
                    type="number"
                    value={tempMin}
                    onChange={e => setTempMin(parseInt(e.target.value, 10) || 0)}
                    className="w-full min-h-[38px] bg-slate-900 border border-slate-700 rounded px-2 text-xs text-center font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setTempMin(prev => prev + 2)}
                    className="min-h-[38px] px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono cursor-pointer"
                  >
                    +2°
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-400" />
                  Max. Komfort (°C)
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTempMax(prev => prev - 2)}
                    className="min-h-[38px] px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono cursor-pointer"
                  >
                    -2°
                  </button>
                  <input
                    type="number"
                    value={tempMax}
                    onChange={e => setTempMax(parseInt(e.target.value, 10) || 0)}
                    className="w-full min-h-[38px] bg-slate-900 border border-slate-700 rounded px-2 text-xs text-center font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setTempMax(prev => prev + 2)}
                    className="min-h-[38px] px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono cursor-pointer"
                  >
                    +2°
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Feature Toggles (Touch-friendly Checkbox Chips) */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-300">
              Eigenschaften & Schutz
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setIsWaterproof(!isWaterproof)}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isWaterproof 
                    ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${isWaterproof ? 'opacity-100 text-cyan-400' : 'opacity-20'}`} />
                <span>Wasserdicht</span>
              </button>

              <button
                type="button"
                onClick={() => setIsWindproof(!isWindproof)}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isWindproof 
                    ? 'bg-blue-950/80 border-blue-500/80 text-blue-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Check className={`w-3.5 h-3.5 ${isWindproof ? 'opacity-100 text-blue-400' : 'opacity-20'}`} />
                <span>Winddicht</span>
              </button>

              <button
                type="button"
                onClick={() => setIsMandatorySafety(!isMandatorySafety)}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isMandatorySafety 
                    ? 'bg-rose-950/80 border-rose-500/80 text-rose-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${isMandatorySafety ? 'opacity-100 text-rose-400' : 'opacity-20'}`} />
                <span>Sicherheit/LVS</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  isFavorite 
                    ? 'bg-amber-950/80 border-amber-500/80 text-amber-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'opacity-30'}`} />
                <span>Favorit</span>
              </button>
            </div>
          </div>

          {/* Section: Applicable Sports (Bergfex Categories) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-semibold text-slate-300">
                Geeignete Sportarten (Bergfex-Kategorien)
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                {sports.length} ausgewählt
              </span>
            </div>

            <div className="space-y-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {SPORT_GROUPS.map(group => {
                const groupSports = Object.values(SPORTS_MAP).filter(s => s.group === group.key);

                return (
                  <div key={group.key} className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <span>{group.icon}</span>
                      <span>{group.label}</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {groupSports.map(sp => {
                        const isSelected = sports.includes(sp.key);
                        return (
                          <button
                            key={sp.key}
                            type="button"
                            onClick={() => toggleSport(sp.key)}
                            className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-semibold shadow-sm'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span>{sp.icon}</span>
                            <span>{sp.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Notes / Specialist Hints */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Fachliche Hinweise & Notizen
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="z.B. Für Steigeisen geeignet, 3-Antennen LVS, DWR frisch aufgefrischt..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </form>

        {/* Modal Footer with Actions - Thumb reachable */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
          {onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Möchtest du "${item.name}" wirklich aus dem Schrank löschen?`)) {
                  onDelete(item.id);
                  onClose();
                }
              }}
              className="min-h-[44px] px-3.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Löschen</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="min-h-[44px] px-5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Änderungen speichern</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
