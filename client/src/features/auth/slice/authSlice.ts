import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type LoginResponse } from "../types/authTypes";
import { saveAuth, clearAuth, loadAuth } from "../utils/authStorage";
import { type StoredAuth } from "../utils/authStorage";

interface User {
  id: number;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "authenticated" | "error";
}

const storedAuth: StoredAuth | null = loadAuth();

const initialState: AuthState = storedAuth
  ? {
      user: storedAuth.user,
      token: storedAuth.token,
      status: "authenticated",
    }
  : {
      user: null,
      token: null,
      status: "idle",
    };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.status = "loading";
    },
    loginSuccess(state, action: PayloadAction<LoginResponse>) {
      state.user = action.payload.user;

      if (!action.payload.access_token) {
        return;
      }

      state.token = action.payload.access_token;
      state.status = "authenticated";
      //call function to store user and token to local storage
      saveAuth(action.payload.user, action.payload.access_token);
    },
    loginFailure(state) {
      state.status = "error";
      state.user = null;
      state.token = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = "idle";
      //remove token from local storage
      clearAuth();
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;

export default authSlice.reducer;
