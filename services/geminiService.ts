
import { GoogleGenAI, Type } from "@google/genai";
import { Bill, BusinessInsight } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey || apiKey === 'AIzaSyDemoKey_ReplaceWithYourActualKey') {
  console.warn('⚠️ Gemini API key not configured. Please add your actual VITE_GEMINI_API_KEY to the .env file');
}

const ai = apiKey && apiKey !== 'AIzaSyDemoKey_ReplaceWithYourActualKey' 
  ? new GoogleGenAI({ apiKey }) 
  : null;

const checkApiKey = () => {
  if (!ai) {
    throw new Error('Gemini API key not configured. Please add your API key to the .env file and restart the dev server.');
  }
};

export const processBillImage = async (base64Image: string, userContext?: string): Promise<Partial<Bill>> => {
  checkApiKey();
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    You are an Agentic AI Multi-Agent System for Bill Processing. 
    Act as 4 distinct specialized agents:
    
    1. OCR CONFIDENCE AGENT: Assign confidence scores (0-100) to every field. Flag ambiguous values.
    2. ERROR DETECTION AGENT: Cross-check all math. Verify if (Price * Qty) matches the total for each line item. Check if items sum to the Grand Total.
    3. USER-ASSISTED LEARNING AGENT: Adapt the extraction based on the user-provided context: "${userContext || 'General Business'}".
    4. WORKFLOW DECISION AGENT: Determine if the bill can be 'AUTO-SAVED' (Confidence > 90, No errors) or 'FLAGGED' (Math errors or low confidence).

    CURRENCY: Use Indian Rupees (INR - ₹).
    FORMAT: Strictly return JSON matching the schema.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      vendorName: { type: Type.STRING },
      date: { type: Type.STRING },
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            quantity: { type: Type.NUMBER },
            price: { type: Type.NUMBER },
            total: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER }
          },
          required: ["name", "quantity", "price", "total", "confidence"]
        }
      },
      grandTotal: { type: Type.NUMBER },
      overallConfidence: { type: Type.NUMBER },
      agents: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            agentName: { type: Type.STRING },
            verdict: { type: Type.STRING, enum: ["OK", "WARNING", "CRITICAL"] },
            reasoning: { type: Type.STRING }
          },
          required: ["agentName", "verdict", "reasoning"]
        }
      },
      recommendedStatus: { type: Type.STRING, enum: ["PENDING", "VERIFIED", "FLAGGED"] }
    },
    required: ["items", "grandTotal", "overallConfidence", "agents", "recommendedStatus"]
  };

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } },
          { text: `Extract all fields in INR. Perform multi-agent validation. Context: ${userContext}` }
        ]
      }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Agent logic parsing error:", error);
    throw new Error("Neural reasoning failed.");
  }
};

export const generateBusinessInsights = async (bills: Bill[]): Promise<BusinessInsight[]> => {
  checkApiKey();
  const model = "gemini-3-flash-preview";
  const simplified = bills.map(b => ({ vendor: b.vendorName, total: b.grandTotal, date: b.date }));

  const response = await ai.models.generateContent({
    model,
    contents: `Analyze these bills: ${JSON.stringify(simplified)}`,
    config: {
      systemInstruction: "You are a Retail Business Analyst. Provide 3 actionable insights (INR).",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["TREND", "ALERT", "RECOMMENDATION"] },
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            impact: { type: Type.STRING, enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"] }
          },
          required: ["type", "title", "content", "impact"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const translateText = async (text: string, targetLanguage: string, context?: string): Promise<string> => {
  const model = "gemini-3-flash-preview";
  
  const languageNames: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'hi': 'Hindi',
    'ta': 'Tamil',
    'fr': 'French',
    'ar': 'Arabic',
    'zh': 'Chinese',
    'pt': 'Portuguese',
    'de': 'German',
    'ja': 'Japanese',
    'ko': 'Korean'
  };

  const targetLangName = languageNames[targetLanguage] || targetLanguage;
  const contextNote = context ? `Context: ${context}. ` : '';

  const response = await ai.models.generateContent({
    model,
    contents: `${contextNote}Translate the following text to ${targetLangName}. Maintain the tone and business terminology appropriate for a retail/billing application. Only return the translated text without any explanation:\n\n${text}`,
    config: {
      systemInstruction: `You are a professional translator specializing in business and retail terminology. Provide natural, culturally appropriate translations that maintain the original meaning and tone.`
    }
  });

  return response.text.trim();
};

export const getLocalizedInsights = async (bills: Bill[], language: string): Promise<BusinessInsight[]> => {
  const model = "gemini-3-flash-preview";
  const simplified = bills.map(b => ({ vendor: b.vendorName, total: b.grandTotal, date: b.date }));

  const languageNames: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'hi': 'Hindi',
    'ta': 'Tamil',
    'fr': 'French',
    'ar': 'Arabic',
    'zh': 'Chinese',
    'pt': 'Portuguese',
    'de': 'German',
    'ja': 'Japanese',
    'ko': 'Korean'
  };

  const targetLangName = languageNames[language] || 'English';

  const response = await ai.models.generateContent({
    model,
    contents: `Analyze these bills and provide 3 actionable insights in ${targetLangName}: ${JSON.stringify(simplified)}`,
    config: {
      systemInstruction: `You are a Retail Business Analyst. Provide insights in ${targetLangName} that are culturally appropriate and use proper business terminology. Always include currency amounts in INR (₹).`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ["TREND", "ALERT", "RECOMMENDATION"] },
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            impact: { type: Type.STRING, enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"] }
          },
          required: ["type", "title", "content", "impact"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};
