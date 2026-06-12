export interface Standard {
  id: string;
  name: string;
  fullName: string;
  description: string;
  factorToEPA: number; // multiply EPA value by this to get this standard's value
  optimismRating: 'Most Realistic' | 'Very Realistic' | 'Moderate' | 'Optimistic' | 'Very Optimistic';
  optimismColor: string;
  optimismBg: string;
  hvacIncluded: string;
  realWorldAccuracy: string;
  notes: string;
  isNew?: boolean;
  accentColor: string;
  accentBg: string;
  iconEmoji: string;
}

export const STANDARDS: Standard[] = [
  {
    id: 'rurs',
    name: 'RURS',
    fullName: 'Realistic Usable Range Standard',
    description: 'Realistic Usable Range Standard',
    factorToEPA: 0.62,
    optimismRating: 'Most Realistic',
    optimismColor: 'text-emerald-400',
    optimismBg: 'bg-emerald-500/15 border-emerald-500/30',
    hvacIncluded: 'Always on (A/C + heat)',
    realWorldAccuracy: '95%+ match to daily driving',
    notes: 'Tested from 80% → 20% SoC with mandatory climate control. Represents the realistic daily usable range.',
    isNew: true,
    accentColor: '#10b981',
    accentBg: 'from-emerald-500/20 to-emerald-600/5',
    iconEmoji: '🌿',
  },
  {
    id: 'epa',
    name: 'EPA',
    fullName: 'Environmental Protection Agency',
    description: 'US standard with 0.7 derating factor',
    factorToEPA: 1.0,
    optimismRating: 'Very Realistic',
    optimismColor: 'text-blue-400',
    optimismBg: 'bg-blue-500/15 border-blue-500/30',
    hvacIncluded: 'Optional (A/C, cold tests)',
    realWorldAccuracy: '~85-90% match',
    notes: 'Primary reference for US market. Includes a 0.7 derating factor to approximate real-world conditions.',
    accentColor: '#3b82f6',
    accentBg: 'from-blue-500/20 to-blue-600/5',
    iconEmoji: '🇺🇸',
  },
  {
    id: 'wltp',
    name: 'WLTP',
    fullName: 'Worldwide Harmonised Light Vehicles Test Procedure',
    description: 'European standard replacing NEDC',
    factorToEPA: 1.22,
    optimismRating: 'Moderate',
    optimismColor: 'text-yellow-400',
    optimismBg: 'bg-yellow-500/15 border-yellow-500/30',
    hvacIncluded: 'Off (except lights)',
    realWorldAccuracy: '~75-85% match',
    notes: 'European standard introduced in 2017. More realistic than NEDC but still optimistic due to no HVAC load.',
    accentColor: '#eab308',
    accentBg: 'from-yellow-500/20 to-yellow-600/5',
    iconEmoji: '🇪🇺',
  },
  {
    id: 'cltc',
    name: 'CLTC',
    fullName: 'China Light-Duty Vehicle Test Cycle',
    description: 'China-specific with low-speed emphasis',
    factorToEPA: 1.35,
    optimismRating: 'Optimistic',
    optimismColor: 'text-orange-400',
    optimismBg: 'bg-orange-500/15 border-orange-500/30',
    hvacIncluded: 'Off',
    realWorldAccuracy: '~65-75% match',
    notes: 'China-specific standard emphasizing low-speed city driving. Typically overstates range by 20-35%.',
    accentColor: '#f97316',
    accentBg: 'from-orange-500/20 to-orange-600/5',
    iconEmoji: '🇨🇳',
  },
  {
    id: 'nedc',
    name: 'NEDC',
    fullName: 'New European Driving Cycle',
    description: 'Obsolete 1970s European cycle',
    factorToEPA: 1.45,
    optimismRating: 'Very Optimistic',
    optimismColor: 'text-red-400',
    optimismBg: 'bg-red-500/15 border-red-500/30',
    hvacIncluded: 'Off',
    realWorldAccuracy: '~55-70% match',
    notes: 'Outdated 1970s-era test with unrealistically gentle driving patterns. Being phased out globally.',
    accentColor: '#ef4444',
    accentBg: 'from-red-500/20 to-red-600/5',
    iconEmoji: '📜',
  },
];

export const KM_TO_MILES = 1 / 1.60934;
export const MILES_TO_KM = 1.60934;

export function convertBetweenStandards(
  value: number,
  fromStandardId: string,
  toStandardId: string
): number {
  const fromStandard = STANDARDS.find(s => s.id === fromStandardId);
  const toStandard = STANDARDS.find(s => s.id === toStandardId);
  if (!fromStandard || !toStandard) return 0;

  // Convert from source to EPA, then from EPA to target
  const epaValue = value / fromStandard.factorToEPA;
  return epaValue * toStandard.factorToEPA;
}

export function convertToAllStandards(
  value: number,
  fromStandardId: string
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const standard of STANDARDS) {
    if (standard.id === fromStandardId) {
      result[standard.id] = value;
    } else {
      result[standard.id] = convertBetweenStandards(value, fromStandardId, standard.id);
    }
  }
  return result;
}
