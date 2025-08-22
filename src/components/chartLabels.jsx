import { themeConfig } from '../config/theme';
import { formatCurrency } from '../utils/formatters';

/**
 * Main label for pie charts with bent guide line (elbow), greater separation and omission of small sectors
 */
export const renderMainChartLabel = ({ cx, cy, midAngle, outerRadius, percent, name, value, fill, theme, index }) => {
  if (percent * 100 < 4) return null; // Don't show labels for sectors <4%
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

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={1.5} />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
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
export const renderDrilldownPercentageLabel = ({ cx, cy, midAngle, outerRadius, percent, fill, theme, index }) => {
  if (percent * 100 < 4) return null; // Don't show labels for sectors <4%
  const RADIAN = Math.PI / 180;
  const sx = cx + (outerRadius + 8) * Math.cos(-midAngle * RADIAN);
  const sy = cy + (outerRadius + 8) * Math.sin(-midAngle * RADIAN);
  const mx = cx + (outerRadius + 32) * Math.cos(-midAngle * RADIAN);
  const verticalOffset = (index % 2 === 0 ? -1 : 1) * 10;
  const my = cy + (outerRadius + 32) * Math.sin(-midAngle * RADIAN) + verticalOffset;
  const ex = mx + (Math.cos(-midAngle * RADIAN) >= 0 ? 1 : -1) * 5;
  const ey = my;
  const textAnchor = Math.cos(-midAngle * RADIAN) >= 0 ? 'start' : 'end';
  const fontSize = 12;

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={1.5} />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (Math.cos(-midAngle * RADIAN) >= 0 ? 1 : -1) * 12} y={ey + 4} textAnchor={textAnchor} fill={themeConfig[theme].textPrimary} fontSize={fontSize} fontWeight={700}>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};