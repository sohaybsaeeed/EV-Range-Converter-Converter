import { useState, useEffect, useCallback } from 'react';
import {
  STANDARDS,
  convertToAllStandards,
  KM_TO_MILES,
  MILES_TO_KM,
} from './constants/conversionFactors';
import RangeCard from './components/RangeCard';
import UnitToggle from './components/UnitToggle';
import AdvancedPanel from './components/AdvancedPanel';
import Sidebar from './components/Sidebar';
import RangeChart from './components/RangeChart';
import { Sun, Moon, BookOpen, Share2, BarChart3 } from 'lucide-react';

function App() {
  // Load persisted state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('ev-converter-dark');
    return saved !== null ? saved === 'true' : true;
  });
  const [unit, setUnit] = useState<'km' | 'miles'>(() => {
    const saved = localStorage.getItem('ev-converter-unit');
    return (saved === 'km' || saved === 'miles') ? saved : 'km';
  });

  // Base value is always stored in KM internally — resets on refresh
  const [baseValueKm, setBaseValueKm] = useState<number>(0);
  const [sourceStandard, setSourceStandard] = useState<string>('wltp');
  const [focusedCard, setFocusedCard] = useState<string | null>(null);

  // Advanced mode
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [winterPenalty, setWinterPenalty] = useState(0);
  const [aggressiveDriving, setAggressiveDriving] = useState(false);

  // Sidebar & chart
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const base = params.get('base');
    const value = params.get('value');
    const u = params.get('unit');
    if (base && STANDARDS.find(s => s.id === base)) {
      setSourceStandard(base);
    }
    if (value) {
      let v = parseFloat(value);
      if (!isNaN(v) && v >= 0) {
        if (u === 'miles') {
          v = v * MILES_TO_KM;
        }
        setBaseValueKm(v);
      }
    }
    if (u === 'km' || u === 'miles') {
      setUnit(u);
    }
  }, []);

  // Persist state
  useEffect(() => {
    localStorage.setItem('ev-converter-dark', String(darkMode));
  }, [darkMode]);
  useEffect(() => {
    localStorage.setItem('ev-converter-unit', unit);
  }, [unit]);


  // Compute all converted values in km
  const allValuesKm = convertToAllStandards(baseValueKm, sourceStandard);

  // Apply adjustments
  const adjustmentFactor = (1 - winterPenalty / 100) * (aggressiveDriving ? 0.85 : 1);

  const adjustedValuesKm: Record<string, number> = {};
  for (const key of Object.keys(allValuesKm)) {
    adjustedValuesKm[key] = allValuesKm[key] * adjustmentFactor;
  }

  // Convert to display unit
  const displayValues: Record<string, string> = {};
  const numericDisplayValues: Record<string, number> = {};
  for (const key of Object.keys(adjustedValuesKm)) {
    const kmVal = adjustedValuesKm[key];
    const displayVal = unit === 'miles' ? kmVal * KM_TO_MILES : kmVal;
    numericDisplayValues[key] = displayVal;
    displayValues[key] = displayVal === 0 ? '' : Math.round(displayVal).toString();
  }

  // Handle user input on a card
  const handleValueChange = useCallback((standardId: string, value: number) => {
    setSourceStandard(standardId);
    // Convert user input to KM if necessary
    const valueInKm = unit === 'miles' ? value * MILES_TO_KM : value;
    setBaseValueKm(valueInKm);
  }, [unit]);

  const handleFocus = useCallback((standardId: string) => {
    setFocusedCard(standardId);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedCard(null);
  }, []);

  // Share
  const handleShare = () => {
    const sourceVal = unit === 'miles' ? baseValueKm * KM_TO_MILES : baseValueKm;
    const url = `${window.location.origin}${window.location.pathname}?base=${sourceStandard}&value=${Math.round(sourceVal)}&unit=${unit}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Shareable link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this link:', url);
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode
        ? 'bg-[#0a0e1a] text-white'
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {darkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.04] rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px]" />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[80px]" />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚡</span>
                <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  EV Range Calculator/Converter
                </h1>
              </div>
              <p className={`text-sm sm:text-base max-w-2xl ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Compare ranges across EPA, WLTP, CLTC, NEDC, and our new{' '}
                <span className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  RURS standard
                </span>{' '}
                (80–20 daily driving).
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  darkMode
                    ? 'bg-white/10 hover:bg-white/15 text-yellow-400'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  darkMode
                    ? 'bg-white/10 hover:bg-white/15 text-blue-400'
                    : 'bg-gray-200 hover:bg-gray-300 text-blue-600'
                }`}
                title="Learn more"
              >
                <BookOpen size={18} />
              </button>
            </div>
          </div>

          {/* Unit Toggle + Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <UnitToggle unit={unit} setUnit={setUnit} darkMode={darkMode} />
            
            <button
              onClick={() => setShowChart(!showChart)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                showChart
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : darkMode
                    ? 'bg-white/10 text-gray-300 hover:bg-white/15'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <BarChart3 size={14} />
              Chart
            </button>

            <button
              onClick={handleShare}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                darkMode
                  ? 'bg-white/10 text-gray-300 hover:bg-white/15'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <Share2 size={14} />
              Share
            </button>

            {(winterPenalty > 0 || aggressiveDriving) && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                darkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
              }`}>
                Adjustments Active
              </span>
            )}
          </div>
        </header>

        {/* Conversion Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {STANDARDS.map((standard, index) => (
            <RangeCard
              key={standard.id}
              standard={standard}
              displayValue={displayValues[standard.id]}
              unit={unit}
              isSource={sourceStandard === standard.id}
              isFocused={focusedCard === standard.id}
              anyFocused={focusedCard !== null}
              darkMode={darkMode}
              onValueChange={handleValueChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              index={index}
            />
          ))}
        </div>

        {/* Chart */}
        {showChart && (
          <div className="mb-6 animate-fade-in-up">
            <RangeChart
              values={numericDisplayValues}
              unit={unit}
              darkMode={darkMode}
              sourceId={sourceStandard}
            />
          </div>
        )}

        {/* Advanced Panel */}
        <div className="mb-8">
          <AdvancedPanel
            isOpen={advancedOpen}
            setIsOpen={setAdvancedOpen}
            winterPenalty={winterPenalty}
            setWinterPenalty={setWinterPenalty}
            aggressiveDriving={aggressiveDriving}
            setAggressiveDriving={setAggressiveDriving}
            darkMode={darkMode}
          />
        </div>

        {/* Quick Reference */}
        <div className={`rounded-2xl p-5 mb-8 ${
          darkMode
            ? 'bg-white/[0.03] border border-white/[0.06]'
            : 'bg-white border border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Quick Reference: Conversion Factors (relative to EPA)
          </h3>
          <div className="flex flex-wrap gap-3">
            {STANDARDS.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${
                  darkMode ? 'bg-white/5' : 'bg-gray-50'
                }`}
              >
                <span>{s.iconEmoji}</span>
                <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {s.name}
                </span>
                <span className={`font-mono ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {s.factorToEPA}×
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className={`text-center pb-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          <div className={`border-t pt-6 ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
            <p className="text-xs leading-relaxed max-w-2xl mx-auto mb-3">
              Conversion factors derived from industry analysis across hundreds of EV models. 
              RURS assumes 80% → 20% SoC with HVAC always on. Real-world range varies by driving style, 
              temperature, terrain, and vehicle configuration. Values are approximations and may vary ±5%.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`hover:underline ${darkMode ? 'text-blue-400/60 hover:text-blue-400' : 'text-blue-500/60 hover:text-blue-500'}`}
              >
                Learn about standards
              </button>
              <span className={darkMode ? 'text-gray-700' : 'text-gray-300'}>•</span>
              <span className={darkMode ? 'text-gray-700' : 'text-gray-400'}>
                Built with ⚡ for the EV community
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} darkMode={darkMode} />
    </div>
  );
}

export default App;
