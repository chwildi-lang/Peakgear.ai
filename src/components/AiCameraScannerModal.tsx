import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Sparkles, 
  Check, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  Weight,
  Thermometer,
  ShieldCheck
} from 'lucide-react';
import { GearItem } from '../types/app';

interface AiCameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGearItem: (item: GearItem) => void;
}

const generateSampleImageDataUrl = (title: string, category: string, brand: string, color: string): string => {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 640, 480);
  grad.addColorStop(0, '#090d16');
  grad.addColorStop(1, '#1e293b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 640, 480);

  // Border frame
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, 608, 448);

  // Header band
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(16, 16, 608, 64);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('PEAKGEAR • AUSRÜSTUNGS-FOTO FÜR GEMINI VISION', 36, 54);

  // Brand Badge circle
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(320, 210, 70, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.beginPath();
  ctx.arc(320, 210, 45, 0, Math.PI * 2);
  ctx.fill();

  // Central brand text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(brand, 320, 218);

  // Product title
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(title, 320, 340);

  // Category & caption
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px sans-serif';
  ctx.fillText(`Kategorie: ${category} | Foto-Scan Testobjekt für Gemini Vision API`, 320, 380);

  return canvas.toDataURL('image/jpeg', 0.92);
};

export const AiCameraScannerModal: React.FC<AiCameraScannerModalProps> = ({
  isOpen,
  onClose,
  onAddGearItem
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hint, setHint] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scannedResult, setScannedResult] = useState<Partial<GearItem> | null>(null);
  const [sourceInfo, setSourceInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCapturedImage(base64);
      setScannedResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-gear-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: capturedImage || '',
          hint: hint.trim()
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || `Fehler bei der Gemini Vision Analyse (${res.status})`);
      }

      setScannedResult(json.data);
      setSourceInfo(json.source);
    } catch (err: any) {
      setError(err.message || 'Verbindung zum Gemini Vision KI-Dienst fehlgeschlagen.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAndAdd = () => {
    if (!scannedResult || !scannedResult.name) return;

    const newItem: GearItem = {
      id: `gear-ai-${Date.now()}`,
      name: scannedResult.name || 'Gescannte Ausrüstung',
      brand: scannedResult.brand || 'Outdoor',
      category: scannedResult.category as any || 'baselayer',
      weightGrams: scannedResult.weightGrams || 300,
      tempMin: scannedResult.tempMin !== undefined ? scannedResult.tempMin : -5,
      tempMax: scannedResult.tempMax !== undefined ? scannedResult.tempMax : 15,
      isWaterproof: !!scannedResult.isWaterproof,
      isWindproof: !!scannedResult.isWindproof,
      sports: scannedResult.sports || ['hiking', 'mountaineering'],
      condition: 'Sehr gut',
      isMandatorySafety: !!scannedResult.isMandatorySafety,
      notes: scannedResult.notes || 'Erkannt via KI-Kamera-Scan.',
      imageSrc: capturedImage || undefined,
      volumeLiters: scannedResult.volumeLiters,
      backpackType: scannedResult.backpackType,
      features: scannedResult.features
    };

    onAddGearItem(newItem);
    onClose();
  };

  const handleResetScan = () => {
    setCapturedImage(null);
    setScannedResult(null);
    setHint('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-1 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                KI-Kamera Ausrüstungs- & Bekleidungs-Scanner
              </h3>
              <p className="text-xs text-slate-400">
                Fotografiere ein Kleidungsstück, Etikett oder Equipment für automatische Erkennung.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Capture / Selection */}
        {!capturedImage ? (
          <div className="space-y-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 rounded-2xl p-8 text-center bg-slate-950/60 hover:bg-slate-950 cursor-pointer transition-all space-y-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageFile}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Kamera öffnen oder Foto auswählen
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Unterstützt JPG, PNG, WEBP (Smartphone Kamera oder Datei-Upload)
                </p>
              </div>
            </div>

            {/* Quick Demo Previews */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Oder wähle ein alpines Testobjekt für die Gemini Vision API:</span>
                <span className="text-[10px] text-indigo-400 font-mono">gemini-3.8-flash</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Mammut Hardshell', title: 'Mammut Nordwand Gore-Tex Jacke', brand: 'Mammut', cat: 'Hardshell', color: '#e11d48', hint: 'Mammut Nordwand Pro Gore-Tex Hardshell Wetterschutzjacke' },
                  { label: 'Deuter Rucksack 28L', title: 'Deuter Futura Pro 28', brand: 'Deuter', cat: 'Rucksack & Taschen', color: '#0284c7', hint: 'Deuter Futura Pro 28 Berg- und Wanderrucksack mit Netzrücken und Regenhülle' },
                  { label: 'Barryvox LVS-Gerät', title: 'Ortovox Barryvox 3-Antennen', brand: 'Barryvox', cat: 'Sicherheitsausrüstung', color: '#ea580c', hint: 'Ortovox Barryvox digitales 3-Antennen LVS-Gerät für Lawinensicherheit' },
                  { label: 'Icebreaker Merino', title: 'Icebreaker 260 Tech Baselayer', brand: 'Icebreaker', cat: 'Baselayer', color: '#10b981', hint: 'Icebreaker 260 Tech Funktionsunterwäsche aus 100% Merinowolle' }
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setHint(sample.hint);
                      const jpegData = generateSampleImageDataUrl(sample.title, sample.cat, sample.brand, sample.color);
                      setCapturedImage(jpegData);
                      setScannedResult(null);
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-[11px] font-medium text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Captured Image Preview & Analysis */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-48 h-40 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 relative">
                <img
                  src={capturedImage}
                  alt="Ausrüstung Foto"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleResetScan}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-slate-900 rounded-lg text-slate-300 hover:text-white text-xs flex items-center gap-1 shadow"
                  title="Anderes Foto wählen"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Zusätzlicher Hinweis / Typ (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="z.B. Mammut Jacke Gore-Tex oder Petzl Steigeisen..."
                    value={hint}
                    onChange={e => setHint(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={handleRunAiAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemini KI analysiert Material, Gewicht & Kategorie...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Jetzt mit KI analysieren & Daten ergänzen</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* AI Scanned Result View */}
            {scannedResult && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold text-emerald-300">
                      Erfolgreich von KI erkannt {sourceInfo ? `(${sourceInfo})` : ''}
                    </span>
                  </div>
                  {scannedResult.isMandatorySafety && (
                    <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                      Sicherheitsrelevant
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Artikel:</span>
                    <div className="font-bold text-white text-sm mt-0.5">{scannedResult.name}</div>
                  </div>

                  <div>
                    <span className="text-slate-500">Marke & Kategorie:</span>
                    <div className="font-medium text-emerald-400 mt-0.5">
                      {scannedResult.brand} · <span className="capitalize">{scannedResult.category === 'backpack' ? 'Taschen & Rucksack' : scannedResult.category}</span>
                      {scannedResult.category === 'backpack' && scannedResult.volumeLiters && (
                        <span className="ml-1 text-indigo-300 font-mono">({scannedResult.volumeLiters}L)</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500">Geschätztes Gewicht:</span>
                    <div className="font-mono text-white mt-0.5">{scannedResult.weightGrams} Gramm</div>
                  </div>

                  <div>
                    <span className="text-slate-500">Komfort-Temperatur:</span>
                    <div className="font-mono text-white mt-0.5">
                      {scannedResult.tempMin}°C bis {scannedResult.tempMax}°C
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Wetterschutz & Eigenschaften:</span>
                    <div className="flex items-center gap-3 mt-1 text-slate-300">
                      {scannedResult.isWaterproof && <span className="text-cyan-400 font-medium">✓ Wasserdicht</span>}
                      {scannedResult.isWindproof && <span className="text-indigo-400 font-medium">✓ Winddicht</span>}
                      <span>Zustand: {scannedResult.condition}</span>
                    </div>
                  </div>

                  {scannedResult.notes && (
                    <div className="sm:col-span-2 pt-2 border-t border-slate-800/80 text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">KI-Expertentipp: </strong>
                      {scannedResult.notes}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleConfirmAndAdd}
                  className="w-full py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Diesen Artikel in den Ausrüstungsschrank übernehmen</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
