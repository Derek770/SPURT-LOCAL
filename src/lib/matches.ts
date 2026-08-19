import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebase';
import { MatchItem, UserProfile } from '@/types';

// Real-time Firestore Listener on the 'matches' collection
export function subscribeToMatches(
  onUpdate: (matches: MatchItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: MatchItem[] = snapshot.docs.map((docSnap) => {
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
        onUpdate(list);
      },
      (error) => {
        console.error('Firestore matches subscription error:', error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.error('Failed to setup Firestore matches listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}

// Create a new match document in Firestore
export async function createMatch(
  newMatchData: Omit<MatchItem, 'id' | 'createdAt'>
): Promise<string> {
  const matchesRef = collection(db, 'matches');
  const docRef = await addDoc(matchesRef, {
    ...newMatchData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

// Join a match using an atomic Firestore transaction
export async function joinMatch(matchId: string, user: UserProfile): Promise<boolean> {
  const matchRef = doc(db, 'matches', matchId);

  await runTransaction(db, async (transaction) => {
    const matchSnap = await transaction.get(matchRef);
    if (!matchSnap.exists()) {
      throw new Error('Match lobby no longer exists.');
    }

    const data = matchSnap.data();
    const currentPlayers: string[] = Array.isArray(data.playerUids) ? data.playerUids : [];
    const totalSlots = Number(data.totalSlots || 0);

    // Prevent duplicate joining
    if (currentPlayers.includes(user.uid)) {
      return;
    }

    // Check availability
    if (currentPlayers.length >= totalSlots) {
      throw new Error('This match lobby is currently full.');
    }

    const newPlayers = [...currentPlayers, user.uid];
    const newFilled = newPlayers.length;
    const newAvailable = Math.max(0, totalSlots - newFilled);
    const newBadge = newAvailable === 0 
      ? '?? Lobby Full' 
      : newAvailable === 1 
      ? '? 1 Slot Left' 
      : `?? ${newAvailable} Slots Left`;

    transaction.update(matchRef, {
      playerUids: newPlayers,
      filledSlots: newFilled,
      availableSlots: newAvailable,
      badge: newBadge
    });
  });

  return true;
}

// Leave a match using an atomic Firestore transaction
export async function leaveMatch(matchId: string, user: UserProfile): Promise<boolean> {
  const matchRef = doc(db, 'matches', matchId);

  await runTransaction(db, async (transaction) => {
    const matchSnap = await transaction.get(matchRef);
    if (!matchSnap.exists()) {
      return;
    }

    const data = matchSnap.data();
    const currentPlayers: string[] = Array.isArray(data.playerUids) ? data.playerUids : [];
    const totalSlots = Number(data.totalSlots || 0);

    if (!currentPlayers.includes(user.uid)) {
      return;
    }

    const newPlayers = currentPlayers.filter((id) => id !== user.uid);
    const newFilled = newPlayers.length;
    const newAvailable = Math.max(0, totalSlots - newFilled);
    const newBadge = newAvailable === 0 
      ? '?? Lobby Full' 
      : `? ${newAvailable} Slots Left`;

    transaction.update(matchRef, {
      playerUids: newPlayers,
      filledSlots: newFilled,
      availableSlots: newAvailable,
      badge: newBadge
    });
  });

  return true;
}
