import type { FC } from 'react';
import { STANDARDS } from '../constants/conversionFactors';

interface RangeChartProps {
  values: Record<string, number>;
  unit: 'km' | 'miles';
  darkMode: boolean;
  sourceId: string;
}

const RangeChart: FC<RangeChartProps> = ({ values, unit, darkMode, sourceId }) => {
  const maxValue = Math.max(...Object.values(values), 1);
  const hasValues = Object.values(values).some(v => v > 0);

  if (!hasValues) return null;

  return (
    <div className={`rounded-2xl p-5 ${
      darkMode
        ? 'bg-white/[0.04] border border-white/[0.08]'
        : 'bg-white border border-gray-200 shadow-sm'
    }`}>
      <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${
        darkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        📊 Range Comparison
      </h3>
      <div className="space-y-3">
        {STANDARDS.map((standard) => {
          const value = values[standard.id] || 0;
          const percentage = (value / maxValue) * 100;
          const isSource = standard.id === sourceId;

          return (
            <div key={standard.id} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{standard.iconEmoji}</span>
                  <span className={`text-xs font-semibold ${
                    isSource
                      ? 'text-blue-400'
                      : darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {standard.name}
                    {standard.isNew && <span className="ml-1 text-[9px] text-emerald-400">●</span>}
                  </span>
                </div>
                <span className={`text-xs font-bold tabular-nums ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {Math.round(value).toLocaleString()} {unit}
                </span>
              </div>
              <div className={`h-5 rounded-full overflow-hidden ${
                darkMode ? 'bg-white/5' : 'bg-gray-100'
              }`}>
                <div
                  className="h-full rounded-full bar-animate transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${standard.accentColor}cc, ${standard.accentColor}88)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RangeChart;
