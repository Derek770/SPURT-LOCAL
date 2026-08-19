import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocs,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { MatchItem, UserProfile } from '@/types';

export const INITIAL_MATCHES: MatchItem[] = [
  {
    id: 'm-1',
    sport: 'cricket',
    title: 'Box Cricket Night League (8v8)',
    venue: 'Pari Chowk Turf Arena, Greater Noida',
    area: 'Greater Noida',
    time: 'Tonight, 8:30 PM - 10:30 PM',
    totalSlots: 16,
    filledSlots: 13,
    availableSlots: 3,
    skill: 'Casual / Intermediate',
    price: '?250/player',
    surface: 'Turf Box with Floodlights',
    badge: '?? 3 Slots Left',
    host: {
      uid: 'host_aarav',
      displayName: 'Aarav Sharma',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    playerUids: ['user_p1', 'user_p2', 'host_aarav'],
    createdAt: Date.now() - 100000
  },
  {
    id: 'm-2',
    sport: 'football',
    title: '5v5 Fast-Paced Turf Friendly',
    venue: 'KickOff Arena, Sector 104, Noida',
    area: 'Noida Sector 62 / 104',
    time: 'Tonight, 9:00 PM - 10:30 PM',
    totalSlots: 10,
    filledSlots: 9,
    availableSlots: 1,
    skill: 'Intermediate',
    price: '?300/player',
    surface: 'FIFA 2-Star AstroTurf',
    badge: '? 1 Slot Left (Midfielder)',
    host: {
      uid: 'host_kabir',
      displayName: 'Kabir Verma',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    playerUids: ['user_p3', 'host_kabir'],
    createdAt: Date.now() - 200000
  },
  {
    id: 'm-3',
    sport: 'badminton',
    title: 'Men & Mixed Doubles Rally',
    venue: 'Smash Indoor Badminton Academy, KP3',
    area: 'Greater Noida',
    time: 'Tomorrow, 7:00 AM - 9:00 AM',
    totalSlots: 4,
    filledSlots: 3,
    availableSlots: 1,
    skill: 'Intermediate / Advanced',
    price: '?200/player',
    surface: 'Yonex Synthetic Mat Court',
    badge: '?? Need 1 Partner',
    host: {
      uid: 'host_rohan',
      displayName: 'Rohan Gupta',
      photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    },
    playerUids: ['user_p4', 'host_rohan'],
    createdAt: Date.now() - 300000
  },
  {
    id: 'm-4',
    sport: 'table_tennis',
    title: '1v1 High-Focus Ranked Duel',
    venue: 'DLF Prime TT Club, South Delhi',
    area: 'South Delhi',
    time: 'Today, 6:00 PM - 7:30 PM',
    totalSlots: 2,
    filledSlots: 1,
    availableSlots: 1,
    skill: 'Competitive (Elo 1400+)',
    price: '?150/player',
    surface: 'Stag International Table',
    badge: '?? 1 Slot Open',
    host: {
      uid: 'host_aditya',
      displayName: 'Aditya Mehta',
      photoURL: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80'
    },
    playerUids: ['host_aditya'],
    createdAt: Date.now() - 400000
  }
];

// In-Memory store for real-time synchronization when Firestore runs in demo mode
let localMatches: MatchItem[] = [...INITIAL_MATCHES];
const listeners = new Set<(matches: MatchItem[]) => void>();

function notifyLocalListeners() {
  listeners.forEach(cb => cb([...localMatches]));
}

// Real-Time Listener on Cloud Firestore with local memory fallback
export function subscribeToMatches(onUpdate: (matches: MatchItem[]) => void): () => void {
  try {
    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: MatchItem[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as MatchItem));
          onUpdate(list);
        } else {
          // If Firestore is empty, seed or fallback
          onUpdate(localMatches);
        }
      },
      (error) => {
        console.warn('Firestore real-time listener using local sync:', error.message);
        listeners.add(onUpdate);
        onUpdate([...localMatches]);
      }
    );

    return () => {
      unsubscribe();
      listeners.delete(onUpdate);
    };
  } catch (err) {
    listeners.add(onUpdate);
    onUpdate([...localMatches]);
    return () => {
      listeners.delete(onUpdate);
    };
  }
}

// Create Match in Firestore
export async function createMatch(newMatchData: Omit<MatchItem, 'id' | 'createdAt'>): Promise<string> {
  try {
    const matchesRef = collection(db, 'matches');
    const docRef = await addDoc(matchesRef, {
      ...newMatchData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Saving match to local real-time store:', error);
    const newMatch: MatchItem = {
      ...newMatchData,
      id: `match_${Date.now()}`,
      createdAt: Date.now()
    };
    localMatches = [newMatch, ...localMatches];
    notifyLocalListeners();
    return newMatch.id;
  }
}

// Join Match in Firestore
export async function joinMatch(matchId: string, user: UserProfile): Promise<boolean> {
  try {
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, {
      playerUids: arrayUnion(user.uid),
      filledSlots: arrayUnion(user.uid) // or transaction
    });
    return true;
  } catch (error) {
    // Local fallback update
    const idx = localMatches.findIndex(m => m.id === matchId);
    if (idx !== -1) {
      const match = localMatches[idx];
      if (!match.playerUids.includes(user.uid) && match.availableSlots > 0) {
        match.playerUids.push(user.uid);
        match.filledSlots += 1;
        match.availableSlots = match.totalSlots - match.filledSlots;
        match.badge = match.availableSlots === 0 ? '?? Lobby Full' : `?? ${match.availableSlots} Slots Left`;
        notifyLocalListeners();
      }
    }
    return true;
  }
}

// Leave Match in Firestore
export async function leaveMatch(matchId: string, user: UserProfile): Promise<boolean> {
  try {
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, {
      playerUids: arrayRemove(user.uid)
    });
    return true;
  } catch (error) {
    const idx = localMatches.findIndex(m => m.id === matchId);
    if (idx !== -1) {
      const match = localMatches[idx];
      match.playerUids = match.playerUids.filter(id => id !== user.uid);
      match.filledSlots = Math.max(0, match.filledSlots - 1);
      match.availableSlots = match.totalSlots - match.filledSlots;
      match.badge = `? ${match.availableSlots} Slots Left`;
      notifyLocalListeners();
    }
    return true;
  }
}
