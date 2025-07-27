import React from 'react';
import { Calendar, Sun, Moon } from 'lucide-react';

const Header = ({ theme, setTheme, startDate, setStartDate, endDate, setEndDate, allMonths, themeConfig }) => {
  const currentTheme = themeConfig[theme];
  
  return (
    <>
      <header className="mb-4 relative no-print"> 
        <h1 className="text-3xl sm:text-4xl font-bold text-center" style={{color: currentTheme.accent}}>Panel Financiero Interactivo</h1> 
        <p className="text-center mt-2" style={{color: theme === 'dark' ? '#fff' : currentTheme.textSecondary}}>Análisis Financiero</p> 
        <div className="absolute top-0 right-0">
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </button>
        </div>
      </header>
      <div className={`flex flex-wrap justify-center items-center gap-4 mb-8 p-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-200/50'} rounded-lg no-print`}>
        <label htmlFor="start-date" className="flex items-center gap-2" style={{color: theme === 'dark' ? '#fff' : currentTheme.textSecondary}}>
          <Calendar className={`h-5 w-5 ${currentTheme.accent}`}/> Desde:
        </label>
        <select 
          id="start-date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className={`${currentTheme.select.bg} ${currentTheme.select.text} ${currentTheme.select.border} rounded-md p-2`}
        >
          {allMonths.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <label htmlFor="end-date" className="flex items-center gap-2" style={{color: theme === 'dark' ? '#fff' : currentTheme.textSecondary}}>
          <Calendar className={`h-5 w-5 ${currentTheme.accent}`}/> Hasta:
        </label>
        <select 
          id="end-date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className={`${currentTheme.select.bg} ${currentTheme.select.text} ${currentTheme.select.border} rounded-md p-2`}
        >
          {allMonths.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </>
  );
};

export default Header;