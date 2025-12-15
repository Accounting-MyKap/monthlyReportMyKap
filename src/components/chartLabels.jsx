import { themeConfig } from '../config/theme';
import { formatCurrency } from '../utils/formatters';

/**
 * Main label for pie charts with bent guide line (elbow), greater separation and omission of small sectors
 */
export const renderMainChartLabel = ({ cx, cy, midAngle, outerRadius, percent, name, value, fill, theme, index, lineStyle }) => {
  if (percent * 100 <= 1.8) return null; // Don't show labels for sectors <1.8%
  const RADIAN = Math.PI / 180;
  const sx = cx + (outerRadius + 10) * Math.cos(-midAngle * RADIAN);
  const sy = cy + (outerRadius + 10) * Math.sin(-midAngle * RADIAN);
  const mx = cx + (outerRadius + 40) * Math.cos(-midAngle * RADIAN);
  const my = cy + (outerRadius + 40) * Math.sin(-midAngle * RADIAN);
  const ex = mx + (Math.cos(-midAngle * RADIAN) >= 0 ? 1 : -1) * 5;
  const verticalOffset = (index % 2 === 0 ? -1 : 1) * 12;
  const ey = my + verticalOffset;
  const textAnchor = Math.cos(-midAngle * RADIAN) >= 0 ? 'start' : 'end';
  const fontSize = 12;
  const lineWidth = lineStyle?.strokeWidth ?? 1.5;
  const lineColor = lineStyle?.stroke ?? fill;
  const dash = lineStyle?.strokeDasharray;
  const cap = lineStyle?.strokeLinecap;
  const dotRadius = typeof lineStyle?.dotRadius === 'number' ? lineStyle.dotRadius : 3;

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={lineColor} fill="none" strokeWidth={lineWidth} strokeDasharray={dash} strokeLinecap={cap} />
      <circle cx={ex} cy={ey} r={dotRadius} fill={lineColor} stroke="none" />
      <text x={ex + (Math.cos(-midAngle * RADIAN) >= 0 ? 1 : -1) * 16} y={ey - 4} textAnchor={textAnchor} fill={themeConfig[theme].textPrimary} fontSize={fontSize} fontWeight={700}>
        {`${name} (${(percent * 100).toFixed(1)}%)`}
      </text>
      <text x={ex + (Math.cos(-midAngle * RADIAN) >= 0 ? 1 : -1) * 16} y={ey + 14} textAnchor={textAnchor} fill={themeConfig[theme].textSecondary} fontSize={fontSize - 2} fontWeight={600}>
        {formatCurrency(value)}
      </text>
    </g>
  );
};

/**
 * Label for percentages in pie drilldown with bent guide line (elbow), greater separation and omission of small sectors
 */
export const renderDrilldownPercentageLabel = ({ cx, cy, midAngle, outerRadius, percent, fill, theme, index, lineStyle }) => {
  if (percent * 100 < 1) return null; // Don't show labels for sectors <4%
  const RADIAN = Math.PI / 180;
  const sx = cx + (outerRadius + 8) * Math.cos(-midAngle * RADIAN);
  const sy = cy + (outerRadius + 8) * Math.sin(-midAngle * RADIAN);
  const mx = cx + (outerRadius + 38) * Math.cos(-midAngle * RADIAN);
  const verticalOffset = (index % 2 === 0 ? -1 : 1) * 8;
  const my = cy + (outerRadius + 38) * Math.sin(-midAngle * RADIAN) + verticalOffset;
  const ex = mx + (Math.cos(-midAngle * RADIAN) >= 0 ? 1 : -1) * 5;
  const ey = my;
  const textAnchor = Math.cos(-midAngle * RADIAN) >= 0 ? 'start' : 'end';
  const fontSize = 12;
  const lineWidth = lineStyle?.strokeWidth ?? 1.5;
  const lineColor = lineStyle?.stroke ?? fill;
  const dash = lineStyle?.strokeDasharray;
  const cap = lineStyle?.strokeLinecap;
  const dotRadius = typeof lineStyle?.dotRadius === 'number' ? lineStyle.dotRadius : 2;

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={lineColor} fill="none" strokeWidth={lineWidth} strokeDasharray={dash} strokeLinecap={cap} />
      <circle cx={ex} cy={ey} r={dotRadius} fill={lineColor} stroke="none" />
      <text x={ex + (Math.cos(-midAngle * RADIAN) >= 0 ? 1 : -1) * 12} y={ey + 4} textAnchor={textAnchor} fill={themeConfig[theme].textPrimary} fontSize={fontSize} fontWeight={700}>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};
