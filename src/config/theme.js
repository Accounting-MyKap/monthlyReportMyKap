// Theme configuration with enhanced styling
export const themeConfig = {
  dark: {
    background: 'bg-gray-900',
    card: 'bg-gray-800/90 backdrop-blur-sm',
    cardHover: 'hover:bg-gray-800 hover:shadow-xl',
    textPrimary: '#fff',
    textSecondary: '#e0e7ef',
    accent: '#67e8f9',
    accentHover: '#22d3ee',
    axis: '#94a3b8',
    grid: '#374151',
    gridOpacity: 0.6,
    divider: '#374151',
    tooltip: {
      bg: 'bg-gray-800/95 backdrop-blur-md',
      border: 'border-gray-600/50',
      shadow: 'shadow-xl',
    },
    select: {
      bg: 'bg-gray-700/80',
      text: 'text-white',
      border: 'border-gray-600',
      hover: 'hover:bg-gray-600',
    },
    kpiCard: {
      bg: 'bg-gradient-to-br from-gray-800 to-gray-900',
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-400/10',
    },
    header: {
      bg: 'bg-gray-900/95 backdrop-blur-md',
      border: 'border-b border-gray-700/50',
    },
  },
  light: {
    background: 'bg-gradient-to-br from-gray-50 to-gray-100',
    card: 'bg-white/90 backdrop-blur-sm',
    cardHover: 'hover:bg-white hover:shadow-xl',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    accent: '#004dda',
    accentHover: '#3b7aff',
    axis: '#64748b',
    grid: '#e2e8f0',
    gridOpacity: 0.8,
    divider: '#e2e8f0',
    tooltip: {
      bg: 'bg-white/95 backdrop-blur-md',
      border: 'border-gray-200/50',
      shadow: 'shadow-xl',
    },
    select: {
      bg: 'bg-white',
      text: 'text-gray-800',
      border: 'border-gray-300',
      hover: 'hover:bg-gray-50',
    },
    kpiCard: {
      bg: 'bg-gradient-to-br from-white to-gray-50',
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-500/10',
    },
    header: {
      bg: 'bg-white/95 backdrop-blur-md',
      border: 'border-b border-gray-200/50',
    },
  },
};

// Enhanced color palettes for charts
export const chartColors = {
  // Main balance composition
  main: ['#004dda', '#f97316', '#22c55e'],

  // Asset breakdown - Blue spectrum
  assets: [
    '#0e7490', // cyan-700
    '#0891b2', // cyan-600
    '#06b6d4', // cyan-500
    '#22d3ee', // cyan-400
    '#67e8f9', // cyan-300
  ],

  // Liability breakdown - Orange/Red spectrum
  liabilities: [
    '#c2410c', // orange-700
    '#ea580c', // orange-600
    '#f97316', // orange-500
    '#fb923c', // orange-400
    '#fdba74', // orange-300
    '#fed7aa', // orange-200
  ],

  // Equity breakdown
  equity: ['#15803d', '#22c55e', '#f97316'],

  // Income breakdown - Blue/Cyan spectrum
  income: [
    '#083344', // cyan-950
    '#0c4a6e', // sky-900
    '#0369a1', // sky-700
    '#0284c7', // sky-600
    '#0ea5e9', // sky-500
    '#38bdf8', // sky-400
  ],

  // Expense breakdown - Orange/Amber spectrum
  expenses: [
    '#7c2d12', // orange-900
    '#9a3412', // orange-800
    '#c2410c', // orange-700
    '#ea580c', // orange-600
    '#f97316', // orange-500
    '#fb923c', // orange-400
  ],

  // Portfolio colors
  cartera: ['#8b5cf6', '#d946ef'],
  carteraPropia: ['#818cf8', '#c084fc'],

  // Line chart colors
  lines: {
    income: '#004dda',
    costs: '#f59e0b',
    profit: '#22c55e',
    accumulated: '#8b5cf6',
  },
};

// Animation durations (in ms)
export const animationConfig = {
  fast: 150,
  normal: 250,
  slow: 350,
  chart: 500,
};

// Shared styles for consistency
export const sharedStyles = {
  cardBase: 'rounded-2xl shadow-card transition-all duration-250',
  cardInteractive: 'rounded-2xl shadow-card transition-all duration-250 hover:shadow-card-hover hover:-translate-y-0.5',
  buttonBase: 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-250',
  inputBase: 'rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50',
};