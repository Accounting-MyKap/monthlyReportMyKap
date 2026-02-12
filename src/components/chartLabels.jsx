import { themeConfig } from '../config/theme';
import { formatCurrency } from '../utils/formatters';

/**
 * Main label for pie charts with bent guide line (elbow), better separation and omission of small sectors
 */
export const renderMainChartLabel = ({ cx, cy, midAngle, outerRadius, percent, name, value, fill, theme, index }) => {
  // Don't show labels for sectors < 1%
  if (percent * 100 < 1) return null;

  const RADIAN = Math.PI / 180;
  const currentTheme = themeConfig[theme];

  // Calculate positions with more separation to avoid overlap
  const radius = outerRadius + 25; // Increased from 15
  const sx = cx + outerRadius * Math.cos(-midAngle * RADIAN);
  const sy = cy + outerRadius * Math.sin(-midAngle * RADIAN);
  const mx = cx + (radius + 35) * Math.cos(-midAngle * RADIAN); // Increased from 25
  const my = cy + (radius + 35) * Math.sin(-midAngle * RADIAN);

  // Horizontal extension
  const isRightSide = Math.cos(-midAngle * RADIAN) >= 0;
  const ex = mx + (isRightSide ? 25 : -25); // Increased from 20
  const ey = my;

  const textAnchor = isRightSide ? 'start' : 'end';
  const textX = ex + (isRightSide ? 8 : -8);

  return (
    <g className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
      {/* Connection line */}
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
        strokeWidth={1.5}
        strokeOpacity={0.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End dot */}
      <circle
        cx={ex}
        cy={ey}
        r={3}
        fill={fill}
      />

      {/* Label background for better readability */}
      <rect
        x={textX - (isRightSide ? 2 : 95)}
        y={ey - 22}
        width={97}
        height={36}
        rx={4}
        fill={theme === 'dark' ? 'rgba(17,24,39,0.8)' : 'rgba(255,255,255,0.9)'}
        stroke={theme === 'dark' ? 'rgba(55,65,81,0.5)' : 'rgba(229,231,235,0.8)'}
        strokeWidth={1}
      />

      {/* Name and percentage */}
      <text
        x={textX}
        y={ey - 6}
        textAnchor={textAnchor}
        fill={currentTheme.textPrimary}
        fontSize={11}
        fontWeight={600}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {name.length > 12 ? name.substring(0, 12) + '...' : name}
        <tspan fill={currentTheme.textSecondary} fontSize={10} fontWeight={500}>
          {` (${(percent * 100).toFixed(2)}%)`}
        </tspan>
      </text>

      {/* Value */}
      <text
        x={textX}
        y={ey + 10}
        textAnchor={textAnchor}
        fill={fill}
        fontSize={11}
        fontWeight={700}
        fontFamily="ui-monospace, monospace"
      >
        {formatCurrency(value)}
      </text>
    </g>
  );
};

/**
 * Label for percentages in pie drilldown - simplified version
 */
export const renderDrilldownPercentageLabel = ({ cx, cy, midAngle, outerRadius, percent, fill, theme, index }) => {
  // Don't show labels for sectors < 1%
  if (percent * 100 < 1) return null;

  const RADIAN = Math.PI / 180;
  const currentTheme = themeConfig[theme];

  // Position the label outside the pie with more separation
  const radius = outerRadius + 30; // Increased from 20
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const isRightSide = Math.cos(-midAngle * RADIAN) >= 0;
  const textAnchor = isRightSide ? 'start' : 'end';

  // Format percentage with 2 decimals
  const percentText = `${(percent * 100).toFixed(2)}%`;

  return (
    <g className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
      {/* Small connecting line */}
      <line
        x1={cx + outerRadius * Math.cos(-midAngle * RADIAN)}
        y1={cy + outerRadius * Math.sin(-midAngle * RADIAN)}
        x2={x}
        y2={y}
        stroke={fill}
        strokeWidth={1}
        strokeOpacity={0.5}
      />

      {/* Background pill - wider for 2 decimals */}
      <rect
        x={x - (isRightSide ? 2 : 52)}
        y={y - 10}
        width={54}
        height={20}
        rx={10}
        fill={theme === 'dark' ? 'rgba(17,24,39,0.85)' : 'rgba(255,255,255,0.92)'}
        stroke={fill}
        strokeWidth={1.5}
        strokeOpacity={0.6}
      />

      {/* Percentage text - centered in the pill */}
      <text
        x={x + (isRightSide ? 25 : -25)}
        y={y + 4}
        textAnchor="middle"
        fill={currentTheme.textPrimary}
        fontSize={11}
        fontWeight={700}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {percentText}
      </text>
    </g>
  );
};
