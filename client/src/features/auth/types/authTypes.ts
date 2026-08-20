export interface User {
  id: number;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "authenticated";
}

export interface AuthError {
  email?: string[];
  password?: string[];
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  msg: string;
  user: User;
}

export interface AuthPayload {
  user: User;
  token: string;
}
