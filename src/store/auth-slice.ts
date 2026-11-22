import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { User } from "@/lib/types";

export interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  hydrated: false,
};

interface SessionPayload {
  token: string;
  user: User;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<SessionPayload>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.hydrated = true;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearSession(state) {
      state.token = null;
      state.user = null;
      state.hydrated = true;
    },
    markHydrated(state) {
      state.hydrated = true;
    },
  },
});

export const { setSession, setUser, clearSession, markHydrated } =
  authSlice.actions;

export default authSlice.reducer;
