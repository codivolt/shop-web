import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearSession,
  getToken,
  readSession,
  saveSession,
  updateStoredUser,
} from '../../src/lib/session';
import type { AuthResponse } from '../../src/lib/types';

const auth: AuthResponse = {
  access_token: 'token-1',
  user: {
    id: 'u1',
    firstName: 'علی',
    lastName: 'رضایی',
    phone: '09123456789',
    role: 'customer',
    isActive: true,
    createdAt: '',
    updatedAt: '',
  },
} as AuthResponse;

describe('session', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts empty', () => {
    expect(readSession()).toEqual({ token: null, user: null });
    expect(getToken()).toBeNull();
  });

  it('saves and reads a session', () => {
    saveSession(auth);
    expect(getToken()).toBe('token-1');
    expect(readSession().user?.id).toBe('u1');
  });

  it('updates the stored user', () => {
    saveSession(auth);
    updateStoredUser({ ...(readSession().user as NonNullable<typeof auth.user>), firstName: 'رضا' });
    expect(readSession().user?.firstName).toBe('رضا');
  });

  it('clears the session', () => {
    saveSession(auth);
    clearSession();
    expect(readSession()).toEqual({ token: null, user: null });
  });

  it('returns an empty session for malformed json', () => {
    window.localStorage.setItem('shoplab.access_token', 'token-1');
    window.localStorage.setItem('shoplab.user', '{bad');
    expect(readSession()).toEqual({ token: null, user: null });
  });
});