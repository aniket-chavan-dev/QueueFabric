import { toggleTheme } from "@/features/theme/themeSlice"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"

export default function ThemeToggle() {
  const dispatch = useAppDispatch()
  const mode = useAppSelector((state) => state.theme.mode)

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="rounded-md border border-zinc-700 px-3 py-2 text-sm
                 hover:bg-zinc-200 hover:text-zinc-900
                 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    >
      {mode === "dark" ? "Switch to Light" : "Switch to Dark"}
    </button>
  )
}
