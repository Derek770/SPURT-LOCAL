import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  updateDoc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { MatchItem, UserProfile, ChatMessage, TeamPlayer } from '@/types';

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
            host: data.host || { uid: '', displayName: 'Organizer', karmaScore: 100 },
            playerUids: Array.isArray(data.playerUids) ? data.playerUids : [],
            createdAt: data.createdAt,
            turfCost: data.turfCost || 1200,
            hostUpiId: data.hostUpiId || 'spurt.host@okaxis',
            paidPlayerUids: Array.isArray(data.paidPlayerUids) ? data.paidPlayerUids : [],
            checkedInPlayerUids: Array.isArray(data.checkedInPlayerUids) ? data.checkedInPlayerUids : [],
            isSosActive: Boolean(data.isSosActive),
            sosMessage: data.sosMessage || '',
            coordinates: data.coordinates || { lat: 28.4744, lng: 77.5040 },
            teams: data.teams || undefined,
            mvpVotes: data.mvpVotes || {},
            mvpWinner: data.mvpWinner || undefined,
            status: data.status || (data.isSosActive ? 'sos' : 'open')
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
    createdAt: new Date().toISOString(),
    turfCost: newMatchData.turfCost || 1200,
    hostUpiId: newMatchData.hostUpiId || 'spurt.host@okaxis',
    paidPlayerUids: [newMatchData.host.uid],
    checkedInPlayerUids: [newMatchData.host.uid],
    isSosActive: false,
    coordinates: newMatchData.coordinates || { lat: 28.4744, lng: 77.5040 }
  };

  realMatchesStore = [matchItem, ...realMatchesStore];
  notifyMatchListeners();

  try {
    const docRef = await addDoc(collection(db, 'matches'), {
      ...newMatchData,
      turfCost: matchItem.turfCost,
      hostUpiId: matchItem.hostUpiId,
      paidPlayerUids: matchItem.paidPlayerUids,
      checkedInPlayerUids: matchItem.checkedInPlayerUids,
      isSosActive: false,
      coordinates: matchItem.coordinates,
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
// 1. SOS EMERGENCY BEACON
// ==========================================
export async function toggleSosBeacon(
  matchId: string, 
  active: boolean, 
  message: string = '⚡ Urgent: Players needed now! 50% off turf share'
): Promise<void> {
  const match = realMatchesStore.find((m) => m.id === matchId);
  if (match) {
    match.isSosActive = active;
    match.sosMessage = message;
    match.status = active ? 'sos' : 'open';
    realMatchesStore = [...realMatchesStore];
    notifyMatchListeners();
  }

  try {
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, {
      isSosActive: active,
      sosMessage: message,
      status: active ? 'sos' : 'open'
    });
  } catch (err: any) {
    console.warn('SOS toggle note:', err.message);
  }
}

// ==========================================
// 2. CHECK-IN & GHOST-SHIELD KARMA
// ==========================================
export async function checkInPlayer(matchId: string, user: UserProfile): Promise<void> {
  const match = realMatchesStore.find((m) => m.id === matchId);
  if (match) {
    const list = match.checkedInPlayerUids || [];
    if (!list.includes(user.uid)) {
      match.checkedInPlayerUids = [...list, user.uid];
      realMatchesStore = [...realMatchesStore];
      notifyMatchListeners();
    }
  }

  try {
    const matchRef = doc(db, 'matches', matchId);
    const snap = await getDoc(matchRef);
    if (snap.exists()) {
      const data = snap.data();
      const list = Array.isArray(data.checkedInPlayerUids) ? data.checkedInPlayerUids : [];
      if (!list.includes(user.uid)) {
        await updateDoc(matchRef, {
          checkedInPlayerUids: [...list, user.uid]
        });
      }
    }

    // Award +5 Karma points to user profile
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const currentKarma = Number(userSnap.data().karmaScore || 100);
      await updateDoc(userRef, {
        karmaScore: Math.min(100, currentKarma + 5)
      });
    }
  } catch (err: any) {
    console.warn('Check-in note:', err.message);
  }
}

// ==========================================
// 3. UPI TURF PAYMENT TRACKER
// ==========================================
export async function markPlayerPaid(matchId: string, uid: string): Promise<void> {
  const match = realMatchesStore.find((m) => m.id === matchId);
  if (match) {
    const list = match.paidPlayerUids || [];
    if (!list.includes(uid)) {
      match.paidPlayerUids = [...list, uid];
      realMatchesStore = [...realMatchesStore];
      notifyMatchListeners();
    }
  }

  try {
    const matchRef = doc(db, 'matches', matchId);
    const snap = await getDoc(matchRef);
    if (snap.exists()) {
      const data = snap.data();
      const list = Array.isArray(data.paidPlayerUids) ? data.paidPlayerUids : [];
      if (!list.includes(uid)) {
        await updateDoc(matchRef, {
          paidPlayerUids: [...list, uid]
        });
      }
    }
  } catch (err: any) {
    console.warn('Mark paid note:', err.message);
  }
}

// ==========================================
// 4. AI FAIR-PLAY TEAM BALANCER
// ==========================================
export async function saveBalancedTeams(
  matchId: string, 
  teams: { teamA: TeamPlayer[]; teamB: TeamPlayer[] }
): Promise<void> {
  const match = realMatchesStore.find((m) => m.id === matchId);
  if (match) {
    match.teams = teams;
    realMatchesStore = [...realMatchesStore];
    notifyMatchListeners();
  }

  try {
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, { teams });
  } catch (err: any) {
    console.warn('Save teams note:', err.message);
  }
}

// ==========================================
// 5. POST-MATCH MVP VOTING
// ==========================================
export async function submitMvpVote(
  matchId: string,
  voterUid: string,
  candidateUid: string,
  candidateName: string
): Promise<void> {
  const match = realMatchesStore.find((m) => m.id === matchId);
  if (match) {
    const votes = match.mvpVotes || {};
    votes[voterUid] = candidateUid;
    match.mvpVotes = votes;
    realMatchesStore = [...realMatchesStore];
    notifyMatchListeners();
  }

  try {
    const matchRef = doc(db, 'matches', matchId);
    const snap = await getDoc(matchRef);
    if (snap.exists()) {
      const data = snap.data();
      const votes = data.mvpVotes || {};
      votes[voterUid] = candidateUid;

      // Calculate leading vote candidate
      const tally: Record<string, number> = {};
      Object.values(votes).forEach((cId: any) => {
        tally[cId] = (tally[cId] || 0) + 1;
      });

      let winnerUid = candidateUid;
      let maxVotes = 0;
      Object.entries(tally).forEach(([cId, count]) => {
        if (count > maxVotes) {
          maxVotes = count;
          winnerUid = cId;
        }
      });

      const winnerObj = { uid: winnerUid, displayName: candidateName, votes: maxVotes };

      await updateDoc(matchRef, {
        mvpVotes: votes,
        mvpWinner: winnerObj
      });

      // Award winner MVP Trophy in their profile
      const winnerRef = doc(db, 'users', winnerUid);
      const winnerSnap = await getDoc(winnerRef);
      if (winnerSnap.exists()) {
        const uData = winnerSnap.data();
        const curMvp = Number(uData.mvpCount || 0) + 1;
        const curTrophies = Array.isArray(uData.trophies) ? uData.trophies : [];
        if (!curTrophies.includes('Match MVP Champion')) {
          curTrophies.push('Match MVP Champion');
        }
        await updateDoc(winnerRef, {
          mvpCount: curMvp,
          trophies: curTrophies,
          karmaScore: Math.min(100, Number(uData.karmaScore || 100) + 10)
        });
      }
    }
  } catch (err: any) {
    console.warn('MVP vote note:', err.message);
  }
}

// ==========================================
// SQUAD CHAT ROOM SYSTEM
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
