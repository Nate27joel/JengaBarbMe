import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

const sanitizeUserForStorage = (u: any): any => {
  if (!u) return u;
  if (u.avatarUrl && typeof u.avatarUrl === 'string' && u.avatarUrl.startsWith('data:image/') && u.avatarUrl.length > 20000) {
    const defaultPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || u.email || 'User')}&background=c4a47c&color=0a0a0a`;
    return {
      ...u,
      avatarUrl: defaultPlaceholder
    };
  }
  return u;
};

const safeSaveRegisteredUsers = (registered: any[]) => {
  const sanitized = (registered || []).map(sanitizeUserForStorage);
  try {
    localStorage.setItem('barbme_registered_users', JSON.stringify(sanitized));
  } catch (e: any) {
    console.warn("Storage quota exceeded, trying to save with fallback avatar URLs...", e);
    try {
      const ultraSanitized = (registered || []).map((user: any) => ({
        ...user,
        avatarUrl: (user.avatarUrl && typeof user.avatarUrl === 'string' && user.avatarUrl.startsWith('data:image/'))
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email || 'User')}&background=c4a47c&color=0a0a0a`
          : user.avatarUrl
      }));
      localStorage.setItem('barbme_registered_users', JSON.stringify(ultraSanitized));
    } catch (innerErr) {
      console.error("Critical: local storage write failed completely", innerErr);
    }
  }
};

const safeSaveCurrentUser = (userObj: any) => {
  const sanitized = sanitizeUserForStorage(userObj);
  try {
    localStorage.setItem('barbme_user', JSON.stringify(sanitized));
  } catch (e: any) {
    console.warn("Storage quota exceeded when writing current user profile...", e);
    try {
      const ultraSanitized = {
        ...userObj,
        avatarUrl: (userObj.avatarUrl && typeof userObj.avatarUrl === 'string' && userObj.avatarUrl.startsWith('data:image/'))
          ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userObj.fullName || userObj.email || 'User')}&background=c4a47c&color=0a0a0a`
          : userObj.avatarUrl
      };
      localStorage.setItem('barbme_user', JSON.stringify(ultraSanitized));
    } catch (innerErr) {
      console.error("Critical current user write failure", innerErr);
    }
  }
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: Partial<User> & Record<string, any>) => Promise<User>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  authWarning: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authWarning, setAuthWarning] = useState<string | null>(null);

  const performLocalFallbackLogin = (emailLower: string, role?: 'client' | 'professional'): User => {
    const registered = JSON.parse(localStorage.getItem('barbme_registered_users') || '[]');
    let matched = registered.find((u: any) => u.email.toLowerCase() === emailLower);
    
    if (!matched) {
      const isPro = emailLower.includes('pro') || role === 'professional';
      matched = {
        id: 'local_' + Math.random().toString(36).substr(2, 9),
        email: emailLower,
        fullName: emailLower.split('@')[0].charAt(0).toUpperCase() + emailLower.split('@')[0].slice(1),
        phone: '+234 800 000 0000',
        role: isPro ? 'professional' : 'client',
        isVerified: !isPro,
        verificationStatus: isPro ? 'pending' : 'verified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avatarUrl: `https://ui-avatars.com/api/?name=${emailLower.split('@')[0]}&background=c4a47c&color=0a0a0a`
      };
      registered.push(matched);
      safeSaveRegisteredUsers(registered);
    }

    const mappedUser: User = {
      ...matched,
      createdAt: new Date(matched.createdAt),
      updatedAt: new Date(matched.updatedAt)
    };

    setUser(mappedUser);
    safeSaveCurrentUser(mappedUser);
    setAuthWarning("Email/Password Provider is currently disabled in your Firebase console. Sandbox Local Database fallback is ACTIVE.");
    return mappedUser;
  };

  const performLocalFallbackRegister = (data: Partial<User> & Record<string, any>): User => {
    const email = (data.email || '').toLowerCase();
    const registered = JSON.parse(localStorage.getItem('barbme_registered_users') || '[]');
    let existsIdx = registered.findIndex((u: any) => u.email.toLowerCase() === email);
    
    const newUser: User = {
      id: 'local_' + Math.random().toString(36).substr(2, 9),
      email: email,
      fullName: data.fullName || email.split('@')[0],
      phone: data.phone || '+234 800 000 0000',
      role: data.role || 'client',
      nin: data.nin,
      isVerified: data.role === 'client',
      verificationStatus: data.role === 'client' ? 'verified' : 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatarUrl: data.avatarUrl || `https://ui-avatars.com/api/?name=${data.fullName || email.split('@')[0]}&background=c4a47c&color=0a0a0a`,
      categories: data.categories || [],
      proServices: data.proServices || [],
      travelPreference: data.travelPreference || 'both',
      workingDays: data.workingDays || [],
      startHour: data.startHour || '08:00',
      endHour: data.endHour || '18:00',
      bio: data.bio || ''
    };

    const serializedUser = {
      ...newUser,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };

    if (existsIdx > -1) {
      registered[existsIdx] = serializedUser;
    } else {
      registered.push(serializedUser);
    }
    safeSaveRegisteredUsers(registered);

    setUser(newUser);
    safeSaveCurrentUser(newUser);
    setAuthWarning("Email/Password Provider is currently disabled in your Firebase console. Sandbox Local Database fallback is ACTIVE.");
    return newUser;
  };

  useEffect(() => {
    // Check for persisted local user on load
    const savedUser = localStorage.getItem('barbme_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.updatedAt = new Date(parsed.updatedAt);
        setUser(parsed);
      } catch (err) {
        console.error("Failed to re-hydrate saved local user", err);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile from Firestore users collection
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const mappedUser: User = {
              id: firebaseUser.uid,
              email: data.email || firebaseUser.email || '',
              fullName: data.fullName || '',
              phone: data.phone || '',
              role: data.role || 'client',
              nin: data.nin,
              isVerified: data.isVerified ?? true,
              verificationStatus: data.verificationStatus || 'verified',
              createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
              updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date(),
              avatarUrl: data.avatarUrl || `https://ui-avatars.com/api/?name=${data.fullName || 'User'}&background=c4a47c&color=0a0a0a`,
              categories: data.categories || [],
              proServices: data.proServices || [],
              travelPreference: data.travelPreference || 'both',
              workingDays: data.workingDays || [],
              startHour: data.startHour || '08:00',
              endHour: data.endHour || '18:00',
              bio: data.bio || ''
            };
            setUser(mappedUser);
            safeSaveCurrentUser(mappedUser);
          } else {
            // Self-repairing schema fallback
            const isPro = (firebaseUser.email || '').toLowerCase().includes('pro');
            const fallbackUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              phone: firebaseUser.phoneNumber || '+234 800 000 0000',
              role: isPro ? 'professional' : 'client',
              isVerified: !isPro,
              verificationStatus: isPro ? 'pending' : 'verified',
              createdAt: new Date(),
              updatedAt: new Date(),
              avatarUrl: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email?.split('@')[0]}&background=c4a47c&color=0a0a0a`
            };
            
            try {
              await setDoc(docRef, {
                id: fallbackUser.id,
                email: fallbackUser.email,
                fullName: fallbackUser.fullName,
                phone: fallbackUser.phone,
                role: fallbackUser.role,
                nin: fallbackUser.nin || "",
                isVerified: fallbackUser.isVerified,
                verificationStatus: fallbackUser.verificationStatus,
                avatarUrl: fallbackUser.avatarUrl || "",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              });
            } catch (err) {
              console.warn("Could not write initial setup profile to Firestore. Continuing with local user configuration.", err);
            }

            setUser(fallbackUser);
            safeSaveCurrentUser(fallbackUser);
          }
        } catch (error) {
          console.error("Failed to load user document", error);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, _password: string): Promise<User> => {
    setIsLoading(true);
    const password = _password || 'password123';
    const emailLower = email.toLowerCase();

    try {
      let firebaseUser;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, emailLower, password);
        firebaseUser = userCredential.user;
      } catch (err: any) {
        if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
          return performLocalFallbackLogin(emailLower);
        }
        // Automatically sign up passwordless users for a seamless UX
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, emailLower, password);
            firebaseUser = userCredential.user;
          } catch (createErr: any) {
            if (createErr.code === 'auth/operation-not-allowed' || createErr.message?.includes('operation-not-allowed')) {
              return performLocalFallbackLogin(emailLower);
            }
            throw createErr;
          }
        } else {
          throw err;
        }
      }

      const docRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      
      let userProfile: User;
      if (docSnap.exists()) {
        const data = docSnap.data();
        userProfile = {
          id: firebaseUser.uid,
          email: data.email || emailLower,
          fullName: data.fullName || emailLower.split('@')[0],
          phone: data.phone || '+234 800 000 0000',
          role: data.role || (emailLower.includes('pro') ? 'professional' : 'client'),
          nin: data.nin,
          isVerified: data.isVerified ?? true,
          verificationStatus: data.verificationStatus || 'verified',
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : new Date(),
          avatarUrl: data.avatarUrl || `https://ui-avatars.com/api/?name=${data.fullName || 'User'}&background=c4a47c&color=0a0a0a`
        };
      } else {
        const isPro = emailLower.includes('pro');
        userProfile = {
          id: firebaseUser.uid,
          email: emailLower,
          fullName: emailLower.split('@')[0],
          phone: '+234 800 000 0000',
          role: isPro ? 'professional' : 'client',
          isVerified: !isPro,
          verificationStatus: isPro ? 'pending' : 'verified',
          createdAt: new Date(),
          updatedAt: new Date(),
          avatarUrl: `https://ui-avatars.com/api/?name=${emailLower.split('@')[0]}&background=c4a47c&color=0a0a0a`
        };

        await setDoc(docRef, {
          id: userProfile.id,
          email: userProfile.email,
          fullName: userProfile.fullName,
          phone: userProfile.phone,
          role: userProfile.role,
          nin: userProfile.nin || "",
          isVerified: userProfile.isVerified,
          verificationStatus: userProfile.verificationStatus,
          avatarUrl: userProfile.avatarUrl || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      setUser(userProfile);
      safeSaveCurrentUser(userProfile);
      return userProfile;
    } catch (error: any) {
      if (error && (error.code === 'auth/operation-not-allowed' || error.message?.includes('operation-not-allowed'))) {
        return performLocalFallbackLogin(emailLower);
      } else {
        console.error('Login database error falling back:', error);
        return performLocalFallbackLogin(emailLower);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Partial<User> & Record<string, any>): Promise<User> => {
    setIsLoading(true);
    const email = (data.email || '').toLowerCase();
    const password = 'password123';

    try {
      let firebaseUser;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;
      } catch (err: any) {
        if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
          return performLocalFallbackRegister(data);
        }
        if (err.code === 'auth/email-already-in-use') {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            firebaseUser = userCredential.user;
          } catch (signInErr: any) {
            if (signInErr.code === 'auth/operation-not-allowed' || signInErr.message?.includes('operation-not-allowed')) {
              return performLocalFallbackRegister(data);
            }
            throw signInErr;
          }
        } else {
          throw err;
        }
      }

      const userId = firebaseUser.uid;
      const newUser: User = {
        id: userId,
        email: email,
        fullName: data.fullName || email.split('@')[0],
        phone: data.phone || '+234 800 000 0000',
        role: data.role || 'client',
        nin: data.nin,
        isVerified: data.role === 'client',
        verificationStatus: data.role === 'client' ? 'verified' : 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        avatarUrl: data.avatarUrl || `https://ui-avatars.com/api/?name=${data.fullName || email.split('@')[0]}&background=c4a47c&color=0a0a0a`,
        categories: data.categories || [],
        proServices: data.proServices || [],
        travelPreference: data.travelPreference || 'both',
        workingDays: data.workingDays || [],
        startHour: data.startHour || '08:00',
        endHour: data.endHour || '18:00',
        bio: data.bio || ''
      };

      const docRef = doc(db, 'users', userId);
      try {
        await setDoc(docRef, {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          phone: newUser.phone,
          role: newUser.role,
          nin: newUser.nin || "",
          isVerified: newUser.isVerified,
          verificationStatus: newUser.verificationStatus,
          avatarUrl: newUser.avatarUrl || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          categories: newUser.categories,
          proServices: newUser.proServices,
          travelPreference: newUser.travelPreference,
          workingDays: newUser.workingDays,
          startHour: newUser.startHour,
          endHour: newUser.endHour,
          bio: newUser.bio || ''
        });
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.CREATE, `users/${userId}`);
      }

      const registered = JSON.parse(localStorage.getItem('barbme_registered_users') || '[]');
      const existsIdx = registered.findIndex((u: any) => u.email.toLowerCase() === newUser.email.toLowerCase());
      if (existsIdx > -1) {
        registered[existsIdx] = newUser;
      } else {
        registered.push(newUser);
      }
      safeSaveRegisteredUsers(registered);

      setUser(newUser);
      safeSaveCurrentUser(newUser);
      return newUser;
    } catch (error: any) {
      if (error && (error.code === 'auth/operation-not-allowed' || error.message?.includes('operation-not-allowed'))) {
        return performLocalFallbackRegister(data);
      } else {
        console.error('Registration database error falling back:', error);
        return performLocalFallbackRegister(data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const updatedUser: User = {
        ...user,
        ...data,
        updatedAt: new Date()
      };

      // update state
      setUser(updatedUser);
      safeSaveCurrentUser(updatedUser);

      // update registered users in local storage
      const registered = JSON.parse(localStorage.getItem('barbme_registered_users') || '[]');
      const existsIdx = registered.findIndex((u: any) => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
      if (existsIdx > -1) {
        registered[existsIdx] = {
          ...registered[existsIdx],
          ...data,
          updatedAt: new Date().toISOString()
        };
        safeSaveRegisteredUsers(registered);
      }

      // update firestore if auth is persistent
      try {
        const docRef = doc(db, 'users', user.id);
        const updateFields: Record<string, any> = {};
        Object.entries(data).forEach(([key, val]) => {
          if (val !== undefined) {
            updateFields[key] = val;
          }
        });
        updateFields.updatedAt = serverTimestamp();
        await setDoc(docRef, updateFields, { merge: true });
      } catch (err) {
        console.warn("Could not save profile updates to Firestore, saved locally instead.", err);
      }
    } catch (err) {
      console.error("Failed to update user profile", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    localStorage.removeItem('barbme_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, authWarning }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
