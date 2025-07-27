import React from 'react';
import { Sparkles, Loader, X as IconX, Copy } from 'lucide-react';

const AIAnalysisModal = ({ theme, isOpen, onClose, analysisResult, isLoading, onCopy, copySuccess, themeConfig }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className={`${themeConfig[theme].card} rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h3 className={`text-xl font-bold ${themeConfig[theme].accent} flex items-center`}>
            <Sparkles className="mr-2"/> Análisis Financiero con IA
          </h3>
          <button onClick={onClose} className={`${themeConfig[theme].textSecondary} hover:text-white`}>
            <IconX size={24} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <Loader className={`animate-spin h-12 w-12 ${themeConfig[theme].accent}`} />
              <p className={`mt-4 ${themeConfig[theme].textSecondary}`}>Generando análisis...</p>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm md:prose-base max-w-none">
              {analysisResult.split('### ').map((section, index) => {
                if (section.trim() === '') return null;
                const parts = section.split('\n');
                const title = parts[0];
                const content = parts.slice(1).join('\n');
                return (
                  <div key={index}>
                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      {title}
                    </h3>
                    <div className={`${themeConfig[theme].textSecondary} whitespace-pre-wrap`}>
                      {content}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {!isLoading && analysisResult && (
          <div className="p-4 border-t border-gray-700 flex justify-end">
            <button 
              onClick={onCopy} 
              className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white"
            >
              <Copy className="mr-2 h-4 w-4" />
              {copySuccess || 'Copiar Texto'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisModal;