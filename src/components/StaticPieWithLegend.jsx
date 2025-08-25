import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { themeConfig } from '../config/theme';
import PieCustomTooltip from './PieCustomTooltip';
import { renderDrilldownPercentageLabel } from './chartLabels';
import { formatCurrency } from '../utils/formatters';

const StaticPieWithLegend = ({ title, data, colors, theme, onClick }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const sortedData = useMemo(() => (Array.isArray(data) ? [...data].sort((a, b) => b.value - a.value) : []), [data]);
  
  // Calculate total for legend display
  const totalValue = useMemo(() => {
    return sortedData.reduce((sum, item) => sum + (item.displayValue || 0), 0);
  }, [sortedData]);
  
  // Responsive chart settings
  const chartSettings = useMemo(() => {
    const isMobile = windowWidth < 640;
    const isTablet = windowWidth >= 640 && windowWidth < 1024;
    
    return {
      margin: isMobile 
        ? { top: 10, right: 10, bottom: 10, left: 10 }
        : isTablet 
        ? { top: 20, right: 20, bottom: 20, left: 20 }
        : { top: 30, right: 30, bottom: 30, left: 30 },
      outerRadius: isMobile ? 50 : isTablet ? 60 : 70
    };
  }, [windowWidth]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 flex-shrink-0" style={{color: theme === 'dark' ? '#fff' : '#004dda'}}>{title}</h2>
      <div className="w-full h-48 sm:h-56 md:h-64 flex-shrink-0">
        <ResponsiveContainer>
          <PieChart margin={chartSettings.margin}>
            <Pie
              data={sortedData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={chartSettings.outerRadius}
              labelLine={false}
              label={(props) => renderDrilldownPercentageLabel({ ...props, theme })}
              onClick={onClick}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} className={onClick ? 'cursor-pointer' : ''} />
              ))}
            </Pie>
            <Tooltip content={<PieCustomTooltip theme={theme} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full mt-2 space-y-1 sm:space-y-2 px-2 sm:px-4 overflow-y-auto">
        {/* Total line */}
        <div className="flex items-center justify-between text-sm font-semibold border-b pb-1" style={{borderColor: themeConfig[theme].textSecondary + '40'}}>
          <span style={{color: themeConfig[theme].textPrimary}}>Total</span>
          <span style={{color: themeConfig[theme].textPrimary, fontFamily: 'monospace'}}>{formatCurrency(totalValue)}</span>
        </div>
        
        {/* Chart data items */}
        {sortedData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: colors[index % colors.length] }} />
              <span style={{color: themeConfig[theme].textSecondary}}>{entry.name}</span>
            </div>
            <span style={{color: themeConfig[theme].textPrimary, fontFamily: 'monospace'}}>{formatCurrency(entry.displayValue)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

StaticPieWithLegend.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired,
  theme: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default StaticPieWithLegend;