import { type ReactNode } from "react"

interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div
      className="
        w-full max-w-md
        rounded-2xl p-6 sm:p-8
        bg-white dark:bg-zinc-900
        border border-gray-200 dark:border-zinc-800
        shadow-lg
      "
    >
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
          {subtitle}
        </p>
      )}

      <div className="mt-6">{children}</div>
    </div>
  )
}
