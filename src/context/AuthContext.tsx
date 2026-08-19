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
  register: (email: string, pass: string, name: string, area?: string, sports?: string[]) => Promise<void>;
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
    // Check local storage for active demo user if offline/demo
    const cached = typeof window !== 'undefined' ? localStorage.getItem('sportmatch_user_profile') : null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setUserProfile(parsed);
      } catch (e) {}
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUserProfile(data);
            localStorage.setItem('sportmatch_user_profile', JSON.stringify(data));
          } else {
            const fallback: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Player',
              photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
              preferredArea: 'Greater Noida',
              rating: 5.0,
              matchesPlayed: 1
            };
            setUserProfile(fallback);
            localStorage.setItem('sportmatch_user_profile', JSON.stringify(fallback));
          }
        } catch (err) {
          // Firebase connection error fallback
          console.warn('Using local profile sync:', err);
        }
      } else {
        setUser(null);
        // keep local demo profile if set
        if (!cached) setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      setUser(res.user);
      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || email,
        displayName: res.user.displayName || email.split('@')[0],
        photoURL: res.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        preferredArea: 'Greater Noida (Pari Chowk & KP3)',
        rating: 4.9,
        matchesPlayed: 12
      };
      setUserProfile(profile);
      localStorage.setItem('sportmatch_user_profile', JSON.stringify(profile));
    } catch (error: any) {
      console.warn('Firebase login fallback demo mode:', error.message);
      // Demo simulated login
      const demoProfile: UserProfile = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split('@')[0].toUpperCase(),
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        preferredArea: 'Greater Noida (Pari Chowk & KP3)',
        rating: 4.9,
        matchesPlayed: 14
      };
      setUserProfile(demoProfile);
      localStorage.setItem('sportmatch_user_profile', JSON.stringify(demoProfile));
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string, 
    pass: string, 
    displayName: string, 
    preferredArea: string = 'Greater Noida',
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

      try {
        await setDoc(doc(db, 'users', res.user.uid), newProfile);
      } catch (e) {}

      setUser(res.user);
      setUserProfile(newProfile);
      localStorage.setItem('sportmatch_user_profile', JSON.stringify(newProfile));
    } catch (error: any) {
      console.warn('Firebase register fallback demo mode:', error.message);
      const newProfile: UserProfile = {
        uid: `user_${Date.now()}`,
        email,
        displayName,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        preferredArea,
        preferredSports,
        rating: 5.0,
        matchesPlayed: 0,
        createdAt: new Date().toISOString()
      };
      setUserProfile(newProfile);
      localStorage.setItem('sportmatch_user_profile', JSON.stringify(newProfile));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('sportmatch_user_profile');
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
