import type { User } from "../types/authTypes"

const AUTH_KEY = import.meta.env.VITE_AUTH_KEY;


export interface StoredAuth {
  user: User
  token: string
}

// Save user and (token : access_token) to localStorage
export function saveAuth(user: User, token: string) {
 
  const data: StoredAuth = { user, token }
  localStorage.setItem(AUTH_KEY, JSON.stringify(data))
}

// Load auth from localStorage
export function loadAuth(): StoredAuth | null {
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

// Clear auth from localStorage
export function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
}

//get token from local storage
export function getAuthToken(): string | null {
  const auth = loadAuth()
  
  return auth?.token ?? null
}

//get user from local storage
export function getAuthUser(): User | null {
  const auth = loadAuth()
  return auth?.user ?? null
}
