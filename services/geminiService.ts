import { GoogleGenAI } from "@google/genai";
import { PersonProfile } from "../types";

export const generateCopilotResponse = async (
  history: { role: string; text: string }[],
  context: { type: 'directory' | 'person'; data?: PersonProfile | any },
  language: 'en' | 'ar' = 'en'
) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY not found in environment variables");
    return language === 'ar' 
      ? "خطأ: مفتاح API مفقود. يرجى التأكد من التكوين الصحيح." 
      : "Error: API Key missing. Please ensure environment is configured correctly.";
  }
  
  const ai = new GoogleGenAI({ apiKey });

  let systemInstruction = `You are a specialized Police Intelligence Copilot. 
  Your tone is professional, investigative, and concise. 
  You are analyzing a dataset of people, businesses, vehicles, and housing records.
  
  Format your response nicely. 
  Use markdown for bolding key findings. 
  If asking for lists, use bullet points.`;

  if (language === 'ar') {
      systemInstruction += `\n\nIMPORTANT: The user is speaking Arabic. YOU MUST REPLY IN ARABIC. Translate all technical terms appropriately to Arabic.`;
  } else {
      systemInstruction += `\n\nAt the end of your answer, provide 2-3 specific "Suggested follow-up questions" related to the data.`;
  }

  if (context.type === 'person' && context.data) {
    const person = context.data as PersonProfile;
    systemInstruction += `\n\nCURRENT CONTEXT: You are analyzing the profile of ${person.full_name_en} (ID: ${person.residency_id}).
    
    DATA DUMP:
    ${JSON.stringify(person, null, 2)}
    
    If asked to summarize, focus on flags, recent activity, and inconsistencies.
    If asked about assets, list vehicles and properties.
    If asked about flags, explain why they have them based on the logic:
    - Suspended License: from business licenses.
    - Flagged Vehicle: from vehicle records.
    - Address Mismatch: current city vs housing city.
    - Multiple Assets: >5 total assets.
    `;
  } else {
    systemInstruction += `\n\nCURRENT CONTEXT: You are in the People Directory (General View). 
    The user can ask general questions about the dataset or ask to find specific types of people. 
    You do not have the full database in context, but assume you can guide them to filter the list or select a person for more details.`;
  }

  try {
    // Correct API Usage: generateContent with full history
    const contents = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || (language === 'ar' ? "لم أتمكن من إنشاء استجابة." : "I was unable to generate a response.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === 'ar' 
      ? "واجهت خطأ في الاتصال بقاعدة بيانات الاستخبارات. يرجى المحاولة مرة أخرى."
      : "I encountered an error connecting to the intelligence database. Please try again.";
  }
};