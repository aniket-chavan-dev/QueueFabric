import { Link, NavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { toggleTheme } from "@/features/theme/themeSlice";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { logout } from "@/features/auth/slice/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const mode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const auth = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav
      className="sticky top-0 z-50 bg-white dark:bg-zinc-950
                    border-b border-gray-200 dark:border-zinc-800"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl
                          bg-linear-to-br from-indigo-500 to-purple-600
                          flex items-center justify-center
                          text-white font-bold"
          >
            Q
          </div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
            <span className="text-gray-900 dark:text-zinc-100">Queue</span>
            <span className="text-indigo-500">Fabric</span>
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          {auth.status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-zinc-300">
                {auth.user?.email}
              </span>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <NavLink to="/login">
                <span className="text-gray-600 dark:text-zinc-300">Login</span>
              </NavLink>
              <NavLink to="/register">
                <span className="text-gray-600 dark:text-zinc-300">
                  Register
                </span>
              </NavLink>
            </div>
          )}

          <motion.button
            onClick={() => dispatch(toggleTheme())}
            whileTap={{ scale: 0.95 }}
            className="relative w-14 h-7 rounded-full p-1
                       bg-gray-300 dark:bg-zinc-700 flex items-center"
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 600, damping: 30 }}
              animate={{ x: mode === "dark" ? 28 : 0 }}
              className="w-5 h-5 rounded-full
                         bg-white dark:bg-zinc-900
                         shadow-md flex items-center justify-center"
            >
              {mode === "dark" ? (
                <Moon size={12} className="text-indigo-400" />
              ) : (
                <Sun size={12} className="text-yellow-500" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
