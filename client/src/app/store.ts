import { configureStore } from "@reduxjs/toolkit"
import themeReducer from "@/features/theme/themeSlice"
import authReducer from "@/features/auth/slice/authSlice"
import jobsReducer from "@/features/jobs/slice/jobsSlice"


export const store = configureStore({
  reducer: {
     theme: themeReducer,
     auth: authReducer,
      jobs: jobsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
