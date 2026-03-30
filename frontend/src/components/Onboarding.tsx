import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  ArrowLeftRight,
  PiggyBank,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { onboardingApi } from "../api/onboardingApi";
import { useAuth } from "../context/AuthContext";
import type { CategoryType } from "../types";

// ── Suggested categories ─────────────────────────────────────────
interface SuggestedCategory {
  name: string;
  type: CategoryType;
  emoji: string;
}

const SUGGESTED: SuggestedCategory[] = [
  // Thu nhập
  { name: "Lương", type: "INCOME", emoji: "💼" },
  { name: "Freelance", type: "INCOME", emoji: "💻" },
  { name: "Đầu tư", type: "INCOME", emoji: "📈" },
  { name: "Thưởng", type: "INCOME", emoji: "🎁" },
  { name: "Cho thuê", type: "INCOME", emoji: "🏠" },
  { name: "Kinh doanh", type: "INCOME", emoji: "🏪" },
  // Chi tiêu
  { name: "Thực phẩm", type: "EXPENSE", emoji: "🛒" },
  { name: "Ăn ngoài", type: "EXPENSE", emoji: "🍜" },
  { name: "Di chuyển", type: "EXPENSE", emoji: "🚗" },
  { name: "Nhà ở", type: "EXPENSE", emoji: "🏡" },
  { name: "Điện nước", type: "EXPENSE", emoji: "💡" },
  { name: "Sức khỏe", type: "EXPENSE", emoji: "💊" },
  { name: "Giải trí", type: "EXPENSE", emoji: "🎮" },
  { name: "Mua sắm", type: "EXPENSE", emoji: "🛍️" },
  { name: "Giáo dục", type: "EXPENSE", emoji: "📚" },
  { name: "Du lịch", type: "EXPENSE", emoji: "✈️" },
];

// ── Slide content ────────────────────────────────────────────────
const FEATURES = [
  {
    icon: ArrowLeftRight,
    color: "bg-blue-500",
    label: "Giao dịch",
    desc: "Ghi lại thu chi hàng ngày dễ dàng",
  },
  {
    icon: PiggyBank,
    color: "bg-violet-500",
    label: "Ngân sách",
    desc: "Đặt giới hạn chi tiêu cho từng danh mục",
  },
  {
    icon: MessageCircle,
    color: "bg-emerald-500",
    label: "AI Assistant",
    desc: "Phân tích tài chính thông minh với Gemini",
  },
  {
    icon: TrendingUp,
    color: "bg-amber-500",
    label: "Báo cáo",
    desc: "Theo dõi dòng tiền qua biểu đồ trực quan",
  },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

interface Props {
  onDone: () => void;
}

export function Onboarding({ onDone }: Props) {
  const { completeOnboarding } = useAuth();
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const TOTAL = 4;

  const go = (next: number) => {
    setDir(next > slide ? 1 : -1);
    setSlide(next);
  };

  const toggle = (name: string) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(name)) {
        n.delete(name);
      } else {
        n.add(name);
      }
      return n;
    });
  };

  const finish = async () => {
    setSaving(true);
    try {
      if (selected.size > 0) {
        const cats = SUGGESTED.filter((c) => selected.has(c.name)).map(
          ({ name, type }) => ({ name, type }),
        );
        await onboardingApi.createCategories(cats);
      }
      await completeOnboarding();
      onDone();
    } finally {
      setSaving(false);
    }
  };

  const skip = async () => {
    await completeOnboarding();
    onDone();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1 bg-slate-100 dark:bg-slate-800">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            animate={{ width: `${((slide + 1) / TOTAL) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Slide area */}
        <div className="relative overflow-hidden" style={{ minHeight: 400 }}>
          <AnimatePresence custom={dir} mode="wait">
            <motion.div
              key={slide}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col items-center justify-start p-8 pt-10"
            >
              {/* ── Slide 0: Welcome ── */}
              {slide === 0 && (
                <div className="flex flex-col items-center text-center gap-5">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut",
                    }}
                  >
                    <Wallet size={38} className="text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Chào mừng đến với MyBudget
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                      Công cụ quản lý tài chính cá nhân thông minh giúp bạn kiểm
                      soát thu chi, lập ngân sách và đạt được mục tiêu tài
                      chính.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 w-full mt-2">
                    {["Theo dõi thu chi", "Lập ngân sách", "AI phân tích"].map(
                      (t) => (
                        <div
                          key={t}
                          className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-xs font-medium text-blue-700 dark:text-blue-300 text-center"
                        >
                          {t}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* ── Slide 1: Features ── */}
              {slide === 1 && (
                <div className="w-full flex flex-col gap-5">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Tất cả trong một nơi
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      MyBudget mang đến đầy đủ công cụ bạn cần
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {FEATURES.map(({ icon: Icon, color, label, desc }) => (
                      <div
                        key={label}
                        className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex flex-col gap-2"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}
                        >
                          <Icon size={18} className="text-white" />
                        </div>
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                          {label}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Slide 2: Categories ── */}
              {slide === 2 && (
                <div className="w-full flex flex-col gap-4">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Chọn danh mục của bạn
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Chọn các danh mục phù hợp — bạn có thể thêm hoặc xóa sau
                    </p>
                  </div>

                  {(["INCOME", "EXPENSE"] as CategoryType[]).map((type) => (
                    <div key={type}>
                      <p
                        className={`text-xs font-semibold mb-2 ${type === "INCOME" ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {type === "INCOME" ? "💰 Thu nhập" : "💸 Chi tiêu"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTED.filter((c) => c.type === type).map((c) => {
                          const active = selected.has(c.name);
                          return (
                            <motion.button
                              key={c.name}
                              whileTap={{ scale: 0.93 }}
                              onClick={() => toggle(c.name)}
                              className={`cursor-pointer hover:scale-103 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                                active
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                              }`}
                            >
                              <span>{c.emoji}</span>
                              <span>{c.name}</span>
                              {active && <Check size={12} />}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {selected.size > 0 && (
                    <p className="text-xs text-center text-blue-600 dark:text-blue-400 font-medium">
                      Đã chọn {selected.size} danh mục
                    </p>
                  )}
                </div>
              )}

              {/* ── Slide 3: Done ── */}
              {slide === 3 && (
                <div className="flex flex-col items-center text-center gap-5 pt-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                  >
                    <Check size={38} className="text-white" strokeWidth={3} />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Bạn đã sẵn sàng!
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                      {selected.size > 0
                        ? `${selected.size} danh mục đã được tạo. Bắt đầu ghi lại giao dịch đầu tiên của bạn ngay nhé!`
                        : "Hãy bắt đầu bằng cách tạo danh mục và ghi lại giao dịch đầu tiên của bạn!"}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="p-6 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={skip}
            className="
              group cursor-pointer
              px-3 py-1.5
              rounded-xl
              text-sm font-medium
              text-slate-400
              flex items-center gap-1.5
              transition-all duration-200 ease-in-out
              hover:bg-red-100 hover:text-red-500
              dark:hover:bg-red-900/40 dark:hover:text-red-400
              active:scale-95
            "
          >
            <X size={14} /> Bỏ qua
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`rounded-full transition-all ${i === slide ? "w-5 h-2 bg-blue-500" : "w-2 h-2 bg-slate-200 dark:bg-slate-700"}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {slide > 0 && (
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => go(slide - 1)}
                className="
                  cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                  text-slate-700 dark:text-slate-300
                  border border-slate-200 dark:border-slate-700
                  hover:bg-slate-100 dark:hover:bg-slate-800
                  transition-all duration-200
                "
              >
                <ArrowLeft size={15} />
              </motion.button>
            )}
            {slide < TOTAL - 1 ? (
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => go(slide + 1)}
                className="
                  group cursor-pointer
                  flex items-center gap-2
                  px-4 py-2
                  rounded-xl
                  text-sm font-medium
                  bg-linear-to-r from-blue-600 to-indigo-600
                  text-white
                  shadow-md
                  hover:bg-linear-to-r hover:from-blue-700 hover:to-indigo-700
                  transition-all duration-200 ease-in-out
                "
              >
                Tiếp <ArrowRight size={15} />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={finish}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-60"
              >
                {saving ? "Đang lưu..." : "Bắt đầu"}{" "}
                {!saving && <Check size={15} />}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
