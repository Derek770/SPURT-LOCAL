'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (
    email: string, 
    pass: string, 
    displayName: string, 
    preferredArea?: string, 
    preferredSports?: string[]
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Strict verification against Firestore users collection
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);

          if (snap.exists()) {
            setUser(firebaseUser);
            setUserProfile(snap.data() as UserProfile);
          } else {
            // User exists in Auth but not in Firestore users collection
            await signOut(auth);
            setUser(null);
            setUserProfile(null);
          }
        } catch (err) {
          console.error('Error verifying user profile in Firestore:', err);
          setUser(null);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Strict Login Gatekeeper
  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const userDocRef = doc(db, 'users', res.user.uid);
      const snap = await getDoc(userDocRef);

      if (!snap.exists()) {
        // Enforce strict gatekeeper: sign out immediately
        await signOut(auth);
        setUser(null);
        setUserProfile(null);
        throw new Error('Account not found. Please register first.');
      }

      setUser(res.user);
      setUserProfile(snap.data() as UserProfile);
    } catch (error: any) {
      setUser(null);
      setUserProfile(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // User Registration with immediate Firestore document creation
  const register = async (
    email: string, 
    pass: string, 
    displayName: string, 
    preferredArea: string = 'Greater Noida (Pari Chowk & KP3)',
    preferredSports: string[] = ['cricket', 'football']
  ) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName });
      
      const newProfile: UserProfile = {
        uid: res.user.uid,
        email,
        displayName,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        preferredArea,
        preferredSports,
        rating: 5.0,
        matchesPlayed: 0,
        createdAt: new Date().toISOString()
      };

      // Commit to Firestore 'users' collection
      await setDoc(doc(db, 'users', res.user.uid), newProfile);

      setUser(res.user);
      setUserProfile(newProfile);
    } catch (error: any) {
      setUser(null);
      setUserProfile(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
