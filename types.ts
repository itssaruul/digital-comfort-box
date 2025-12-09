export enum MoodType {
  SAD = 'Sad',
  HAPPY = 'Happy',
  ANXIOUS = 'Anxious',
  LONELY = 'Lonely',
  STRESSED = 'Stressed',
  PROUD = 'Proud',
  UNINSPIRED = 'Uninspired',
  TIRED = 'Tired'
}

export interface Song {
  title: string;
  artist: string;
}

export interface GeneratedMessage {
  title: string;
  content: string;
  closing: string;
  playlist: Song[];
}

export interface Particle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  dx: number;
  dy: number;
}