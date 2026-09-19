import { createClient, type User, type Session } from '@supabase/supabase-js';

// Environment variables for client-side Supabase connection
const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Fallback configuration
const DEFAULT_SUPABASE_URL = 'https://ypiduhkfjsmfarulgcms.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_MgHWuc1oM-ft6KRNjfjhJw_0p_vwbMT';

export const supabaseUrl = envUrl || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey = envKey || DEFAULT_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey &&
    supabaseAnonKey !== 'your-supabase-anon-key-here'
  );
}

// Single production-style Supabase client instance with automatic token renewal and persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url?: string | null;
  auth_provider: string;
  is_guest: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Maps raw Supabase Auth and network errors into clean, friendly, production-grade messages.
 * Never exposes raw stack traces, SQL errors, or internal credentials to the UI.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  if (typeof error === 'string') {
    return error;
  }

  const err = error as { message?: string; code?: string; status?: number; name?: string };
  const rawMsg = (err.message || '').toLowerCase();
  const code = (err.code || '').toLowerCase();

  // Network & Connectivity failures
  if (
    rawMsg.includes('failed to fetch') ||
    rawMsg.includes('network error') ||
    rawMsg.includes('networkrequestfailed') ||
    rawMsg.includes('err_name_not_resolved') ||
    rawMsg.includes('getaddrinfo failed')
  ) {
    return 'Unable to reach the authentication service. Please check your internet connection or try again shortly.';
  }

  // Credentials & Login
  if (
    code === 'invalid_credentials' ||
    rawMsg.includes('invalid login credentials') ||
    rawMsg.includes('invalid password') ||
    rawMsg.includes('user not found')
  ) {
    return 'Incorrect email address or password. Please verify your credentials and try again.';
  }

  // Email confirmation
  if (
    code === 'email_not_confirmed' ||
    rawMsg.includes('email not confirmed')
  ) {
    return 'Your email address has not been confirmed yet. Please check your inbox for the confirmation link.';
  }

  // Account collisions
  if (
    code === 'user_already_exists' ||
    rawMsg.includes('user already registered') ||
    rawMsg.includes('already exists')
  ) {
    return 'An account with this email address already exists. Please sign in or use password recovery.';
  }

  // Password validation
  if (
    code === 'weak_password' ||
    rawMsg.includes('password should be') ||
    rawMsg.includes('password is too short')
  ) {
    return 'Password is too weak. Please use at least 6 characters with a combination of letters and numbers.';
  }

  // Rate limiting / Quotas
  if (
    err.status === 429 ||
    code === 'over_email_send_rate_limit' ||
    rawMsg.includes('rate limit') ||
    rawMsg.includes('too many requests')
  ) {
    return 'Too many attempts. For your security, please wait a minute before trying again.';
  }

  // Anonymous Auth disabled
  if (
    rawMsg.includes('anonymous sign-ins are disabled') ||
    rawMsg.includes('anonymous logins are disabled') ||
    code === 'anonymous_provider_disabled'
  ) {
    return 'Guest access via Anonymous Auth is currently being enabled on the platform. Please create an account or sign in.';
  }

  // OAuth / Google errors
  if (rawMsg.includes('oauth') || rawMsg.includes('provider is not enabled')) {
    return 'Google Sign-In is not currently enabled in the Supabase project dashboard. Please sign in with email & password.';
  }

  // Fallback to error message if clean, otherwise generic safe message
  if (err.message && err.message.length < 150 && !err.message.includes('{"') && !err.message.includes('http')) {
    return err.message;
  }

  return 'Authentication service is temporarily unavailable. Please try again in a few moments.';
}

export type { User, Session };
