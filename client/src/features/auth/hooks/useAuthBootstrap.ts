import { useEffect } from "react"
import { useAppDispatch } from "@/hooks/redux"
import { loginSuccess } from "../slice/authSlice"
import { loadAuth } from "../utils/authStorage"

export function useAuthBootstrap() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const stored = loadAuth()
    if (stored) {
      dispatch(
        loginSuccess({
          user: stored.user,
          token: stored.token,
        })
      )
    }
  }, [dispatch])
}
