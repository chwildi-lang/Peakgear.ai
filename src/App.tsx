/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mountain, 
  Backpack, 
  Shirt, 
  Zap, 
  Camera, 
  Users, 
  Compass, 
  ShieldAlert, 
  FileText,
  SlidersHorizontal,
  ChevronDown,
  LayoutDashboard,
  Star,
  Menu,
  Check
} from 'lucide-react';
import { 
  GearItem, 
  GpxTour, 
  WeatherCondition, 
  UserProfile, 
  TourFeedback,
  ActivityExposureScenario
} from './types/app';
import { 
  INITIAL_GEAR, 
  INITIAL_TOURS, 
  INITIAL_USER_PROFILES 
} from './data/outdoorData';
import { generatePackingRecommendation } from './utils/recommendationEngine';
import { fetchLiveWeatherForTour } from './utils/weatherService';
import { DashboardView } from './components/DashboardView';
import { TourSelectorView } from './components/TourSelectorView';
import { PackAdvisorView } from './components/PackAdvisorView';
import { GearClosetView } from './components/GearClosetView';
import { FeedbackLearningView } from './components/FeedbackLearningView';
import { AiCameraScannerModal } from './components/AiCameraScannerModal';
import { UserProfileModal } from './components/UserProfileModal';
import { EditGearModal } from './components/EditGearModal';

export type NavTabType = 'dashboard' | 'tours' | 'advisor' | 'closet' | 'feedback';

interface NavItemConfig {
  id: NavTabType;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  iconBgActive: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard & Favoriten',
    shortLabel: 'Dashboard',
    description: 'Überblick, Schnellaktionen & Favoriten',
    icon: LayoutDashboard,
    accentColor: 'text-amber-400',
    iconBgActive: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    id: 'tours',
    label: 'Touren & GPX',
    shortLabel: 'Touren',
    description: 'Alpine Touren, GPX-Upload & Live-Wetter',
    icon: Mountain,
    accentColor: 'text-sky-400',
    iconBgActive: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
  },
  {
    id: 'advisor',
    label: 'Pack-Berater',
    shortLabel: 'Packen',
    description: 'Szenarien, Bekleidung & Ausrüstungsempfehlungen',
    icon: Backpack,
    accentColor: 'text-emerald-400',
    iconBgActive: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    id: 'closet',
    label: 'Ausrüstungsschrank',
    shortLabel: 'Schrank',
    description: 'Kleidung, Rucksäcke, Taschen & Hardware',
    icon: Shirt,
    accentColor: 'text-teal-400',
    iconBgActive: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
  },
  {
    id: 'feedback',
    label: 'Lernschleife & Feedback',
    shortLabel: 'Lernen',
    description: 'Erfahrungen bewerten & KI-Kälteprofil schärfen',
    icon: Zap,
    accentColor: 'text-indigo-400',
    iconBgActive: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
  }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTabType>('dashboard');
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const navDropdownRef = useRef<HTMLDivElement>(null);

  // Modals
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingGearItem, setEditingGearItem] = useState<GearItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Core Data Stores (with LocalStorage & automatic merge of new initial records)
  const [gear, setGear] = useState<GearItem[]>(() => {
    const saved = localStorage.getItem('peakgear_closet_data');
    if (saved) {
      try {
        const parsed: GearItem[] = JSON.parse(saved);
        // Merge any new initial gear items not yet in saved list
        const existingIds = new Set(parsed.map(g => g.id));
        const newItems = INITIAL_GEAR.filter(g => !existingIds.has(g.id));
        return [...parsed, ...newItems];
      } catch (e) { /* ignore */ }
    }
    return INITIAL_GEAR;
  });

  const [tours, setTours] = useState<GpxTour[]>(() => {
    const saved = localStorage.getItem('peakgear_tours_data');
    if (saved) {
      try {
        const parsed: GpxTour[] = JSON.parse(saved);
        // Merge any new initial tours not yet in saved list
        const existingIds = new Set(parsed.map(t => t.id));
        const newItems = INITIAL_TOURS.filter(t => !existingIds.has(t.id));
        return [...parsed, ...newItems];
      } catch (e) { /* ignore */ }
    }
    return INITIAL_TOURS;
  });

  const [selectedTour, setSelectedTour] = useState<GpxTour>(() => tours[0] || INITIAL_TOURS[0]);

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('peakgear_profiles_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USER_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => profiles[0]?.id || 'user-1');

  // Weather condition state (initialized with regional data, enriched via Google Search)
  const [weather, setWeather] = useState<WeatherCondition>({
    valleyTempC: 14,
    mountainTempC: 2,
    windKmh: 30,
    precipitation: 'sun',
    avalancheLevel: 2, // Mäßig
    avalancheWarning: 'Mäßige Lawinengefahr (Stufe 2): Triebschneefelder an Nordost-Hängen oberhalb 2.200m.',
    freezingAltitudeM: 2500,
    regionName: selectedTour?.region || 'Wettersteingebirge',
    fetchedViaGoogleSearch: false
  });

  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const weatherCacheRef = useRef<Record<string, { weather: WeatherCondition; time: number }>>({});

  // Google Search Live Weather Fetcher with client-side 15-minute caching
  const handleFetchGoogleSearchWeather = async (targetTour: GpxTour = selectedTour, forceRefresh = false) => {
    const cachedEntry = weatherCacheRef.current[targetTour.id];
    const isFresh = cachedEntry && (Date.now() - cachedEntry.time < 15 * 60 * 1000);

    if (!forceRefresh && isFresh) {
      setWeather(cachedEntry.weather);
      return;
    }

    setIsLoadingWeather(true);
    setWeather(prev => ({ ...prev, isLiveLoading: true }));
    try {
      const updated = await fetchLiveWeatherForTour(targetTour, weather);
      weatherCacheRef.current[targetTour.id] = { weather: updated, time: Date.now() };
      setWeather(updated);
    } catch {
      setWeather(prev => ({ ...prev, isLiveLoading: false }));
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Automatically fetch live Google Search weather on tour change (cached)
  useEffect(() => {
    handleFetchGoogleSearchWeather(selectedTour, false);
  }, [selectedTour.id]);

  // Local storage effects
  useEffect(() => {
    localStorage.setItem('peakgear_closet_data', JSON.stringify(gear));
  }, [gear]);

  useEffect(() => {
    localStorage.setItem('peakgear_tours_data', JSON.stringify(tours));
  }, [tours]);

  useEffect(() => {
    localStorage.setItem('peakgear_profiles_data', JSON.stringify(profiles));
  }, [profiles]);

  // Exposure Scenario state (e.g. 2h draußen stehen, wechselnd innen/außen)
  const [exposureScenario, setExposureScenario] = useState<ActivityExposureScenario>(() => {
    const saved = localStorage.getItem('peakgear_exposure_scenario');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      mode: 'active_continuous',
      staticDurationHours: 2,
      indoorOutdoorCycle: 'balanced'
    };
  });

  useEffect(() => {
    localStorage.setItem('peakgear_exposure_scenario', JSON.stringify(exposureScenario));
  }, [exposureScenario]);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  // Dynamic recommendation calculated on the fly with weather & manual exposure scenario
  const recommendation = generatePackingRecommendation(
    selectedTour,
    weather,
    activeProfile,
    gear,
    exposureScenario
  );

  const handleAddCustomTour = (newTour: GpxTour) => {
    setTours(prev => [newTour, ...prev]);
  };

  const handleToggleFavoriteTour = (tourId: string) => {
    setTours(prev => prev.map(t => {
      if (t.id === tourId) {
        const nextFav = !t.isFavorite;
        if (selectedTour.id === tourId) {
          setSelectedTour(curr => ({ ...curr, isFavorite: nextFav }));
        }
        return { ...t, isFavorite: nextFav };
      }
      return t;
    }));
  };

  const handleToggleFavoriteGear = (gearId: string) => {
    setGear(prev => prev.map(g => {
      if (g.id === gearId) {
        return { ...g, isFavorite: !g.isFavorite };
      }
      return g;
    }));
  };

  const handleAddGearItem = (newItem: GearItem) => {
    setGear(prev => [newItem, ...prev]);
  };

  const handleStartEditGear = (item: GearItem) => {
    setEditingGearItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEditGear = (updatedItem: GearItem) => {
    setGear(prev => prev.map(g => g.id === updatedItem.id ? updatedItem : g));
  };

  const handleDeleteGearItem = (gearId: string) => {
    setGear(prev => prev.filter(g => g.id !== gearId));
  };

  const handleAddFeedback = (newFeedback: TourFeedback) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === activeProfileId) {
        return {
          ...p,
          feedbackHistory: [newFeedback, ...p.feedbackHistory]
        };
      }
      return p;
    }));
  };

  const handleAddProfile = (newProfile: UserProfile) => {
    setProfiles(prev => [...prev, newProfile]);
  };

  // Close navigation dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target as Node)) {
        setIsNavDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNavDropdownOpen(false);
      }
    };

    if (isNavDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNavDropdownOpen]);

  const currentNavTab = NAV_ITEMS.find(item => item.id === activeTab) || NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Alpine Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Dropdown Navigation Trigger on the left */}
          <div className="relative" ref={navDropdownRef}>
            <button
              type="button"
              onClick={() => setIsNavDropdownOpen(prev => !prev)}
              className="group flex items-center gap-3 p-1.5 -ml-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              aria-expanded={isNavDropdownOpen}
              aria-haspopup="true"
              aria-label="Hauptmenü Navigation öffnen"
            >
              {/* Alpine Mountain Logo with subtle Menu indicator badge */}
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/25 shrink-0 group-hover:scale-105 transition-transform">
                <Mountain className="w-5 h-5 stroke-[2.5]" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-md bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors shadow-sm">
                  <Menu className="w-2.5 h-2.5" />
                </span>
              </div>

              {/* Brand Title + Active Section Info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-white tracking-tight leading-none">PeakGear</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-800/80 leading-none">
                    Alpine GPX
                  </span>
                  <ChevronDown 
                    className={`w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-transform duration-200 ml-0.5 ${
                      isNavDropdownOpen ? 'rotate-180 text-emerald-400' : ''
                    }`} 
                  />
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 leading-tight">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    {currentNavTab.shortLabel}
                  </span>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="text-slate-400 hidden sm:inline truncate max-w-[130px] md:max-w-[200px]">
                    {selectedTour.name}
                  </span>
                </div>
              </div>
            </button>

            {/* Dropdown Navigation Menu Popover */}
            {isNavDropdownOpen && (
              <div 
                className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-slate-750 shadow-2xl shadow-black/90 backdrop-blur-xl z-50 p-2.5 animate-in fade-in zoom-in-95 duration-150 origin-top-left"
                role="menu"
              >
                {/* Header in dropdown */}
                <div className="px-2.5 py-2 border-b border-slate-800/80 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Menu className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Hauptmenü
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Wähle einen Bereich
                  </span>
                </div>

                {/* Navigation Items List */}
                <div className="space-y-1">
                  {NAV_ITEMS.map(item => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsNavDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left cursor-pointer group ${
                          isActive
                            ? 'bg-slate-800/95 text-white border border-emerald-500/40 shadow-md shadow-black/20'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                        }`}
                        role="menuitem"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                            isActive ? item.iconBgActive : 'bg-slate-800/80 text-slate-400 border-slate-700/60 group-hover:text-slate-200'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold leading-snug flex items-center gap-1.5">
                              <span className={isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}>
                                {item.label}
                              </span>
                              {isActive && (
                                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  Aktiv
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-normal leading-snug mt-0.5 line-clamp-1">
                              {item.description}
                            </div>
                          </div>
                        </div>
                        <div className="ml-2 shrink-0">
                          {isActive ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-slate-500 transition-colors" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Tour Quick Info & Switcher in footer of dropdown */}
                <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 px-2.5 pb-1 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mountain className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-slate-400 truncate text-[11px]">
                      Tour: <strong className="text-slate-200">{selectedTour.name}</strong> ({selectedTour.elevationGainM}m)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('tours');
                      setIsNavDropdownOpen(false);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 text-[11px] font-bold cursor-pointer shrink-0 ml-2 hover:underline"
                  >
                    Wechseln
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Center Header: Alpine Tour Cockpit Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300">
            <Mountain className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white truncate max-w-[180px]">{selectedTour.name}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono text-[11px]">{selectedTour.elevationGainM}m ↑</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono text-[11px]">{weather.valleyTempC}° / {weather.mountainTempC}°C</span>
            <button
              type="button"
              onClick={() => setActiveTab('tours')}
              className="ml-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              title="Tour oder GPX ändern"
            >
              Ändern
            </button>
          </div>

          {/* Right Header Controls (AI Camera Scan + Multi-User Profile Switcher with >=44px touch target) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAiScannerOpen(true)}
              className="min-h-[44px] px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-indigo-600/20 active:scale-95"
              title="Ausrüstung oder Etikett mit KI fotografieren"
              aria-label="KI-Kamera Scan öffnen"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">KI-Scan</span>
            </button>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="min-h-[44px] px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title="Benutzerkonto wechseln"
              aria-label="Profil wechseln"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-xs">{activeProfile.name.split(' ')[0]}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Main View Body (with bottom safe clearance for mobile bottom bar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            userProfile={activeProfile}
            tours={tours}
            gear={gear}
            selectedTour={selectedTour}
            weather={weather}
            exposureScenario={exposureScenario}
            onSelectTourAndGoToAdvisor={tour => {
              setSelectedTour(tour);
              setActiveTab('advisor');
            }}
            onGoToTab={tab => setActiveTab(tab)}
            onToggleFavoriteTour={handleToggleFavoriteTour}
            onToggleFavoriteGear={handleToggleFavoriteGear}
            onEditGear={handleStartEditGear}
            onOpenAiScanner={() => setIsAiScannerOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === 'tours' && (
          <TourSelectorView
            tours={tours}
            selectedTour={selectedTour}
            onSelectTour={tour => {
              setSelectedTour(tour);
              setActiveTab('advisor');
            }}
            onAddCustomTour={handleAddCustomTour}
            onProceedToAdvisor={() => setActiveTab('advisor')}
            onToggleFavoriteTour={handleToggleFavoriteTour}
          />
        )}

        {activeTab === 'advisor' && (
          <PackAdvisorView
            recommendation={recommendation}
            weather={weather}
            setWeather={setWeather}
            exposureScenario={exposureScenario}
            setExposureScenario={setExposureScenario}
            onGoToFeedback={() => setActiveTab('feedback')}
            onGoToCloset={() => setActiveTab('closet')}
            onFetchGoogleSearchWeather={() => handleFetchGoogleSearchWeather(selectedTour, true)}
            isLoadingWeather={isLoadingWeather}
            onEditGear={handleStartEditGear}
          />
        )}

        {activeTab === 'closet' && (
          <GearClosetView
            gear={gear}
            setGear={setGear}
            onOpenAiScanner={() => setIsAiScannerOpen(true)}
            onToggleFavoriteGear={handleToggleFavoriteGear}
            onEditGear={handleStartEditGear}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackLearningView
            userProfile={activeProfile}
            tours={tours}
            onAddFeedback={handleAddFeedback}
            onGoToAdvisor={() => setActiveTab('advisor')}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Thumb Zone Ergonomics, Pattern 1) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 grid grid-cols-5 items-center px-1 pb-[max(env(safe-area-inset-bottom,0px),8px)] pt-1.5 shadow-2xl"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl py-1 px-0.5 transition-colors cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Favoriten</span>
        </button>

        <button
          onClick={() => setActiveTab('tours')}
          className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl py-1 px-0.5 transition-colors cursor-pointer ${
            activeTab === 'tours'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mountain className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Touren</span>
        </button>

        <button
          onClick={() => setActiveTab('advisor')}
          className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl py-1 px-0.5 transition-colors cursor-pointer ${
            activeTab === 'advisor'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Backpack className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Packen</span>
        </button>

        <button
          onClick={() => setActiveTab('closet')}
          className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl py-1 px-0.5 transition-colors cursor-pointer ${
            activeTab === 'closet'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shirt className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Schrank</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl py-1 px-0.5 transition-colors cursor-pointer ${
            activeTab === 'feedback'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Lernen</span>
        </button>
      </nav>

      {/* Modals */}
      <AiCameraScannerModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
        onAddGearItem={handleAddGearItem}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={setActiveProfileId}
        onAddProfile={handleAddProfile}
      />

      {/* Manual Gear Edit & Correction Modal */}
      <EditGearModal
        isOpen={isEditModalOpen}
        item={editingGearItem}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGearItem(null);
        }}
        onSave={handleSaveEditGear}
        onDelete={handleDeleteGearItem}
      />
    </div>
  );
}
