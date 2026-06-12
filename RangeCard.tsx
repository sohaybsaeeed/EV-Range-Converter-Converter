import { useRef, useEffect, useState } from 'react';
import type { FC } from 'react';
import { Standard } from '../constants/conversionFactors';
import { Info } from 'lucide-react';

interface RangeCardProps {
  standard: Standard;
  displayValue: string;
  unit: 'km' | 'miles';
  isSource: boolean;
  isFocused: boolean;
  anyFocused: boolean;
  darkMode: boolean;
  onValueChange: (standardId: string, value: number) => void;
  onFocus: (standardId: string) => void;
  onBlur: () => void;
  index: number;
}

const RangeCard: FC<RangeCardProps> = ({
  standard,
  displayValue,
  unit,
  isSource,
  isFocused,
  anyFocused,
  darkMode,
  onValueChange,
  onFocus,
  onBlur,
  index,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [localInput, setLocalInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setLocalInput(displayValue);
    }
  }, [displayValue, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalInput(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed >= 0) {
      onValueChange(standard.id, parsed);
    } else if (raw === '' || raw === '0') {
      onValueChange(standard.id, 0);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
    onFocus(standard.id);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onBlur();
  };

  const isDimmed = anyFocused && !isFocused;

  const optimismBadgeColors: Record<string, string> = {
    'Most Realistic': darkMode
      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
      : 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Very Realistic': darkMode
      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
      : 'bg-blue-50 text-blue-700 border border-blue-200',
    'Moderate': darkMode
      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
      : 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    'Optimistic': darkMode
      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
      : 'bg-orange-50 text-orange-700 border border-orange-200',
    'Very Optimistic': darkMode
      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
      : 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <div
      className={`animate-fade-in-up relative rounded-2xl p-5 transition-all duration-300 ${
        isFocused
          ? `ring-2 scale-[1.02] ${darkMode ? 'ring-blue-400/60' : 'ring-blue-500/50'}`
          : isDimmed
            ? 'opacity-60 scale-[0.98]'
            : ''
      } ${
        darkMode
          ? 'bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/[0.08] backdrop-blur-sm'
          : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
      }`}
      style={{
        animationDelay: `${index * 80}ms`,
        ...(isFocused ? {
          boxShadow: `0 0 30px ${standard.accentColor}22, 0 4px 20px rgba(0,0,0,0.1)`
        } : {})
      }}
    >
      {/* NEW badge for RURS */}
      {standard.isNew && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 animate-pulse">
            ✦ NEW
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{standard.iconEmoji}</span>
          <div>
            <h3 className={`text-lg font-bold tracking-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {standard.name}
            </h3>
            <p className={`text-xs leading-tight max-w-[200px] ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {standard.description}
            </p>
          </div>
        </div>

        {/* Info tooltip */}
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            className={`p-1 rounded-full transition-colors ${
              darkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Info size={14} />
          </button>
          {showTooltip && (
            <div className={`absolute right-0 top-8 z-50 w-64 p-3 rounded-xl text-xs shadow-xl border ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-gray-300'
                : 'bg-white border-gray-200 text-gray-600'
            }`}>
              <p className="font-semibold mb-1">{standard.fullName}</p>
              <p className="mb-1.5">{standard.notes}</p>
              <div className="flex flex-col gap-0.5">
                <span><strong>HVAC:</strong> {standard.hvacIncluded}</span>
                <span><strong>Accuracy:</strong> {standard.realWorldAccuracy}</span>
                <span><strong>Factor vs EPA:</strong> {standard.factorToEPA}×</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optimism Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
          optimismBadgeColors[standard.optimismRating]
        }`}>
          {standard.optimismRating === 'Most Realistic' && '◆ '}
          {standard.optimismRating}
        </span>
      </div>

      {/* RURS-specific highlights */}
      {standard.id === 'rurs' && (
        <div className={`mb-3 p-3 rounded-xl space-y-1.5 border ${
          darkMode
            ? 'bg-emerald-500/[0.06] border-emerald-500/20'
            : 'bg-emerald-50/70 border-emerald-200/60'
        }`}>
          <div className="flex items-start gap-2">
            <span className="text-sm mt-px">🔋</span>
            <p className={`text-[11px] font-medium leading-snug ${
              darkMode ? 'text-emerald-300' : 'text-emerald-700'
            }`}>
              Saves Battery Life
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-sm mt-px">📊</span>
            <p className={`text-[11px] font-medium leading-snug ${
              darkMode ? 'text-emerald-300' : 'text-emerald-700'
            }`}>
              Observations are usually from 80% → 20% SoC
            </p>
          </div>
        </div>
      )}

      {/* Input + Value Display */}
      {standard.id === 'rurs' ? (
        <>
          {/* RURS Observation 1: 80% → 20% */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                darkMode
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}>
                80% → 20%
              </span>
              <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Daily Range
              </span>
            </div>
            <div className="relative">
              <input
                ref={inputRef}
                type="number"
                min="0"
                step="any"
                value={isEditing && isSource ? localInput : displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="0"
                className={`w-full text-2xl font-bold text-right pr-14 py-2.5 px-4 rounded-xl outline-none transition-all duration-200 ${
                  darkMode
                    ? `bg-white/5 border border-white/10 text-white placeholder-gray-600 ${
                        isFocused ? 'border-emerald-500/50 bg-white/[0.08]' : 'hover:bg-white/[0.07]'
                      }`
                    : `bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-300 ${
                        isFocused ? 'border-emerald-400 bg-emerald-50/30' : 'hover:bg-gray-100'
                      }`
                }`}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              />
              <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {unit}
              </span>
            </div>
          </div>

          {/* RURS Observation 2: 0% → 100% */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                darkMode
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                0% → 100%
              </span>
              <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Full Charge
              </span>
            </div>
            <div className={`relative w-full text-right py-2.5 px-4 rounded-xl ${
              darkMode
                ? 'bg-white/[0.03] border border-white/[0.06]'
                : 'bg-gray-50/70 border border-gray-100'
            }`}>
              <span className={`text-2xl font-bold tabular-nums ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {displayValue ? Math.round(parseFloat(displayValue) * (100 / 60)).toLocaleString() : '0'}
              </span>
              <span className={`ml-2 text-xs font-medium ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {unit}
              </span>
            </div>
          </div>

          {/* Source indicator */}
          {isSource && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className={`text-[10px] font-medium uppercase tracking-wider ${
                darkMode ? 'text-blue-400' : 'text-blue-500'
              }`}>
                Source
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="relative">
            <input
              ref={inputRef}
              type="number"
              min="0"
              step="any"
              value={isEditing && isSource ? localInput : displayValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="0"
              className={`w-full text-3xl font-bold text-right pr-14 py-3 px-4 rounded-xl outline-none transition-all duration-200 ${
                darkMode
                  ? `bg-white/5 border border-white/10 text-white placeholder-gray-600 ${
                      isFocused ? 'border-blue-500/50 bg-white/[0.08]' : 'hover:bg-white/[0.07]'
                    }`
                  : `bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-300 ${
                      isFocused ? 'border-blue-400 bg-blue-50/30' : 'hover:bg-gray-100'
                    }`
              }`}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            />
            <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {unit}
            </span>
          </div>

          {/* Source indicator */}
          {isSource && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className={`text-[10px] font-medium uppercase tracking-wider ${
                darkMode ? 'text-blue-400' : 'text-blue-500'
              }`}>
                Source
              </span>
            </div>
          )}
        </>
      )}

      {/* Accent bar at bottom */}
      <div
        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full opacity-40"
        style={{ backgroundColor: standard.accentColor }}
      />
    </div>
  );
};

export default RangeCard;
