/**
 * Genera un análisis financiero utilizando la API de Gemini
 * @param {string} prompt - El prompt para generar el análisis
 * @returns {Promise<string>} - El texto del análisis generado
 */
export const generateFinancialAnalysis = async (prompt) => {
  try {
    // Usa variables de entorno para la API Key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key no encontrada. Por favor, configura VITE_GEMINI_API_KEY en tu archivo .env.local');
    }
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    
    const response = await fetch(apiUrl, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload) 
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || response.statusText;
      throw new Error(`Error en la API de Gemini (${response.status}): ${errorMessage}`);
    }
    
    const result = await response.json();
    
    if (!result.candidates || !result.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Formato de respuesta inesperado de la API de Gemini');
    }
    
    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error detallado:", error);
    
    // Mensajes de error más específicos según el tipo de error
    if (error.message.includes('API key')) {
      throw new Error('Error de configuración: ' + error.message);
    } else if (error.name === 'TypeError' || error.name === 'SyntaxError') {
      throw new Error('Error al procesar la respuesta de la API');
    } else if (error.name === 'AbortError') {
      throw new Error('La solicitud fue cancelada por tiempo de espera');
    } else if (!navigator.onLine) {
      throw new Error('No hay conexión a Internet. Por favor, verifica tu conexión e intenta nuevamente.');
    } else {
      throw new Error(`Error al generar el análisis: ${error.message}`);
    }
  }
};