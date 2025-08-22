import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { themeConfig } from '../config/theme';
import PieCustomTooltip from './PieCustomTooltip';
import { renderDrilldownPercentageLabel } from './chartLabels';
import { formatCurrency } from '../utils/formatters';

const DrilldownPieWithLegend = ({ title, data, colors, onBack, theme }) => {
  const sortedData = useMemo(() => (Array.isArray(data) ? [...data].sort((a, b) => b.value - a.value) : []), [data]);
  
  // Special color mapping for Equity Details chart
  const getColorForEquityComponent = (name) => {
    const equityColorMap = {
      'Capital': '#15803d',
      'Period Earnings': '#22c55e',
      'Accumulated Earnings': '#f97316',
      'Provisions': '#15803d'
    };
    return equityColorMap[name] || colors[0];
  };
  
  const dataWithColors = sortedData.map((entry, index) => ({
    ...entry,
    fill: title === 'Equity Details' ? getColorForEquityComponent(entry.name) : colors[index % colors.length]
  }));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-2 flex-shrink-0">
        <h2 className="text-xl font-bold" style={{color: theme === 'dark' ? '#fff' : themeConfig[theme].accent}}>{title}</h2>
      </div>
      <div className="w-full h-[250px] flex-shrink-0">
        <ResponsiveContainer>
          <PieChart margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
            <Pie
              data={dataWithColors}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              labelLine={false}
              label={(props) => renderDrilldownPercentageLabel({ ...props, theme })}
            >
              {dataWithColors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<PieCustomTooltip theme={theme} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full mt-2 space-y-2 px-4 overflow-y-auto">
        {dataWithColors.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: entry.fill }} />
              <span style={{color: themeConfig[theme].textSecondary}}>{entry.name}</span>
            </div>
            <span style={{color: themeConfig[theme].textPrimary, fontFamily: 'monospace'}}>{formatCurrency(entry.displayValue)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

DrilldownPieWithLegend.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
  onBack: PropTypes.func,
  theme: PropTypes.string.isRequired,
};

export default DrilldownPieWithLegend;