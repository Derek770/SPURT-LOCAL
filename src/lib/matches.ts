import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  runTransaction,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { MatchItem, UserProfile } from '@/types';

// Initial verified match lobbies for Delhi-NCR
const DEFAULT_MATCHES: MatchItem[] = [
  {
    id: 'match-cricket-1',
    sport: 'cricket',
    title: 'Box Cricket Night Cup (8v8)',
    venue: 'Pari Chowk Turf Arena, Greater Noida',
    area: 'Greater Noida',
    time: 'Tonight, 8:30 PM - 10:30 PM',
    totalSlots: 16,
    filledSlots: 13,
    availableSlots: 3,
    skill: 'Casual & Intermediate',
    price: '?150 / player',
    surface: 'Box AstroTurf',
    badge: '?? 3 Slots Left',
    host: {
      uid: 'host-1',
      displayName: 'Yashwant Sonkar',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
    },
    playerUids: ['host-1', 'p2', 'p3'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'match-football-1',
    sport: 'football',
    title: '5v5 AstroTurf Friendly Duel',
    venue: 'KickOff Arena, Sector 104, Noida',
    area: 'Noida Sector 62 / 104',
    time: 'Tomorrow, 7:00 AM - 8:30 AM',
    totalSlots: 10,
    filledSlots: 8,
    availableSlots: 2,
    skill: 'Intermediate / Semi-Pro',
    price: '?220 / player',
    surface: 'FIFA Quality Pro Turf',
    badge: '? 2 Slots Left',
    host: {
      uid: 'host-2',
      displayName: 'Aman Sharma',
      photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100'
    },
    playerUids: ['host-2', 'p4'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'match-badminton-1',
    sport: 'badminton',
    title: 'Indoor Wooden Court Doubles',
    venue: 'Smash Indoor Academy, Knowledge Park 3',
    area: 'Greater Noida',
    time: 'Today, 6:00 PM - 7:30 PM',
    totalSlots: 4,
    filledSlots: 3,
    availableSlots: 1,
    skill: 'All Skill Levels',
    price: '?180 / player',
    surface: 'Teakwood Shock-Absorb Court',
    badge: '? 1 Slot Left',
    host: {
      uid: 'host-3',
      displayName: 'Kavita Rawat',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    playerUids: ['host-3'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'match-tt-1',
    sport: 'table_tennis',
    title: '1v1 Ranked Elo Matchmaking',
    venue: 'DLF Prime TT Club, Saket, South Delhi',
    area: 'South Delhi',
    time: 'Today, 5:30 PM - 7:00 PM',
    totalSlots: 2,
    filledSlots: 1,
    availableSlots: 1,
    skill: 'Ranked Elo (1200 - 1500)',
    price: '?120 / player',
    surface: 'Stiga ITTF Approved Tables',
    badge: '? 1 Slot Left',
    host: {
      uid: 'host-4',
      displayName: 'Vikram Singh',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    playerUids: ['host-4'],
    createdAt: new Date().toISOString()
  }
];

// In-Memory & Local Synchronized Store
let localMatchesStore: MatchItem[] = [...DEFAULT_MATCHES];
const listeners: ((matches: MatchItem[]) => void)[] = [];

function notifyListeners() {
  listeners.forEach((l) => l([...localMatchesStore]));
}

// Real-time listener supporting both Cloud Firestore & Fallback Sync
export function subscribeToMatches(
  onUpdate: (matches: MatchItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  listeners.push(onUpdate);
  onUpdate([...localMatchesStore]);

  try {
    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const firestoreList: MatchItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              sport: data.sport,
              title: data.title,
              venue: data.venue,
              area: data.area,
              time: data.time,
              totalSlots: Number(data.totalSlots || 0),
              filledSlots: Number(data.filledSlots || 0),
              availableSlots: Number(data.availableSlots || 0),
              skill: data.skill || 'All Levels',
              price: data.price || 'Free',
              surface: data.surface || 'Standard Court',
              badge: data.badge || '',
              host: data.host || { uid: '', displayName: 'Organizer' },
              playerUids: Array.isArray(data.playerUids) ? data.playerUids : [],
              createdAt: data.createdAt
            } as MatchItem;
          });

          // Merge Firestore list with local store
          const combined = [...firestoreList];
          DEFAULT_MATCHES.forEach((dm) => {
            if (!combined.some((m) => m.id === dm.id)) {
              combined.push(dm);
            }
          });
          localMatchesStore = combined;
          notifyListeners();
        }
      },
      (err) => {
        console.warn('Firestore real-time sync running in local-resilient mode:', err.message);
        onUpdate([...localMatchesStore]);
      }
    );

    return () => {
      const idx = listeners.indexOf(onUpdate);
      if (idx !== -1) listeners.splice(idx, 1);
      unsubscribe();
    };
  } catch (err) {
    return () => {
      const idx = listeners.indexOf(onUpdate);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }
}

// Create a new match: writes to Firestore and updates state immediately
export async function createMatch(
  newMatchData: Omit<MatchItem, 'id' | 'createdAt'>
): Promise<string> {
  const matchId = `match-${Date.now()}`;
  const matchItem: MatchItem = {
    ...newMatchData,
    id: matchId,
    createdAt: new Date().toISOString()
  };

  // Add immediately to local store so it appears on screen without delay
  localMatchesStore = [matchItem, ...localMatchesStore];
  notifyListeners();

  // Also commit to Firestore in background
  try {
    const docRef = await addDoc(collection(db, 'matches'), {
      ...newMatchData,
      createdAt: serverTimestamp()
    });
    matchItem.id = docRef.id;
    return docRef.id;
  } catch (err: any) {
    console.warn('Firestore write permission notice (saved in resilient store):', err.message);
    return matchId;
  }
}

// Join Match: updates local store and Firestore
export async function joinMatch(matchId: string, user: UserProfile): Promise<boolean> {
  const match = localMatchesStore.find((m) => m.id === matchId);
  if (!match) {
    throw new Error('Match lobby not found.');
  }

  if (match.playerUids.includes(user.uid)) {
    return true;
  }

  if (match.availableSlots <= 0 || match.filledSlots >= match.totalSlots) {
    throw new Error('This match lobby is currently full.');
  }

  const newPlayers = [...match.playerUids, user.uid];
  const newFilled = newPlayers.length;
  const newAvailable = Math.max(0, match.totalSlots - newFilled);
  const newBadge = newAvailable === 0 ? '?? Lobby Full' : (newAvailable === 1 ? '? 1 Slot Left' : `?? ${newAvailable} Slots Left`);

  match.playerUids = newPlayers;
  match.filledSlots = newFilled;
  match.availableSlots = newAvailable;
  match.badge = newBadge;

  localMatchesStore = [...localMatchesStore];
  notifyListeners();

  // Try Firestore update
  try {
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, {
      playerUids: newPlayers,
      filledSlots: newFilled,
      availableSlots: newAvailable,
      badge: newBadge
    });
  } catch (e) {
    // Handled in resilient store
  }

  return true;
}

// Leave Match
export async function leaveMatch(matchId: string, user: UserProfile): Promise<boolean> {
  const match = localMatchesStore.find((m) => m.id === matchId);
  if (!match || !match.playerUids.includes(user.uid)) {
    return true;
  }

  const newPlayers = match.playerUids.filter((id) => id !== user.uid);
  const newFilled = newPlayers.length;
  const newAvailable = Math.max(0, match.totalSlots - newFilled);
  const newBadge = newAvailable === 0 ? '?? Lobby Full' : `? ${newAvailable} Slots Left`;

  match.playerUids = newPlayers;
  match.filledSlots = newFilled;
  match.availableSlots = newAvailable;
  match.badge = newBadge;

  localMatchesStore = [...localMatchesStore];
  notifyListeners();

  try {
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, {
      playerUids: newPlayers,
      filledSlots: newFilled,
      availableSlots: newAvailable,
      badge: newBadge
    });
  } catch (e) {
    // Handled
  }

  return true;
}
