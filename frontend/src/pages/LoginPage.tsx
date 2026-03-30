import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Wallet,
  Mail,
  Lock,
  User,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";

const inputClass =
  "w-full bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/50 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all";

const formVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: () => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
  exit: () => ({
    opacity: 0,
    x: -24,
    transition: { duration: 0.25 },
  }),
};

export default function LoginPage() {
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok =
      mode === "login"
        ? await login(form.email, form.password)
        : await register(form.email, form.password, form.name);
    if (ok) navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex">
      {/* Left panel – branding */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-slate-200 dark:border-slate-800 bg-linear-to-b from-blue-50 dark:from-blue-950/30 via-transparent to-transparent"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
        >
          <motion.div
            className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Wallet size={20} className="text-white" />
          </motion.div>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            MyBudget
          </span>
        </motion.div>

        {/* Hero */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.55 }}
        >
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
            Kiểm soát tài chính
            <br />
            <span className="text-blue-600 dark:text-blue-400">
              thông minh hơn
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-sm">
            Theo dõi thu chi, phân tích chi tiêu và đạt được mục tiêu tài chính
            của bạn.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            {[
              {
                icon: TrendingUp,
                label: "Thu nhập",
                value: "+$5,200",
                color: "text-green-600 dark:text-green-400",
                bg: "bg-green-500/15",
              },
              {
                icon: TrendingDown,
                label: "Chi tiêu",
                value: "-$3,150",
                color: "text-red-600 dark:text-red-400",
                bg: "bg-red-500/15",
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                className="bg-white dark:bg-[#1e293b] rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.45 + i * 0.1, duration: 0.4 }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 32px -8px rgba(0,0,0,0.12)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-7 h-7 rounded-lg ${card.bg} flex items-center justify-center`}
                  >
                    <card.icon size={14} className={card.color} />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {card.label}
                  </span>
                </div>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </p>
                <p className="text-xs text-slate-400 mt-1">Tháng này</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          className="text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          © 2026 MyBudget. All rights reserved.
        </motion.p>
      </motion.div>

      {/* Right panel – form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-8"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <motion.div
            className="flex items-center gap-3 mb-10 lg:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Wallet size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              MyBudget
            </span>
          </motion.div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode + "-heading"}
              className="mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.28 }}
            >
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                {mode === "login"
                  ? "Đăng nhập vào tài khoản của bạn"
                  : "Bắt đầu hành trình tài chính của bạn"}
              </p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              onSubmit={handleSubmit}
              className="space-y-5"
              custom={1}
              variants={formVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {mode === "register" && (
                <motion.div
                  className="space-y-1.5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Họ tên
                  </label>
                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      placeholder="Tên của bạn"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="email"
                    placeholder="ban@example.com"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="flex items-center gap-2.5 text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    <span>Thông tin đăng nhập không chính xác</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{
                  scale: loading ? 1 : 1.02,
                  boxShadow: "0 12px 24px -6px rgba(59,130,246,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mt-2"
              >
                {loading ? (
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  >
                    Đang xử lý…
                  </motion.span>
                ) : (
                  <>
                    {mode === "login" ? "Đăng nhập" : "Đăng ký"}
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <motion.p
            className="text-sm text-center text-slate-500 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {mode === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <motion.button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-500 dark:text-blue-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
            >
              {mode === "login" ? "Đăng ký ngay" : "Đăng nhập"}
            </motion.button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
