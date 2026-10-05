import api, {
  clearLocalAuthToken,
  getLocalAuthToken,
  isLocalAuthEnabled,
  setLocalAuthToken,
} from './apiClient';
import { getSupabase } from './supabase';

function throwIfError(error) {
  if (error) throw new Error(error.message);
}

export const authService = {
  async signup({ name, email, password }) {
    if (isLocalAuthEnabled) {
      const { data } = await api.post('/auth/signup/', { name, email, password });
      setLocalAuthToken(data.access_token);
      return { user: data.user, needsEmailConfirmation: false };
    }

    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name, full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    throwIfError(error);

    if (!data.session) {
      return { user: null, needsEmailConfirmation: true };
    }

    return { user: await this.getProfile(), needsEmailConfirmation: false };
  },

  async signin({ email, password }) {
    if (isLocalAuthEnabled) {
      const { data } = await api.post('/auth/signin/', { email, password });
      setLocalAuthToken(data.access_token);
      return { user: data.user };
    }

    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
    throwIfError(error);

    if (!data.session) throw new Error('Sign-in did not create an active session.');
    return { user: await this.getProfile() };
  },

  async signInWithGoogle(redirectTo = window.location.origin) {
    clearLocalAuthToken();
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    throwIfError(error);
  },

  async signout() {
    if (getLocalAuthToken()) {
      clearLocalAuthToken();
      return;
    }

    const { error } = await getSupabase().auth.signOut();
    throwIfError(error);
  },

  async getProfile() {
    const { data } = await api.get('/me/');
    return data;
  },

  async getSession() {
    const localToken = getLocalAuthToken();
    if (localToken) return { access_token: localToken };

    const { data, error } = await getSupabase().auth.getSession();
    throwIfError(error);
    return data.session;
  },
};
