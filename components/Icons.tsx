import { 
  Heart, 
  CloudRain, 
  Sun, 
  Smile, 
  Frown, 
  Coffee, 
  Star,
  ArrowLeft,
  Loader2,
  Moon,
  Music
} from 'lucide-react';
import React from 'react';
import { MoodType } from '../types';

export const MoodIcon: React.FC<{ mood: MoodType, className?: string }> = ({ mood, className = "w-5 h-5" }) => {
  switch (mood) {
    case MoodType.SAD:
      return <CloudRain className={className} />;
    case MoodType.HAPPY:
      return <Sun className={className} />;
    case MoodType.ANXIOUS:
      return <Coffee className={className} />; // Represents needing a break/calm
    case MoodType.LONELY:
      return <Moon className={className} />;
    case MoodType.STRESSED:
      return <Frown className={className} />; // Or a tense face
    case MoodType.PROUD:
      return <Star className={className} />;
    case MoodType.UNINSPIRED:
        return <Loader2 className={className} />; 
    case MoodType.TIRED:
        return <Coffee className={className} />;
    default:
      return <Heart className={className} />;
  }
};

export { ArrowLeft, Loader2, Heart, Star, Music };