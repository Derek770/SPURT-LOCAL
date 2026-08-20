export type SportType = 'cricket' | 'football' | 'badminton' | 'table_tennis' | 'all';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferredArea?: string;
  preferredSports?: string[];
  rating?: number;
  matchesPlayed?: number;
  createdAt?: string;
}

export interface MatchHost {
  uid: string;
  displayName: string;
  photoURL?: string;
}

export interface MatchItem {
  id: string;
  sport: 'cricket' | 'football' | 'badminton' | 'table_tennis';
  title: string;
  venue: string;
  area: string;
  time: string;
  totalSlots: number;
  filledSlots: number;
  availableSlots: number;
  skill: string;
  price: string;
  surface: string;
  badge: string;
  host: MatchHost;
  playerUids: string[];
  createdAt?: string | number;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderUid: string;
  senderName: string;
  senderPhoto?: string;
  text: string;
  createdAt?: any;
}
