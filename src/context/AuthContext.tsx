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
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);

          if (snap.exists()) {
            setUser(firebaseUser);
            setUserProfile(snap.data() as UserProfile);
          } else {
            // Auto-provision profile document if missing
            const fallbackProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Athlete',
              photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
              preferredArea: 'Greater Noida (Pari Chowk & KP3)',
              preferredSports: ['cricket', 'football'],
              rating: 5.0,
              matchesPlayed: 0,
              createdAt: new Date().toISOString()
            };
            try {
              await setDoc(userDocRef, fallbackProfile);
              setUser(firebaseUser);
              setUserProfile(fallbackProfile);
            } catch {
              setUser(firebaseUser);
              setUserProfile(fallbackProfile);
            }
          }
        } catch (err) {
          console.error('Error in onAuthStateChanged:', err);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login: If doc is missing in Firestore, auto-provision so user is never locked out
  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
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
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            preferredArea: 'Greater Noida (Pari Chowk & KP3)',
            preferredSports: ['cricket', 'football'],
            rating: 5.0,
            matchesPlayed: 0,
            createdAt: new Date().toISOString()
          };
          await setDoc(userDocRef, profile);
        }
      } catch (firestoreErr) {
        profile = {
          uid: res.user.uid,
          email,
          displayName: res.user.displayName || email.split('@')[0],
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          preferredArea: 'Greater Noida (Pari Chowk & KP3)',
          preferredSports: ['cricket', 'football'],
          rating: 5.0,
          matchesPlayed: 0,
          createdAt: new Date().toISOString()
        };
      }

      setUser(res.user);
      setUserProfile(profile);
    } catch (error: any) {
      setUser(null);
      setUserProfile(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register: Creates Auth + Firestore doc
  const register = async (
    email: string, 
    pass: string, 
    displayName: string, 
    preferredArea: string = 'Greater Noida (Pari Chowk & KP3)',
    preferredSports: string[] = ['cricket', 'football']
  ) => {
    setLoading(true);
    let createdUser: User | null = null;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      createdUser = res.user;
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
      } catch (fsErr: any) {
        console.warn('Firestore setDoc warning:', fsErr);
        // Continue even if Firestore security rules are still being published
      }

      setUser(res.user);
      setUserProfile(newProfile);
    } catch (error: any) {
      // If email is already in use, try logging in
      if (error.code === 'auth/email-already-in-use') {
        try {
          await login(email, pass);
          return;
        } catch (loginErr) {
          throw new Error('This email is already registered. Please click Sign In to enter.');
        }
      }
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
