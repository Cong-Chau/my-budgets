import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { User, Mail, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

const inputClass =
  "w-full bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all";

const labelClass = "text-sm font-medium text-slate-700 dark:text-slate-300";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState("");

  const [showPassForm, setShowPassForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [showPass, setShowPass] = useState({ current: false, newPass: false, confirm: false });
  const [passError, setPassError] = useState("");
  const [passSaved, setPassSaved] = useState(false);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");
    const ok = await updateProfile(name);
    if (ok) {
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2500);
    } else {
      setNameError("Không thể lưu thay đổi. Vui lòng thử lại.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    if (passwords.newPass.length < 6) {
      setPassError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPassError("Mật khẩu xác nhận không khớp.");
      return;
    }
    const result = await changePassword(passwords.current, passwords.newPass);
    if (result.ok) {
      setPassSaved(true);
      setPasswords({ current: "", newPass: "", confirm: "" });
      setTimeout(() => {
        setPassSaved(false);
        setShowPassForm(false);
      }, 2500);
    } else {
      setPassError(result.message);
    }
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "Người dùng";
  const avatarLetter = displayName[0].toUpperCase();

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="max-w-2xl flex flex-col gap-6">
        {/* Header */}
        <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="show">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Hồ sơ
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Quản lý thông tin tài khoản của bạn.
          </p>
        </motion.div>

        {/* Profile card */}
        <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="show">
          <Card>
            {/* Avatar + info */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-700/40">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/20 shrink-0"
                whileHover={{ scale: 1.08, rotate: 4 }}
                transition={{ type: "spring", stiffness: 350, damping: 15 }}
              >
                {avatarLetter}
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {displayName}
                </h3>
                <p className="text-sm text-slate-400">{user?.email || "—"}</p>
              </div>
            </div>

            <form onSubmit={handleSaveName} className="space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className={labelClass}>Họ tên</label>
                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tên của bạn"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email (read-only) */}
              <div className="space-y-1.5">
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className={`${inputClass} opacity-60 cursor-not-allowed pr-4`}
                  />
                </div>
                <p className="text-xs text-slate-400">Email không thể thay đổi.</p>
              </div>

              <AnimatePresence>
                {nameError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2.5 text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                  >
                    <AlertCircle size={15} className="shrink-0" />
                    {nameError}
                  </motion.div>
                )}
                {nameSaved && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-2.5 text-sm text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3"
                  >
                    <CheckCircle size={15} className="shrink-0" />
                    Đã lưu thay đổi!
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03, boxShadow: "0 8px 20px -4px rgba(59,130,246,0.4)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-md shadow-blue-500/20"
              >
                <Save size={16} />
                Lưu thay đổi
              </motion.button>
            </form>
          </Card>
        </motion.div>

        {/* Change password card */}
        <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="show">
          <Card>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Đổi mật khẩu
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Cập nhật mật khẩu để bảo vệ tài khoản.
                </p>
              </div>
              <motion.button
                onClick={() => {
                  setShowPassForm(!showPassForm);
                  setPassError("");
                  setPassSaved(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                {showPassForm ? "Hủy" : "Thay đổi"}
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {!showPassForm ? (
                <motion.div
                  key="locked"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 mt-4 py-3 px-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700/30"
                >
                  <Lock size={16} className="text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Mật khẩu đang được bảo mật
                  </span>
                </motion.div>
              ) : (
                <motion.form
                  key="passform"
                  onSubmit={handleChangePassword}
                  className="space-y-4 mt-5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Current password */}
                  <div className="space-y-1.5">
                    <label className={labelClass}>Mật khẩu hiện tại</label>
                    <div className="relative">
                      <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type={showPass.current ? "text" : "password"}
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        required
                        placeholder="••••••••"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => ({ ...s, current: !s.current }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPass.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New password */}
                  <div className="space-y-1.5">
                    <label className={labelClass}>Mật khẩu mới</label>
                    <div className="relative">
                      <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type={showPass.newPass ? "text" : "password"}
                        value={passwords.newPass}
                        onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                        required
                        minLength={6}
                        placeholder="Tối thiểu 6 ký tự"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => ({ ...s, newPass: !s.newPass }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPass.newPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-1.5">
                    <label className={labelClass}>Xác nhận mật khẩu mới</label>
                    <div className="relative">
                      <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type={showPass.confirm ? "text" : "password"}
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        required
                        placeholder="Nhập lại mật khẩu mới"
                        className={`${inputClass} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => ({ ...s, confirm: !s.confirm }))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {showPass.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {passError && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-2.5 text-sm text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                      >
                        <AlertCircle size={15} className="shrink-0" />
                        {passError}
                      </motion.div>
                    )}
                    {passSaved && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-2.5 text-sm text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3"
                      >
                        <CheckCircle size={15} className="shrink-0" />
                        Đổi mật khẩu thành công!
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 20px -4px rgba(59,130,246,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-md shadow-blue-500/20"
                  >
                    <Save size={16} />
                    Cập nhật mật khẩu
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
