import { useEffect } from "react"
import { useAppSelector } from "@/hooks/redux"

export function useThemeSync() {
  const mode = useAppSelector((state) => state.theme.mode)

  useEffect(() => {
    const html = document.documentElement

    if (mode === "dark") {
      html.classList.add("dark")
    } else {
      html.classList.remove("dark")
    }
  }, [mode])
}
