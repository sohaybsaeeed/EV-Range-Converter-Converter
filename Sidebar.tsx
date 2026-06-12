import type { FC } from 'react';
import { X, BookOpen, BarChart3, Zap, Thermometer, Timer, Car } from 'lucide-react';
import { STANDARDS } from '../constants/conversionFactors';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  darkMode: boolean;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, setIsOpen, darkMode }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Panel */}
      <div className={`fixed right-0 top-0 bottom-0 w-full max-w-md z-50 overflow-y-auto transition-transform duration-300 ${
        darkMode
          ? 'bg-gray-900 border-l border-white/10'
          : 'bg-white border-l border-gray-200'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 flex items-center justify-between p-5 border-b backdrop-blur-xl z-10 ${
          darkMode ? 'border-white/10 bg-gray-900/90' : 'border-gray-100 bg-white/90'
        }`}>
          <div className="flex items-center gap-2">
            <BookOpen size={20} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Learn More
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Comparison Table */}
          <section>
            <h3 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <BarChart3 size={16} />
              Standards Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className={`w-full text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <th className="text-left py-2 pr-3 font-semibold">Standard</th>
                    <th className="text-left py-2 pr-3 font-semibold">Factor</th>
                    <th className="text-left py-2 pr-3 font-semibold">HVAC</th>
                    <th className="text-left py-2 font-semibold">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {STANDARDS.map((s) => (
                    <tr key={s.id} className={`border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                      <td className="py-2 pr-3 font-medium">
                        {s.iconEmoji} {s.name}
                        {s.isNew && <span className="ml-1 text-[9px] text-emerald-400 font-bold">NEW</span>}
                      </td>
                      <td className="py-2 pr-3">{s.factorToEPA}×</td>
                      <td className="py-2 pr-3">{s.hvacIncluded.split('(')[0].trim()}</td>
                      <td className="py-2">{s.realWorldAccuracy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* RURS Spotlight */}
          <section className={`p-4 rounded-xl border ${
            darkMode
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : 'bg-emerald-50 border-emerald-100'
          }`}>
            <h3 className={`flex items-center gap-2 text-sm font-bold mb-2 ${
              darkMode ? 'text-emerald-300' : 'text-emerald-700'
            }`}>
              <Zap size={16} />
              RURS Spotlight
            </h3>
            <p className={`text-xs leading-relaxed mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              The <strong>Realistic Usable Range Standard</strong> was designed to answer one question: 
              "How far can I actually drive day-to-day?" Unlike other standards, RURS:
            </p>
            <ul className={`text-xs space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                Tests from 80% → 20% SoC (the real daily charge window)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                Mandates HVAC operation (A/C in summer, heating in winter)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                Includes real-world driving patterns with highway segments
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                Preserves battery longevity by avoiding extreme SoC levels
              </li>
            </ul>
          </section>

          {/* Why Ranges Differ */}
          <section>
            <h3 className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-3 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Car size={16} />
              Why Range Estimates Differ
            </h3>
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h4 className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  🏁 Dyno vs. Real Road
                </h4>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Most standards test on a dynamometer (rolling road) in controlled conditions. 
                  Real roads add wind resistance, elevation changes, and traffic.
                </p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h4 className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  <Thermometer className="inline" size={12} /> Climate Control
                </h4>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  HVAC can consume 2–5 kW. Standards that test with climate off (WLTP, CLTC, NEDC) 
                  produce inflated range figures, especially in extreme temperatures.
                </p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <h4 className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  <Timer className="inline" size={12} /> Speed Profiles
                </h4>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  CLTC emphasizes low-speed urban driving (great for efficiency). WLTP includes 
                  higher highway speeds. NEDC barely exceeds 120 km/h. Different profiles → different results.
                </p>
              </div>
            </div>
          </section>

          {/* Methodology */}
          <section className={`p-4 rounded-xl border ${
            darkMode ? 'border-white/10' : 'border-gray-200'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Methodology
            </h3>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Conversion factors are derived from industry analysis and cross-referencing of published 
              range data across hundreds of EV models. Factors represent average ratios between standards 
              and may vary ±5% depending on vehicle type and battery chemistry. RURS assumes 80% → 20% 
              SoC with HVAC always on, representing the realistic daily usable range.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
