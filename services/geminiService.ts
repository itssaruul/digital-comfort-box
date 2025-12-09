import { GoogleGenAI, Type } from "@google/genai";
import { MoodType, GeneratedMessage } from '../types';

const apiKey = process.env.API_KEY || '';

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

// Fallback data tailored to the "Bestie/Naiz" persona.
// This ensures that if the API fails, the user still gets a personalized experience, not a generic error.
const FALLBACK_MESSAGES: Record<string, GeneratedMessage> = {
  [MoodType.HAPPY]: {
    title: "Hey Naiz!",
    content: "Look at you glowing! I'm so hyped for you right now. You deserve every bit of this joy. Why did the happy cloud rain? Because it sprinkled with joy! (Okay, that was bad, but you're smiling right?). Soak it all in, bestie.",
    closing: "Stay shining,",
    playlist: [{ title: "Walking on Sunshine", artist: "Katrina and the Waves" }, { title: "Good as Hell", artist: "Lizzo" }, { title: "Levitating", artist: "Dua Lipa" }]
  },
  [MoodType.SAD]: {
    title: "Oh Zoloo...",
    content: "I'm sending you the biggest virtual hug right now. It's totally okay to feel down; you don't have to be strong all the time. What do you call a bear with no teeth? A gummy bear! (Hope that made you smile a tiny bit). I'm always here for you, girl.",
    closing: "Love you bestie,",
    playlist: [{ title: "Fix You", artist: "Coldplay" }, { title: "The Night We Met", artist: "Lord Huron" }, { title: "Rainbow", artist: "Kacey Musgraves" }]
  },
  [MoodType.ANXIOUS]: {
    title: "Breathe, Naiz",
    content: "Hey, take a deep breath for me. In... and out. You got this. Why don't scientists trust atoms? Because they make up everything! Just like those worries in your head—most of them aren't real. You are safe and you are doing great.",
    closing: "You got this,",
    playlist: [{ title: "Weightless", artist: "Marconi Union" }, { title: "Breathin", artist: "Ariana Grande" }, { title: "Keep Your Head Up", artist: "Andy Grammer" }]
  },
  [MoodType.TIRED]: {
    title: "Go to sleep, girl!",
    content: "Naiz, you've been doing so much. Please go rest! The world isn't going anywhere. Why did the bicycle fall over? Because it was two-tired! (Just like you!). Put the phone down and get some cozy rest. You earned it.",
    closing: "Sleep tight,",
    playlist: [{ title: "River Flows in You", artist: "Yiruma" }, { title: "Sunrise", artist: "Norah Jones" }, { title: "Banana Pancakes", artist: "Jack Johnson" }]
  },
  [MoodType.ANGRY]: {
    title: "Let it out, Zoloo",
    content: "Oof, who made you mad? I'll fight them. Just kidding (mostly). It's okay to be fiery! Why did the tomato turn red? Because it saw the salad dressing! Vent it out, scream into a pillow, and then let it go. Don't let them ruin your peace.",
    closing: "Deep breaths,",
    playlist: [{ title: "So What", artist: "P!nk" }, { title: "Roar", artist: "Katy Perry" }, { title: "Shake It Off", artist: "Taylor Swift" }]
  },
  [MoodType.LONELY]: {
    title: "I'm right here, Naiz",
    content: "You might feel alone right now, but you've got me! Distances are just numbers. What did one wall say to the other? I'll meet you at the corner! I'm always in your corner, bestie. You are loved more than you know.",
    closing: "Always here,",
    playlist: [{ title: "Count on Me", artist: "Bruno Mars" }, { title: "You've Got a Friend", artist: "Carole King" }, { title: "Anywhere", artist: "Rita Ora" }]
  },
  [MoodType.OVERWHELMED]: {
    title: "One step at a time",
    content: "Hey Zoloo, slow down. You don't have to solve the whole world today. How do you eat an elephant? One bite at a time! (Please don't actually eat an elephant). Just do one small thing, then celebrate. You are capable of handling this.",
    closing: "Steady on,",
    playlist: [{ title: "Unwritten", artist: "Natasha Bedingfield" }, { title: "Vienna", artist: "Billy Joel" }, { title: "Three Little Birds", artist: "Bob Marley" }]
  }
};

export const generateComfortMessage = async (mood: MoodType): Promise<GeneratedMessage> => {
  // Check for API key. If missing, return the specific "Zoloo/Naiz" fallback for that mood.
  if (!apiKey) {
    console.warn("No API Key found, using fallback data.");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate a gentle loading state
    return FALLBACK_MESSAGES[mood] || FALLBACK_MESSAGES[MoodType.SAD];
  }

  try {
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
    // If the API call fails, return the specific fallback for the requested mood
    return FALLBACK_MESSAGES[mood] || FALLBACK_MESSAGES[MoodType.SAD];
  }
};
