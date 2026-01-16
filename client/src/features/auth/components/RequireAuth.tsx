import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "@/hooks/redux"

export default function RequireAuth() {
  const { status, token } = useAppSelector((state) => state.auth)
  const location = useLocation()

  
  

  const isAuthenticated = status === "authenticated" && !!token

 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
