/**
 * Generates a financial analysis using the Gemini API
 * @param {string} prompt - The prompt to generate the analysis
 * @returns {Promise<string>} - The generated analysis text
 */
export const generateFinancialAnalysis = async (prompt) => {
  try {
    // Use environment variables for the API Key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not found. Please configure VITE_GEMINI_API_KEY in your .env.local file');
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
      throw new Error(`Gemini API error (${response.status}): ${errorMessage}`);
    }
    
    const result = await response.json();
    
    if (!result.candidates || !result.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Unexpected response format from Gemini API');
    }
    
    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Detailed error:", error);
    
    // More specific error messages based on error type
    if (error.message.includes('API key')) {
      throw new Error('Configuration error: ' + error.message);
    } else if (error.name === 'TypeError' || error.name === 'SyntaxError') {
      throw new Error('Error processing API response');
    } else if (error.name === 'AbortError') {
      throw new Error('Request was cancelled due to timeout');
    } else if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your connection and try again.');
    } else {
      throw new Error(`Error generating analysis: ${error.message}`);
    }
  }
};