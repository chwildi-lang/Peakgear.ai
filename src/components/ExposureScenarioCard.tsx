import React from 'react';
import { 
  Timer, 
  Activity, 
  Repeat, 
  Flame, 
  ThermometerSnowflake, 
  Sparkles, 
  Info,
  Check,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { ActivityExposureScenario, ExposureMode } from '../types/app';

interface ExposureScenarioCardProps {
  scenario: ActivityExposureScenario;
  onScenarioChange: (scenario: ActivityExposureScenario) => void;
  advice?: {
    title: string;
    badge: string;
    description: string;
    metabolicNote: string;
    tips: string[];
  };
}

export const ExposureScenarioCard: React.FC<ExposureScenarioCardProps> = ({
  scenario,
  onScenarioChange,
  advice
}) => {
  const currentMode = scenario.mode;

  const handleSelectMode = (mode: ExposureMode) => {
    onScenarioChange({
      ...scenario,
      mode
    });
  };

  const handleDurationChange = (hours: number) => {
    onScenarioChange({
      ...scenario,
      staticDurationHours: Math.max(0.5, Math.min(8, hours))
    });
  };

  const handleCycleChange = (cycle: 'frequent' | 'balanced' | 'occasional') => {
    onScenarioChange({
      ...scenario,
      indoorOutdoorCycle: cycle
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              Aktivitäts- & Belastungsprofil
            </span>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
              Manuelle Anpassung
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Passe die Ausrüstungs-Empfehlung an deine tatsächliche Belastung und Bewegung an (z.B. Stillstand bei Kälte oder Hüttenwechsel).
          </p>
        </div>

        {/* Status Chip */}
        <div className="self-start sm:self-auto">
          {currentMode === 'static_standing' && (
            <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-800/80 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
              <ThermometerSnowflake className="w-3.5 h-3.5" />
              {scenario.staticDurationHours}h Stillstand
            </span>
          )}
          {currentMode === 'alternating_indoor_outdoor' && (
            <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/70 border border-amber-800/80 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5" />
              Hütten & Gondel
            </span>
          )}
          {currentMode === 'active_continuous' && (
            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-800/80 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              Sportlich aktiv
            </span>
          )}
        </div>
      </div>

      {/* Mode Selector Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Mode 1: Sportlich aktiv */}
        <button
          type="button"
          onClick={() => handleSelectMode('active_continuous')}
          className={`min-h-[48px] p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            currentMode === 'active_continuous'
              ? 'bg-emerald-950/40 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                currentMode === 'active_continuous' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Sportlich aktiv</h4>
                <p className="text-[11px] text-slate-400">Kontinuierliche Bewegung</p>
              </div>
            </div>
            {currentMode === 'active_continuous' && (
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
            ~450–600W Stoffwechselwärme · Aufstieg & Abfahrt
          </div>
        </button>

        {/* Mode 2: Draußen stehen / Statisch */}
        <button
          type="button"
          onClick={() => handleSelectMode('static_standing')}
          className={`min-h-[48px] p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            currentMode === 'static_standing'
              ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/30'
              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                currentMode === 'static_standing' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
              }`}>
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Draußen stehen / Statisch</h4>
                <p className="text-[11px] text-cyan-400 font-medium">z.B. 2 Std. draußen stehen</p>
              </div>
            </div>
            {currentMode === 'static_standing' && (
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
            ~90W Minimal-Wärme · Auskühlungsrisiko hoch
          </div>
        </button>

        {/* Mode 3: Wechselnd Innen / Außen */}
        <button
          type="button"
          onClick={() => handleSelectMode('alternating_indoor_outdoor')}
          className={`min-h-[48px] p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            currentMode === 'alternating_indoor_outdoor'
              ? 'bg-amber-950/40 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                currentMode === 'alternating_indoor_outdoor' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
              }`}>
                <Repeat className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Wechselnd Innen / Außen</h4>
                <p className="text-[11px] text-slate-400">Hütten, Seilbahn, Stop & Go</p>
              </div>
            </div>
            {currentMode === 'alternating_indoor_outdoor' && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
            Temperatursprünge bis 25°C · Schwitz-Kälte-Falle
          </div>
        </button>
      </div>

      {/* Sub-controls when "Draußen stehen" is selected */}
      {currentMode === 'static_standing' && (
        <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-800/50 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">
                Dauer des Stillstands im Freien:
              </span>
              <span className="font-mono font-extrabold text-cyan-300 text-sm bg-cyan-950/90 px-2 py-0.5 rounded-lg border border-cyan-700">
                {scenario.staticDurationHours} Stunden
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 mr-1">Schnellwahl:</span>
              {[1, 2, 3, 4, 5].map(hrs => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => handleDurationChange(hrs)}
                  className={`min-h-[36px] px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    scenario.staticDurationHours === hrs
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-slate-850 text-slate-300 hover:bg-slate-800 border border-slate-700'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
          </div>

          {/* Duration Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min="0.5"
              max="6"
              step="0.5"
              value={scenario.staticDurationHours}
              onChange={e => handleDurationChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>30 Min. (Kurzer Fotostopp)</span>
              <span>2 Std. (Event / Sichern)</span>
              <span>4 Std. (Langzeit-Posten)</span>
              <span>6 Std. (Extrem statisch)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-900/60 flex items-center justify-between text-xs text-cyan-200 gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              Effektiver Kälte-Zuschlag:
            </span>
            <strong className="font-mono text-cyan-300">
              +{(scenario.staticDurationHours * 2.5).toFixed(1)}°C Isolationsbedarf (Daune & Thermoskanne aktiv)
            </strong>
          </div>
        </div>
      )}

      {/* Sub-controls when "Wechselnd Innen / Außen" is selected */}
      {currentMode === 'alternating_indoor_outdoor' && (
        <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-800/50 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">
                Wechsel-Intensität (Hütten & Seilbahn):
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(['frequent', 'balanced', 'occasional'] as const).map(cycle => {
                const labels = {
                  frequent: 'Häufig (z.B. Lifte/Gondeln alle 20 Min.)',
                  balanced: 'Ausgewogen (1–2 Hütteneinkehr)',
                  occasional: 'Gelegentlich (Rast an Schutzhütte)'
                };
                const isSelected = scenario.indoorOutdoorCycle === cycle;
                return (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => handleCycleChange(cycle)}
                    className={`min-h-[38px] px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-850 text-slate-300 hover:bg-slate-800 border border-slate-700'
                    }`}
                  >
                    {labels[cycle]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-900/60 flex items-center justify-between text-xs text-amber-200 gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              Schwitz-Kälte-Prävention:
            </span>
            <strong className="text-amber-300">
              Ersatz-Shirt im Rucksack & 2-Wege-Belüftungszipper priorisiert
            </strong>
          </div>
        </div>
      )}

      {/* Advice and Physiological Explanation Box */}
      {advice && (
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-800/80 pb-2">
            <h5 className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              {advice.title}
            </h5>
            <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 self-start sm:self-auto">
              {advice.badge}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {advice.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {advice.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">›</span>
                <span className="leading-snug">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
