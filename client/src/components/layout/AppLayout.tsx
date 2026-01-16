import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen transition-colors duration-500">
      <Navbar />
    <main className="min-h-screen flex-1 p-6 bg-gray-50 dark:bg-zinc-950 transition-colors">

        <Outlet />
      </main>
    </div>
  )
}
