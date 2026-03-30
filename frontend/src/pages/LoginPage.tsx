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
  Sparkles,
  AlertCircle,
} from "lucide-react";

const inputClass =
  "w-full bg-zinc-900/60 border border-zinc-700/60 rounded-xl py-3.5 pl-11 pr-4 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-200";

const formVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.22 },
  },
};

const TAGLINES_LOGIN = [
  "Ví của bạn đang chờ 💰",
  "Chào mừng trở lại 👋",
  "Ready to glow up your finances? ✨",
];
const TAGLINES_REGISTER = [
  "Bước đầu tiên đến tự do tài chính 🚀",
  "Level up your money game 💎",
  "Bắt đầu hành trình của bạn ✨",
];

// Cycle tagline once per mount
const taglineIndex = Math.floor(Math.random() * 3);

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

  const tagline =
    mode === "login"
      ? TAGLINES_LOGIN[taglineIndex]
      : TAGLINES_REGISTER[taglineIndex];

  return (
    <div className="min-h-screen bg-[#09090b] flex overflow-hidden">
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      {/* ── Left panel — branding ─────────────────────────── */}
      <motion.div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14 border-r border-zinc-800/60 relative"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25"
            whileHover={{ scale: 1.1, rotate: 6 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Wallet size={20} className="text-white" />
          </motion.div>
          <span className="text-xl font-bold text-zinc-100 tracking-tight">
            MyBudget
          </span>
        </motion.div>

        {/* Hero copy */}
        <motion.div
          className="space-y-6 max-w-sm"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.55 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-xs font-medium">
            <Sparkles size={12} />
            Quản lý tài chính thông minh
          </div>

          <h2 className="text-4xl font-bold text-zinc-100 leading-tight">
            Kiểm soát tiền bạc,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              sống tự do hơn
            </span>
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed">
            Theo dõi thu chi hàng ngày, đặt ngân sách thông minh và nhận phân
            tích từ AI — tất cả trong một nơi.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              "📊 Biểu đồ trực quan",
              "🤖 AI phân tích",
              "💰 Ngân sách thông minh",
              "🔔 Cảnh báo vượt hạn",
            ].map((f) => (
              <span
                key={f}
                className="text-xs text-zinc-400 bg-zinc-800/60 border border-zinc-700/50 rounded-full px-3 py-1"
              >
                {f}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.p
          className="text-zinc-600 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          © 2026 MyBudget. All rights reserved.
        </motion.p>
      </motion.div>

      {/* ── Right panel — form ────────────────────────────── */}
      <motion.div
        className="flex-1 flex items-center justify-center p-8 relative"
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <motion.div
            className="flex items-center gap-3 mb-10 lg:hidden"
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.38 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Wallet size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-100">MyBudget</span>
          </motion.div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode + "-heading"}
              className="mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-sm text-blue-400 font-medium mb-2">{tagline}</p>
              <h1 className="text-3xl font-bold text-zinc-100 mb-1.5 tracking-tight">
                {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
              </h1>
              <p className="text-zinc-500 text-sm">
                {mode === "login"
                  ? "Nhập thông tin để tiếp tục hành trình tài chính"
                  : "Miễn phí, nhanh, không rắc rối — hứa đó 🤝"}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Form card */}
          <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-black/30">
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                onSubmit={handleSubmit}
                className="space-y-4"
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
                    transition={{ duration: 0.28 }}
                  >
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Họ tên
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
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
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
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
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
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
                      className="flex items-center gap-2.5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.22 }}
                    >
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={
                    loading
                      ? {}
                      : {
                          scale: 1.02,
                          boxShadow: "0 0 28px -4px rgba(59,130,246,0.5)",
                        }
                  }
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 mt-1"
                >
                  {loading ? (
                    <motion.span
                      animate={{ opacity: [1, 0.45, 1] }}
                      transition={{ repeat: Infinity, duration: 1.1 }}
                    >
                      Đang xử lý…
                    </motion.span>
                  ) : (
                    <>
                      {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.6,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight size={17} />
                      </motion.span>
                    </>
                  )}
                </motion.button>
              </motion.form>
            </AnimatePresence>
          </div>

          {/* Switch mode */}
          <motion.p
            className="text-sm text-center text-zinc-500 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            {mode === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <motion.button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
            >
              {mode === "login" ? "Đăng ký ngay" : "Đăng nhập"}
            </motion.button>
          </motion.p>

          {/* New-here hint */}
          <AnimatePresence>
            {mode === "register" && (
              <motion.div
                className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500 bg-zinc-800/40 border border-zinc-700/40 rounded-xl px-4 py-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.28 }}
              >
                <Sparkles size={13} className="text-blue-400 shrink-0" />
                <span>
                  Lần đầu dùng? Chúng tôi sẽ hướng dẫn bạn qua vài bước nhanh
                  ✨
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
