import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type ThemeMode = "dark" | "light"

interface ThemeState {
  mode: ThemeMode
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem("theme")
  return saved === "light" || saved === "dark" ? saved : "dark"
}

const initialState: ThemeState = {
  mode: getInitialTheme(),
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "dark" ? "light" : "dark"
      localStorage.setItem("theme", state.mode)
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload
      localStorage.setItem("theme", action.payload)
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export default themeSlice.reducer
