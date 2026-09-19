import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  supabase,
  type User,
  type Session,
  type UserProfile,
  getAuthErrorMessage
} from '../services/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error?: string; requiresEmailConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInAsGuest: () => Promise<{ error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_SESSION_KEY = 'quantum_guest_auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  // Sync profile from Supabase profiles table or user metadata
  const syncProfile = useCallback(async (currentUser: User | null, isAnonymous = false): Promise<UserProfile | null> => {
    if (!currentUser) return null;

    const metadata = currentUser.user_metadata || {};
    const appMetadata = currentUser.app_metadata || {};

    const fullName =
      metadata.full_name ||
      metadata.name ||
      (isAnonymous ? 'Guest Scholar' : currentUser.email?.split('@')[0] || 'Quantum Student');

    const fallbackProfile: UserProfile = {
      id: currentUser.id,
      email: currentUser.email || null,
      full_name: fullName,
      avatar_url: metadata.avatar_url || metadata.picture || null,
      auth_provider: appMetadata.provider || (isAnonymous ? 'anonymous' : 'email'),
      is_guest: isAnonymous,
      created_at: currentUser.created_at,
    };

    try {
      // Query profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (!error && data) {
        return data as UserProfile;
      }

      // If profiles table exists and no record found, create it
      if (!error && !data && !isAnonymous) {
        await supabase.from('profiles').upsert([fallbackProfile]).select().single();
      }
    } catch {
      // Safe fallback to metadata when profiles table is still being migrated
    }

    return fallbackProfile;
  }, []);

  // Update legacy sessionStorage keys for 100% backward compatibility
  const updateLegacySessionStorage = (userProfile: UserProfile | null, _guestStatus?: boolean) => {
    try {
      if (userProfile) {
        sessionStorage.setItem('isExplored', 'true');
        sessionStorage.setItem('userName', userProfile.full_name || 'Quantum Explorer');
        sessionStorage.setItem('userEmail', userProfile.email || '');
      } else {
        sessionStorage.removeItem('isExplored');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userEmail');
      }
    } catch {
      // Ignore storage restrictions
    }
  };

  // Initial session restoration on startup
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('[Auth] Session retrieval notice:', error.message);
        }

        if (initialSession?.user) {
          const anonymous = Boolean(initialSession.user.is_anonymous);
          const prof = await syncProfile(initialSession.user, anonymous);

          if (isMounted) {
            setSession(initialSession);
            setUser(initialSession.user);
            setIsGuest(anonymous);
            setProfile(prof);
            updateLegacySessionStorage(prof, anonymous);
          }
        } else {
          // Check if user had an active guest session stored locally
          const storedGuest = localStorage.getItem(GUEST_SESSION_KEY);
          if (storedGuest) {
            try {
              const parsed = JSON.parse(storedGuest);
              if (isMounted) {
                setIsGuest(true);
                setProfile(parsed);
                updateLegacySessionStorage(parsed, true);
              }
            } catch {
              localStorage.removeItem(GUEST_SESSION_KEY);
            }
          }
        }
      } catch (err) {
        console.warn('[Auth] Session init network notice:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen to real-time auth events (token refresh, sign in, sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;

        if (currentSession?.user) {
          const anonymous = Boolean(currentSession.user.is_anonymous);
          const prof = await syncProfile(currentSession.user, anonymous);
          setSession(currentSession);
          setUser(currentSession.user);
          setIsGuest(anonymous);
          setProfile(prof);
          updateLegacySessionStorage(prof, anonymous);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          setIsGuest(false);
          localStorage.removeItem(GUEST_SESSION_KEY);
          updateLegacySessionStorage(null, false);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [syncProfile]);

  // Sign In with Email and Password
  const signInWithEmail = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: getAuthErrorMessage(error) };
      }

      if (data.user) {
        const prof = await syncProfile(data.user, false);
        setUser(data.user);
        setSession(data.session);
        setProfile(prof);
        setIsGuest(false);
        localStorage.removeItem(GUEST_SESSION_KEY);
        updateLegacySessionStorage(prof, false);
      }

      return {};
    } catch (err) {
      return { error: getAuthErrorMessage(err) };
    }
  };

  // Sign Up with Email, Password, and Full Name
  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ error?: string; requiresEmailConfirmation?: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        return { error: getAuthErrorMessage(error) };
      }

      // If user session is returned, account is active immediately
      if (data.session && data.user) {
        const prof = await syncProfile(data.user, false);
        setUser(data.user);
        setSession(data.session);
        setProfile(prof);
        setIsGuest(false);
        localStorage.removeItem(GUEST_SESSION_KEY);
        updateLegacySessionStorage(prof, false);
        return { requiresEmailConfirmation: false };
      }

      // If user exists without session, email confirmation is required
      if (data.user && !data.session) {
        return { requiresEmailConfirmation: true };
      }

      return {};
    } catch (err) {
      return { error: getAuthErrorMessage(err) };
    }
  };

  // Google OAuth Sign In
  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    try {
      // Build clean redirect URL for hash router compatibility
      const redirectUrl = window.location.origin + window.location.pathname;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return { error: getAuthErrorMessage(error) };
      }

      return {};
    } catch (err) {
      return { error: getAuthErrorMessage(err) };
    }
  };

  // Guest Sign In via Supabase Anonymous Auth
  const signInAsGuest = async (): Promise<{ error?: string }> => {
    try {
      // 1. Attempt official Supabase anonymous sign in
      const { data, error } = await supabase.auth.signInAnonymously();

      if (!error && data.user) {
        const prof = await syncProfile(data.user, true);
        setUser(data.user);
        setSession(data.session);
        setProfile(prof);
        setIsGuest(true);
        updateLegacySessionStorage(prof, true);
        return {};
      }

      // 2. If anonymous auth is not yet enabled on this Supabase project,
      // create an authenticated local guest session without generating fake credentials
      const guestId = `guest_${Math.random().toString(36).substring(2, 11)}`;
      const guestProfile: UserProfile = {
        id: guestId,
        email: null,
        full_name: 'Guest Scholar',
        avatar_url: null,
        auth_provider: 'anonymous',
        is_guest: true,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(guestProfile));
      setIsGuest(true);
      setProfile(guestProfile);
      updateLegacySessionStorage(guestProfile, true);

      return {};
    } catch (err) {
      return { error: getAuthErrorMessage(err) };
    }
  };

  // Send Password Reset Email
  const sendPasswordReset = async (email: string): Promise<{ error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}${window.location.pathname}#/login?type=recovery`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { error: getAuthErrorMessage(error) };
      }

      return {};
    } catch (err) {
      return { error: getAuthErrorMessage(err) };
    }
  };

  // Update Password (used on recovery / reset page)
  const updatePassword = async (newPassword: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: getAuthErrorMessage(error) };
      }

      return {};
    } catch (err) {
      return { error: getAuthErrorMessage(err) };
    }
  };

  // Sign Out
  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[Auth] SignOut notice:', err);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsGuest(false);
      localStorage.removeItem(GUEST_SESSION_KEY);
      updateLegacySessionStorage(null, false);
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (user) {
      const prof = await syncProfile(user, isGuest);
      setProfile(prof);
      updateLegacySessionStorage(prof, isGuest);
    }
  };

  const isAuthenticated = Boolean(user || isGuest);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isGuest,
        isAuthenticated,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInAsGuest,
        sendPasswordReset,
        updatePassword,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
