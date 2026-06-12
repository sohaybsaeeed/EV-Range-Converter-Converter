import type { FC } from 'react';

interface UnitToggleProps {
  unit: 'km' | 'miles';
  setUnit: (unit: 'km' | 'miles') => void;
  darkMode: boolean;
}

const UnitToggle: FC<UnitToggleProps> = ({ unit, setUnit, darkMode }) => {
  return (
    <div className={`inline-flex items-center rounded-full p-1 ${
      darkMode ? 'bg-white/10' : 'bg-gray-200'
    }`}>
      <button
        onClick={() => setUnit('km')}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
          unit === 'km'
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
            : darkMode
              ? 'text-gray-400 hover:text-gray-200'
              : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        km
      </button>
      <button
        onClick={() => setUnit('miles')}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
          unit === 'miles'
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
            : darkMode
              ? 'text-gray-400 hover:text-gray-200'
              : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        miles
      </button>
    </div>
  );
};

export default UnitToggle;
