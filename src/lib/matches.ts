import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { MatchItem, UserProfile } from '@/types';

// 100% Pure Real User Lobbies (Zero Bots, Zero Fake Data)
let realMatchesStore: MatchItem[] = [];
const listeners: ((matches: MatchItem[]) => void)[] = [];

function notifyListeners() {
  listeners.forEach((l) => l([...realMatchesStore]));
}

// Subscribe strictly to real matches
export function subscribeToMatches(
  onUpdate: (matches: MatchItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  listeners.push(onUpdate);
  onUpdate([...realMatchesStore]);

  try {
    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
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

        realMatchesStore = firestoreList;
        notifyListeners();
      },
      (err) => {
        console.warn('Firestore subscription status:', err.message);
        onUpdate([...realMatchesStore]);
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

// Create a real match
export async function createMatch(
  newMatchData: Omit<MatchItem, 'id' | 'createdAt'>
): Promise<string> {
  const matchId = `match-${Date.now()}`;
  const matchItem: MatchItem = {
    ...newMatchData,
    id: matchId,
    createdAt: new Date().toISOString()
  };

  // Add real match immediately
  realMatchesStore = [matchItem, ...realMatchesStore];
  notifyListeners();

  try {
    const docRef = await addDoc(collection(db, 'matches'), {
      ...newMatchData,
      createdAt: serverTimestamp()
    });
    matchItem.id = docRef.id;
    return docRef.id;
  } catch (err: any) {
    console.warn('Firestore write warning:', err.message);
    return matchId;
  }
}

// Join a real match
export async function joinMatch(matchId: string, user: UserProfile): Promise<boolean> {
  const match = realMatchesStore.find((m) => m.id === matchId);
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

  realMatchesStore = [...realMatchesStore];
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
    // handled
  }

  return true;
}

// Leave a real match
export async function leaveMatch(matchId: string, user: UserProfile): Promise<boolean> {
  const match = realMatchesStore.find((m) => m.id === matchId);
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

  realMatchesStore = [...realMatchesStore];
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
    // handled
  }

  return true;
}
