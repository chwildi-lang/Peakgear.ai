import React, { useState } from 'react';
import { 
  Mountain, 
  Upload, 
  Clock, 
  TrendingUp, 
  MapPin, 
  Compass, 
  ArrowRight, 
  Footprints, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  FileCode,
  Star
} from 'lucide-react';
import { GpxTour, SportType, SportGroup } from '../types/app';
import { GpxElevationChart } from './GpxElevationChart';
import { parseGpxFile } from '../utils/gpxParser';
import { SPORTS_MAP, SPORT_GROUPS, getSportInfo, SportInfo } from '../utils/sportsConstants';

interface TourSelectorViewProps {
  tours: GpxTour[];
  selectedTour: GpxTour;
  onSelectTour: (tour: GpxTour) => void;
  onAddCustomTour: (tour: GpxTour) => void;
  onProceedToAdvisor: () => void;
  onToggleFavoriteTour: (tourId: string) => void;
}

export const TourSelectorView: React.FC<TourSelectorViewProps> = ({
  tours,
  selectedTour,
  onSelectTour,
  onAddCustomTour,
  onProceedToAdvisor,
  onToggleFavoriteTour
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedSpecificSport, setSelectedSpecificSport] = useState<string>('all');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsedTour = parseGpxFile(content, file.name);
        onAddCustomTour(parsedTour);
        onSelectTour(parsedTour);
        setIsUploading(false);
      } catch (err: any) {
        setUploadError(err.message || 'Fehler beim Parsen der GPX-Datei.');
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setUploadError('Datei konnte nicht gelesen werden.');
      setIsUploading(false);
    };
    reader.readAsText(file);
  };

  const favoriteToursCount = tours.filter(t => !!t.isFavorite).length;

  const filteredTours = tours.filter(t => {
    if (selectedGroup === 'favorites') return !!t.isFavorite;
    
    // Check specific sport filter
    if (selectedSpecificSport !== 'all' && t.sport !== selectedSpecificSport) {
      return false;
    }

    // Check group filter
    if (selectedGroup !== 'all') {
      const sportInfo = getSportInfo(t.sport);
      if (sportInfo.group !== selectedGroup) return false;
    }

    return true;
  });

  const selectedSportInfo = getSportInfo(selectedTour.sport);

  return (
    <div className="space-y-8 py-2">
      {/* Intro Header & GPX Upload Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Mountain className="w-4 h-4" />
              Schritt 1: Tour auswählen oder eigene GPX-Datei laden
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
              Alpine Touren & Sportarten-Analyse
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              Wähle aus spektakulären Klassikern der Ostalpen (Zugspitze, Watzmann, Silvretta Piz Buin) 
              oder importiere direkt deine eigene <code>.gpx</code>-Trackaufzeichnung aus Komoot, Strava oder Garmin.
            </p>
          </div>

          {/* GPX Upload Trigger */}
          <div className="flex-shrink-0">
            <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-xl bg-slate-950/60 hover:bg-slate-950 cursor-pointer transition-all group">
              <input
                type="file"
                accept=".gpx,application/gpx+xml"
                onChange={handleFileUpload}
                className="sr-only"
              />
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <Upload className="w-4 h-4" />
                <span>Eigene GPX-Tour hochladen</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">
                .gpx Datei hierhin ziehen oder klicken
              </span>
            </label>

            {uploadError && (
              <div className="mt-2 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bergfex-Style Category Filter Tabs */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Kategorie wählen (Bergfex-Standard)
            </span>
            {selectedGroup !== 'all' && (
              <button
                onClick={() => {
                  setSelectedGroup('all');
                  setSelectedSpecificSport('all');
                }}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer font-medium"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>

          {/* Primary Group Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setSelectedGroup('all');
                setSelectedSpecificSport('all');
              }}
              className={`min-h-[42px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex-shrink-0 ${
                selectedGroup === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
              }`}
            >
              Alle Touren ({tours.length})
            </button>

            {/* Favorites Filter Tab */}
            <button
              onClick={() => {
                setSelectedGroup('favorites');
                setSelectedSpecificSport('all');
              }}
              className={`min-h-[42px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                selectedGroup === 'favorites'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-amber-400 hover:text-amber-300 bg-amber-950/20 border border-amber-900/40'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${selectedGroup === 'favorites' ? 'fill-slate-950' : 'fill-amber-400'}`} />
              <span>Favoriten ({favoriteToursCount})</span>
            </button>

            {SPORT_GROUPS.map(group => {
              const count = tours.filter(t => getSportInfo(t.sport).group === group.key).length;

              return (
                <button
                  key={group.key}
                  onClick={() => {
                    setSelectedGroup(group.key);
                    setSelectedSpecificSport('all');
                  }}
                  className={`min-h-[42px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                    selectedGroup === group.key
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
                  }`}
                >
                  <span>{group.icon}</span>
                  <span>{group.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Sub-Sport Quick Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedSpecificSport('all')}
              className={`min-h-[32px] px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer flex-shrink-0 ${
                selectedSpecificSport === 'all'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-300 bg-slate-950/40 border border-slate-800/80'
              }`}
            >
              Alle Sportarten
            </button>

            {Object.values(SPORTS_MAP)
              .filter(s => selectedGroup === 'all' || selectedGroup === 'favorites' || s.group === selectedGroup)
              .map(sport => {
                const count = tours.filter(t => t.sport === sport.key).length;
                if (count === 0 && selectedSpecificSport !== sport.key) return null;

                const isSelected = selectedSpecificSport === sport.key;
                return (
                  <button
                    key={sport.key}
                    onClick={() => setSelectedSpecificSport(isSelected ? 'all' : sport.key)}
                    className={`min-h-[32px] px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? `${sport.badgeBg} ${sport.badgeText} border ${sport.badgeBorder} font-bold ring-1 ring-emerald-500/40`
                        : 'text-slate-400 hover:text-slate-200 bg-slate-950/40 border border-slate-800/80'
                    }`}
                  >
                    <span>{sport.icon}</span>
                    <span>{sport.label}</span>
                    <span className="text-[10px] opacity-70 font-mono">({count})</span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Selected Tour Spotlight Card with SVG Elevation Profile */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl">
                {selectedSportInfo.icon}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {selectedTour.name}
              </h3>

              {/* Favorite Toggle Button on Spotlight Tour */}
              <button
                onClick={() => onToggleFavoriteTour(selectedTour.id)}
                title={selectedTour.isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Star className={`w-5 h-5 ${selectedTour.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
              </button>

              <span className="text-xs text-slate-500">·</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${selectedSportInfo.badgeBg} ${selectedSportInfo.badgeText} ${selectedSportInfo.badgeBorder}`}>
                <span>{selectedSportInfo.icon}</span>
                <span>{selectedSportInfo.label}</span>
              </span>
              <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                SAC {selectedTour.technicalDifficulty}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {selectedTour.region}
            </p>
          </div>

          <button
            onClick={onProceedToAdvisor}
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex-shrink-0 self-start lg:self-auto"
          >
            <span>Ausrüstungs-Empfehlung berechnen</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-slate-500" />
              Distanz
            </div>
            <div className="text-lg font-bold text-white mt-0.5 font-mono">
              {selectedTour.distanceKm} km
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Aufstieg / Abstieg
            </div>
            <div className="text-lg font-bold text-emerald-300 mt-0.5 font-mono">
              +{selectedTour.elevationGainM}m / -{selectedTour.elevationLossM}m
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Mountain className="w-3.5 h-3.5 text-indigo-400" />
              Höchster Punkt
            </div>
            <div className="text-lg font-bold text-indigo-300 mt-0.5 font-mono">
              {selectedTour.maxAltitudeM} m
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Gehzeit (SAC)
            </div>
            <div className="text-lg font-bold text-amber-300 mt-0.5 font-mono">
              ~ {selectedTour.estimatedHours} Std.
            </div>
          </div>
        </div>

        {/* SVG Elevation Profile */}
        <GpxElevationChart
          points={selectedTour.profilePoints}
          maxAltitudeM={selectedTour.maxAltitudeM}
          minAltitudeM={selectedTour.minAltitudeM}
          distanceKm={selectedTour.distanceKm}
        />

        {/* Terrain & Description */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-400">
          <div>
            <strong className="text-slate-300">Untergrund: </strong>
            <span>{selectedTour.terrain.join(' · ')}</span>
          </div>
          <div className="text-slate-500 italic max-w-md">
            {selectedTour.description}
          </div>
        </div>
      </div>

      {/* Tour Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Verfügbare Touren ({filteredTours.length})</span>
          {selectedGroup === 'favorites' && (
            <span className="text-amber-400 font-normal">Gefiltert nach Favoriten</span>
          )}
        </div>

        {filteredTours.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-xs text-slate-500">
            Keine Touren in dieser Sportart-Kombination gefunden. Wähle eine andere Sportart oder setze den Filter zurück!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredTours.map(tour => {
              const isSelected = selectedTour.id === tour.id;
              const sportInfo = getSportInfo(tour.sport);

              return (
                <div
                  key={tour.id}
                  onClick={() => onSelectTour(tour)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-emerald-950/20 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${sportInfo.badgeBg} ${sportInfo.badgeText} ${sportInfo.badgeBorder}`}>
                          <span>{sportInfo.icon}</span>
                          <span>{sportInfo.label}</span>
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400">
                          SAC {tour.technicalDifficulty}
                        </span>
                      </div>

                      {/* Favorite Toggle Button on Tour Card */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavoriteTour(tour.id);
                        }}
                        title={tour.isFavorite ? 'Aus Favoriten entfernen' : 'Als Favorit markieren'}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 -mt-2 rounded-xl text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        aria-label="Favorit umschalten"
                      >
                        <Star className={`w-4 h-4 ${tour.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-600 hover:text-slate-400'}`} />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {tour.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {tour.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>{tour.distanceKm} km · +{tour.elevationGainM}m</span>
                    {isSelected && (
                      <span className="text-emerald-400 flex items-center gap-1 font-sans text-xs font-semibold">
                        Ausgewählt <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
