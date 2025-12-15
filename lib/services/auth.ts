import axios, { AxiosError } from 'axios';

const toFriendlyError = (error: unknown, fallback: string) => {
  // Network or unknown error
  if (!axios.isAxiosError(error)) {
    return new Error(fallback);
  }

  const err = error as AxiosError<any>;

  // Network / no response from server
  if (err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('network')) {
    return new Error('Network error. Please check your internet connection and try again.');
  }

  if (!err.response) {
    return new Error(fallback);
  }

  const data = err.response.data as any;
  const messageFromServer =
    (typeof data === 'string' && data) ||
    data?.error ||
    data?.message;

  if (messageFromServer) {
    return new Error(messageFromServer as string);
  }

  if (err.response.status >= 500) {
    return new Error('Something went wrong on our side. Please try again in a moment.');
  }

  if (err.response.status === 401 || err.response.status === 403) {
    return new Error('You are not authorized. Please check your credentials and try again.');
  }

  return new Error(fallback);
};

export const AuthAPI = {
  register: async (data: { name: string; email: string; password: string; isAdmin?: boolean }) => {
    try {
      const res = await axios.post('/api/auth/register', data);
      return res.data;
    } catch (error) {
      throw toFriendlyError(error, 'Unable to create your account. Please try again.');
    }
  },

  login: async (data: { email: string; password: string }) => {
    try {
      const res = await axios.post('/api/auth/login', data);
      return res.data; // should return token & profile
    } catch (error) {
      throw toFriendlyError(error, 'Unable to log you in. Please check your details and try again.');
    }
  },

  getProfile: async (token: string) => {
    try {
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      throw toFriendlyError(error, 'Unable to load your profile. Please refresh the page.');
    }
  },

  logout: async (token: string) => {
    try {
      return await axios.post(
        '/api/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      // Logout failures should be silent/user-friendly
      throw toFriendlyError(error, 'Unable to log you out right now. Please refresh the page.');
    }
  },
};
