import { RouterProvider } from "react-router-dom"
import { router } from "./app/router"
import { useThemeSync } from "@/features/theme/useThemeSync"
import { useAuthBootstrap } from "@/features/auth/hooks/useAuthBootstrap"

export default function App() {
  useThemeSync() 
  useAuthBootstrap()

  return <RouterProvider router={router} />
}
