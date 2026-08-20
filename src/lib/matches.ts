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
import { MatchItem, UserProfile, ChatMessage } from '@/types';

// Real-Time Match List Subscriptions
let realMatchesStore: MatchItem[] = [];
const matchListeners: ((matches: MatchItem[]) => void)[] = [];

function notifyMatchListeners() {
  matchListeners.forEach((l) => l([...realMatchesStore]));
}

export function subscribeToMatches(
  onUpdate: (matches: MatchItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  matchListeners.push(onUpdate);
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
        notifyMatchListeners();
      },
      (err) => {
        console.warn('Firestore subscription notice:', err.message);
        onUpdate([...realMatchesStore]);
      }
    );

    return () => {
      const idx = matchListeners.indexOf(onUpdate);
      if (idx !== -1) matchListeners.splice(idx, 1);
      unsubscribe();
    };
  } catch (err) {
    return () => {
      const idx = matchListeners.indexOf(onUpdate);
      if (idx !== -1) matchListeners.splice(idx, 1);
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

  realMatchesStore = [matchItem, ...realMatchesStore];
  notifyMatchListeners();

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

// Join match
export async function joinMatch(matchId: string, user: UserProfile): Promise<boolean> {
  const match = realMatchesStore.find((m) => m.id === matchId);
  if (!match) return false;

  if (match.playerUids.includes(user.uid)) return true;

  if (match.availableSlots <= 0 || match.filledSlots >= match.totalSlots) {
    throw new Error('This match lobby is currently full.');
  }

  const newPlayers = [...match.playerUids, user.uid];
  const newFilled = newPlayers.length;
  const newAvailable = Math.max(0, match.totalSlots - newFilled);
  const newBadge = newAvailable === 0 ? 'Lobby Full' : `${newAvailable} Slots Left`;

  match.playerUids = newPlayers;
  match.filledSlots = newFilled;
  match.availableSlots = newAvailable;
  match.badge = newBadge;

  realMatchesStore = [...realMatchesStore];
  notifyMatchListeners();

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

// Leave match
export async function leaveMatch(matchId: string, user: UserProfile): Promise<boolean> {
  const match = realMatchesStore.find((m) => m.id === matchId);
  if (!match || !match.playerUids.includes(user.uid)) return true;

  const newPlayers = match.playerUids.filter((id) => id !== user.uid);
  const newFilled = newPlayers.length;
  const newAvailable = Math.max(0, match.totalSlots - newFilled);
  const newBadge = newAvailable === 0 ? 'Lobby Full' : `${newAvailable} Slots Left`;

  match.playerUids = newPlayers;
  match.filledSlots = newFilled;
  match.availableSlots = newAvailable;
  match.badge = newBadge;

  realMatchesStore = [...realMatchesStore];
  notifyMatchListeners();

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

// ==========================================
// REAL-TIME SQUAD CHAT ROOM SYSTEM
// ==========================================

export function subscribeToMatchChat(
  matchId: string,
  onUpdate: (messages: ChatMessage[]) => void
): () => void {
  try {
    const chatRef = collection(db, 'matches', matchId, 'messages');
    const q = query(chatRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            matchId: data.matchId || matchId,
            senderUid: data.senderUid || '',
            senderName: data.senderName || 'Athlete',
            senderPhoto: data.senderPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            text: data.text || '',
            createdAt: data.createdAt
          };
        });
        onUpdate(msgs);
      },
      (err) => {
        console.warn('Chat subscription note:', err.message);
        onUpdate([]);
      }
    );

    return unsubscribe;
  } catch (err) {
    onUpdate([]);
    return () => {};
  }
}

export async function sendChatMessage(
  matchId: string,
  user: UserProfile,
  text: string
): Promise<void> {
  if (!text.trim()) return;

  const chatRef = collection(db, 'matches', matchId, 'messages');
  await addDoc(chatRef, {
    matchId,
    senderUid: user.uid,
    senderName: user.displayName || 'Athlete',
    senderPhoto: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    text: text.trim(),
    createdAt: serverTimestamp()
  });
}
