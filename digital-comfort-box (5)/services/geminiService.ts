import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedMessage, MoodType } from "../types";

const SYSTEM_INSTRUCTION = `
You are a supportive, warm, and funny best friend. 
Your goal is to write short, comforting notes to your best friend named Zoloo (nickname Naiz). 
The tone must be casual, friendly, and genuine. 
IMPORTANT: Strictly PLATONIC. NEVER use terms like "my love", "beloved", "darling" or anything romantic.
Use her name "Zoloo" or "Naiz" naturally in the greeting or body. Feel free to use either name.
Use terms like "bestie", "girl", "friend", or generic friendly openers.
Include a light, cheesy, or cute joke to make her smile. The joke should be wholesome, never mocking or unpleasant.
Include a mini-playlist of 3 songs that fit the specific mood perfectly.
Keep the message under 150 words.
`;

export const generateComfortMessage = async (mood: MoodType): Promise<GeneratedMessage> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Write a letter for my best friend Zoloo (aka Naiz) who is opening a digital envelope labeled "Open When You're ${mood}". 
    The letter should acknowledge her feelings warmly, make a small gentle joke to lighten the mood, and provide specific comfort or hype suited for ${mood}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A cute, friendly title (e.g., 'Hey Zoloo', 'Hi Naiz', 'Big hug', 'You got this!')" },
            content: { type: Type.STRING, description: "The friendly message body with a light joke." },
            closing: { type: Type.STRING, description: "A warm, personal sign-off (e.g., 'Always here for you,', 'Your #1 fan,')" },
            playlist: {
              type: Type.ARRAY,
              description: "A list of 3 songs that fit the mood.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Song title" },
                  artist: { type: Type.STRING, description: "Artist name" }
                }
              }
            }
          },
          required: ["title", "content", "closing", "playlist"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as GeneratedMessage;

  } catch (error) {
    console.error("Error generating message:", error);
    return {
      title: "Hey Naiz",
      content: "I'm having a little trouble connecting right now, but I'm still here for you! Why did the scarecrow win an award? Because he was outstanding in his field! Anyway, you've got this.",
      closing: "Your Bestie,",
      playlist: [
        { title: "Weightless", artist: "Marconi Union" },
        { title: "Here Comes The Sun", artist: "The Beatles" },
        { title: "Three Little Birds", artist: "Bob Marley" }
      ]
    };
  }
};