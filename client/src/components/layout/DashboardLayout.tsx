import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
