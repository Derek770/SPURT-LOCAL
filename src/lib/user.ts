import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function updateUserGameScores(
  uid: string, 
  scores: { bestReflexMs?: number; bestKeepieUppie?: number }
): Promise<void> {
  if (!uid) return;
  try {
    const userRef = doc(db, 'users', uid);
    const updates: Record<string, any> = {};
    if (scores.bestReflexMs !== undefined) {
      updates.bestReflexMs = scores.bestReflexMs;
    }
    if (scores.bestKeepieUppie !== undefined) {
      updates.bestKeepieUppie = scores.bestKeepieUppie;
    }
    await updateDoc(userRef, updates);
  } catch (err: any) {
    console.warn('Could not sync game score to Firestore:', err.message);
  }
}
