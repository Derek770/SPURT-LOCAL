'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  setPersistence,
  browserLocalPersistence,
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

const STORAGE_KEY = 'spurt_athlete_session';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore saved session instantly from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserProfile(parsed);
      }
    } catch {
      // ignore
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);

          let profile: UserProfile;
          if (snap.exists()) {
            profile = snap.data() as UserProfile;
          } else {
            profile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Athlete',
              photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
              preferredArea: 'Greater Noida (Pari Chowk & KP3)',
              preferredSports: ['cricket', 'football'],
              rating: 5.0,
              matchesPlayed: 0,
              createdAt: new Date().toISOString()
            };
            try {
              await setDoc(userDocRef, profile);
            } catch {
              // ignore
            }
          }

          setUserProfile(profile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        } catch (err) {
          console.warn('Profile fetch note:', err);
        }
      } else {
        // If not logged in in Firebase Auth
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
          setUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with permanent persistence
  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const userDocRef = doc(db, 'users', res.user.uid);
      
      let profile: UserProfile;
      try {
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          profile = snap.data() as UserProfile;
        } else {
          profile = {
            uid: res.user.uid,
            email,
            displayName: res.user.displayName || email.split('@')[0],
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            preferredArea: 'Greater Noida (Pari Chowk & KP3)',
            preferredSports: ['cricket', 'football'],
            rating: 5.0,
            matchesPlayed: 0,
            createdAt: new Date().toISOString()
          };
          await setDoc(userDocRef, profile);
        }
      } catch {
        profile = {
          uid: res.user.uid,
          email,
          displayName: res.user.displayName || email.split('@')[0],
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
          preferredArea: 'Greater Noida (Pari Chowk & KP3)',
          preferredSports: ['cricket', 'football'],
          rating: 5.0,
          matchesPlayed: 0,
          createdAt: new Date().toISOString()
        };
      }

      setUser(res.user);
      setUserProfile(profile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error: any) {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem(STORAGE_KEY);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register with permanent persistence
  const register = async (
    email: string, 
    pass: string, 
    displayName: string, 
    preferredArea: string = 'Greater Noida (Pari Chowk & KP3)',
    preferredSports: string[] = ['cricket', 'football']
  ) => {
    setLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName });
      
      const newProfile: UserProfile = {
        uid: res.user.uid,
        email,
        displayName,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        preferredArea,
        preferredSports,
        rating: 5.0,
        matchesPlayed: 0,
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', res.user.uid), newProfile);
      } catch {
        // ignore
      }

      setUser(res.user);
      setUserProfile(newProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        try {
          await login(email, pass);
          return;
        } catch {
          throw new Error('This email is already registered. Please sign in.');
        }
      }
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem(STORAGE_KEY);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout clears session permanently
  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
