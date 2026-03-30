import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  User,
  Wallet,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const menuItems = [
  { name: "Tổng quan", path: "/", icon: LayoutDashboard, end: true },
  {
    name: "Giao dịch",
    path: "/transactions",
    icon: ArrowLeftRight,
    end: false,
  },
  { name: "Danh mục", path: "/categories", icon: Tags, end: false },
  { name: "Hồ sơ", path: "/profile", icon: User, end: false },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Người dùng";
  const avatarLetter = displayName[0].toUpperCase();

  return (
    <motion.aside
      className="w-64 bg-white dark:bg-[#1e293b] border-r border-slate-200 dark:border-slate-700/30 flex flex-col h-screen fixed"
      initial={{ x: -64, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Logo + theme toggle */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-700/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Wallet size={18} className="text-white" />
          </motion.div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            MyBudget
          </h1>
        </div>
        <motion.button
          onClick={toggleTheme}
          title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
          whileHover={{ scale: 1.15, rotate: 20 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 350, damping: 15 }}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
              transition={{ duration: 0.22 }}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {menuItems.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.07, duration: 0.35 }}
          >
            <NavLink
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/40 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <item.icon size={19} />
                  </motion.span>
                  {item.name}
                  {isActive && (
                    <motion.span
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"
                      layoutId="nav-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 28,
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700/30 space-y-2">
        <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
          <NavLink
            to="/profile"
            className="flex items-center gap-3 px-3 py-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-900/80 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {avatarLetter}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                {displayName}
              </span>
              <span className="text-xs text-slate-400 truncate">
                {user?.email || ""}
              </span>
            </div>
          </NavLink>
        </motion.div>

        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 2, backgroundColor: "rgba(239,68,68,0.08)" }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-transparent hover:border-red-200 dark:hover:border-red-500/20 transition-colors duration-200"
        >
          <LogOut size={17} />
          Đăng xuất
        </motion.button>
      </div>
    </motion.aside>
  );
}
