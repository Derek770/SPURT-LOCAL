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
  bestReflexMs?: number;
  bestKeepieUppie?: number;
  karmaScore?: number;
  mvpCount?: number;
  trophies?: string[];
  upiId?: string;
  createdAt?: string;
}

export interface MatchHost {
  uid: string;
  displayName: string;
  photoURL?: string;
  karmaScore?: number;
}

export interface TeamPlayer {
  uid: string;
  displayName: string;
  skill: string;
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
  turfCost?: number;
  hostUpiId?: string;
  paidPlayerUids?: string[];
  checkedInPlayerUids?: string[];
  isSosActive?: boolean;
  sosMessage?: string;
  coordinates?: { lat: number; lng: number };
  teams?: {
    teamA: TeamPlayer[];
    teamB: TeamPlayer[];
  };
  mvpVotes?: Record<string, string>;
  mvpWinner?: { uid: string; displayName: string; votes: number };
  status?: 'open' | 'sos' | 'ongoing' | 'completed';
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
