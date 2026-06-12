import type { FC } from 'react';
import { Snowflake, Gauge, Battery, ChevronDown, ChevronUp } from 'lucide-react';

interface AdvancedPanelProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  winterPenalty: number;
  setWinterPenalty: (v: number) => void;
  aggressiveDriving: boolean;
  setAggressiveDriving: (v: boolean) => void;
  darkMode: boolean;
}

const AdvancedPanel: FC<AdvancedPanelProps> = ({
  isOpen,
  setIsOpen,
  winterPenalty,
  setWinterPenalty,
  aggressiveDriving,
  setAggressiveDriving,
  darkMode,
}) => {
  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${
      darkMode
        ? 'bg-white/[0.04] border border-white/[0.08]'
        : 'bg-white border border-gray-200 shadow-sm'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${
          darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            darkMode ? 'bg-purple-500/20' : 'bg-purple-50'
          }`}>
            <Gauge size={18} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
          </div>
          <div className="text-left">
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Advanced Mode
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Winter penalty, driving style adjustments
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
        ) : (
          <ChevronDown size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
        )}
      </button>

      {isOpen && (
        <div className={`px-5 pb-5 space-y-5 border-t ${
          darkMode ? 'border-white/[0.06]' : 'border-gray-100'
        }`}>
          {/* Winter Penalty Slider */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Snowflake size={16} className="text-blue-400" />
              <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Winter Penalty
              </label>
              <span className={`ml-auto text-sm font-bold ${
                winterPenalty > 0
                  ? 'text-blue-400'
                  : darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {winterPenalty > 0 ? `−${winterPenalty}%` : 'Off'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={winterPenalty}
              onChange={(e) => setWinterPenalty(parseInt(e.target.value))}
              className={`w-full ${
                darkMode ? 'bg-white/10' : 'bg-gray-200'
              }`}
            />
            <div className={`flex justify-between text-[10px] mt-1 ${
              darkMode ? 'text-gray-600' : 'text-gray-400'
            }`}>
              <span>Mild</span>
              <span>Cold</span>
              <span>Arctic</span>
            </div>
          </div>

          {/* Aggressive Driving Checkbox */}
          <div className={`flex items-center justify-between p-3 rounded-xl ${
            darkMode ? 'bg-white/5' : 'bg-gray-50'
          }`}>
            <div className="flex items-center gap-2">
              <Gauge size={16} className="text-orange-400" />
              <div>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Aggressive Driving
                </span>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Applies 0.85× factor for spirited driving
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={aggressiveDriving}
                onChange={(e) => setAggressiveDriving(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-10 h-5 rounded-full peer transition-colors duration-200 ${
                darkMode
                  ? 'bg-white/10 peer-checked:bg-orange-500'
                  : 'bg-gray-300 peer-checked:bg-orange-500'
              } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5`} />
            </label>
          </div>

          {/* 80-20 Rule Explainer */}
          <div className={`p-4 rounded-xl border ${
            darkMode
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : 'bg-emerald-50/50 border-emerald-100'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Battery size={16} className="text-emerald-400" />
              <span className={`text-sm font-semibold ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                80→20 Rule Explained
              </span>
            </div>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              RURS tests only 60% of battery capacity (80% start → 20% end) because this range 
              maximizes battery longevity. Charging above 80% or discharging below 20% accelerates 
              degradation. Most EV owners follow this rule for daily driving, making RURS the most 
              realistic predictor of your actual daily usable range.
            </p>
            <div className={`mt-3 flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <div className="flex-1 h-3 rounded-full overflow-hidden flex">
                <div className={`w-[20%] ${darkMode ? 'bg-red-500/30' : 'bg-red-100'}`} />
                <div className="w-[60%] bg-emerald-500/40" />
                <div className={`w-[20%] ${darkMode ? 'bg-red-500/30' : 'bg-red-100'}`} />
              </div>
            </div>
            <div className={`flex justify-between text-[9px] mt-0.5 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              <span>0%</span>
              <span>20%</span>
              <span>80%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedPanel;
