import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  PiggyBank,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  X,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useCategories } from "../context/CategoryContext";
import { useBudgets } from "../context/BudgetContext";
import type { Category, CategoryType, BudgetPeriod } from "../types";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";

interface CatFormState {
  name: string;
  type: CategoryType;
}
interface BudgetFormState {
  amount: string;
  period: BudgetPeriod;
}

const SUGGESTIONS: Record<CategoryType, { name: string; emoji: string }[]> = {
  INCOME: [
    { name: "Lương", emoji: "💼" },
    { name: "Freelance", emoji: "💻" },
    { name: "Đầu tư", emoji: "📈" },
    { name: "Thưởng", emoji: "🎁" },
    { name: "Cho thuê", emoji: "🏠" },
    { name: "Kinh doanh", emoji: "🏪" },
    { name: "Lãi ngân hàng", emoji: "🏦" },
    { name: "Quà tặng", emoji: "🎀" },
  ],
  EXPENSE: [
    { name: "Thực phẩm", emoji: "🛒" },
    { name: "Ăn ngoài", emoji: "🍜" },
    { name: "Di chuyển", emoji: "🚗" },
    { name: "Nhà ở", emoji: "🏡" },
    { name: "Điện nước", emoji: "💡" },
    { name: "Sức khỏe", emoji: "💊" },
    { name: "Giải trí", emoji: "🎮" },
    { name: "Mua sắm", emoji: "🛍️" },
    { name: "Giáo dục", emoji: "📚" },
    { name: "Du lịch", emoji: "✈️" },
    { name: "Cà phê", emoji: "☕" },
    { name: "Hóa đơn", emoji: "📄" },
  ],
};

const STATUS_CONFIG = {
  safe: {
    label: "An toàn",
    color: "text-emerald-600",
    bar: "bg-emerald-500",
    icon: ShieldCheck,
  },
  warning: {
    label: "Gần giới hạn",
    color: "text-amber-600",
    bar: "bg-amber-500",
    icon: AlertTriangle,
  },
  exceeded: {
    label: "Vượt ngân sách",
    color: "text-red-600",
    bar: "bg-red-500",
    icon: XCircle,
  },
};

const PERIOD_LABELS: Record<BudgetPeriod, string> = {
  MONTHLY: "Tháng",
  WEEKLY: "Tuần",
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.05 },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
};

// ── Category card ────────────────────────────────────────────────
function CategoryCard({
  category,
  index,
  onEdit,
  onDelete,
  onBudget,
}: {
  category: Category;
  index: number;
  onEdit: (c: Category) => void;
  onDelete: (id: number) => void;
  onBudget: (c: Category) => void;
}) {
  const budget = category.budget;
  const cfg = budget ? STATUS_CONFIG[budget.status] : null;
  const StatusIcon = cfg?.icon;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      layout
      whileHover={{ y: -2, boxShadow: "0 8px 24px -6px rgba(0,0,0,0.12)" }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex flex-col gap-3"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <p className="font-medium text-gray-800 dark:text-white truncate flex-1 mr-2">
          {category.name}
        </p>
        <div className="flex gap-1 shrink-0">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => onEdit(category)}
            className="p-1.5 text-gray-400 hover:text-indigo-500 rounded-lg transition-colors"
          >
            <Pencil size={13} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => onDelete(category.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
          >
            <Trash2 size={13} />
          </motion.button>
        </div>
      </div>

      {/* Budget section — chỉ cho EXPENSE */}
      {category.type === "EXPENSE" && (
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
          {budget && cfg && StatusIcon ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${cfg.color}`}
                >
                  <StatusIcon size={11} />
                  {cfg.label}
                </div>
                <span className="text-xs text-gray-400">
                  {PERIOD_LABELS[budget.period]}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${cfg.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  transition={{ duration: 0.55 }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{budget.totalSpent.toLocaleString("vi-VN")} ₫</span>
                <span>
                  {budget.percentage}% / {budget.amount.toLocaleString("vi-VN")}{" "}
                  ₫
                </span>
              </div>
              <button
                onClick={() => onBudget(category)}
                className="w-full text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 text-center pt-0.5 transition-colors"
              >
                Sửa ngân sách
              </button>
            </div>
          ) : (
            <button
              onClick={() => onBudget(category)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-gray-400 hover:text-indigo-500 border border-dashed border-gray-200 dark:border-gray-600 hover:border-indigo-300 rounded-lg transition-colors"
            >
              <PiggyBank size={12} /> Đặt ngân sách
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Column ───────────────────────────────────────────────────────
function CategoryColumn({
  type,
  items,
  onAdd,
  onEdit,
  onDelete,
  onBudget,
}: {
  type: CategoryType;
  items: Category[];
  onAdd: (type: CategoryType) => void;
  onEdit: (c: Category) => void;
  onDelete: (id: number) => void;
  onBudget: (c: Category) => void;
}) {
  const isIncome = type === "INCOME";
  return (
    <div className="flex flex-col gap-3">
      {/* Column header */}
      <div className={`flex items-center justify-between px-1`}>
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${isIncome ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
          >
            {isIncome ? (
              <TrendingUp
                size={14}
                className="text-emerald-600 dark:text-emerald-400"
              />
            ) : (
              <TrendingDown
                size={14}
                className="text-red-600 dark:text-red-400"
              />
            )}
          </div>
          <span
            className={`font-semibold text-sm ${isIncome ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {isIncome ? "Thu nhập" : "Chi tiêu"}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
            {items.length}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => onAdd(type)}
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
            isIncome
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
              : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100"
          }`}
        >
          <Plus size={13} /> Thêm
        </motion.button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-sm text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl"
            >
              Chưa có danh mục
            </motion.div>
          ) : (
            items.map((c, i) => (
              <CategoryCard
                key={c.id}
                category={c}
                index={i}
                onEdit={onEdit}
                onDelete={onDelete}
                onBudget={onBudget}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const {
    items,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();
  const { createBudget, updateBudget, deleteBudget } = useBudgets();

  const [catModal, setCatModal] = useState<
    null | { mode: "create"; type: CategoryType } | Category
  >(null);
  const [catForm, setCatForm] = useState<CatFormState>({
    name: "",
    type: "EXPENSE",
  });
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  const [budgetModal, setBudgetModal] = useState<Category | null>(null);
  const [budgetForm, setBudgetForm] = useState<BudgetFormState>({
    amount: "",
    period: "MONTHLY",
  });
  const [budgetSaving, setBudgetSaving] = useState(false);
  const [budgetError, setBudgetError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const income = items.filter((c) => c.type === "INCOME");
  const expense = items.filter((c) => c.type === "EXPENSE");

  // ── Category CRUD ──────────────────────────────────────────────
  const openCreate = (type: CategoryType) => {
    setCatForm({ name: "", type });
    setSelectedSuggestions(new Set());
    setCatModal({ mode: "create", type });
  };
  const openEdit = (c: Category) => {
    setCatForm({ name: c.name, type: c.type });
    setCatModal(c);
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (catModal && "mode" in catModal) {
      const type = catForm.type;
      const toCreate: string[] = [];
      if (catForm.name.trim()) toCreate.push(catForm.name.trim());
      selectedSuggestions.forEach((name) => {
        if (name !== catForm.name.trim()) toCreate.push(name);
      });
      if (toCreate.length === 0) return;
      await Promise.all(toCreate.map((name) => createCategory({ name, type })));
    } else if (catModal) {
      await updateCategory((catModal as Category).id, catForm);
    }
    setCatModal(null);
    fetchCategories();
  };

  const toggleSuggestion = (name: string) => {
    setSelectedSuggestions((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
      await deleteCategory(id);
      fetchCategories();
    }
  };

  // ── Budget CRUD ────────────────────────────────────────────────
  const openBudget = (c: Category) => {
    setBudgetError("");
    setBudgetForm({
      amount: c.budget ? String(c.budget.amount) : "",
      period: c.budget?.period ?? "MONTHLY",
    });
    setBudgetModal(c);
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetModal) return;
    setBudgetSaving(true);
    setBudgetError("");
    try {
      const data = {
        categoryId: budgetModal.id,
        amount: Number(budgetForm.amount),
        period: budgetForm.period,
      };
      if (budgetModal.budget)
        await updateBudget(budgetModal.budget.id, {
          amount: data.amount,
          period: data.period,
        });
      else await createBudget(data);
      setBudgetModal(null);
      fetchCategories();
    } catch (err: unknown) {
      const message =
        err instanceof Error &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setBudgetError(message || "Có lỗi xảy ra");
    } finally {
      setBudgetSaving(false);
    }
  };

  const handleBudgetDelete = async () => {
    if (!budgetModal?.budget || !confirm("Xóa ngân sách?")) return;
    await deleteBudget(budgetModal.budget.id);
    setBudgetModal(null);
    fetchCategories();
  };

  const isEditing = catModal && !("mode" in catModal);
  const modalType =
    catModal && "mode" in catModal
      ? catModal.type
      : ((catModal as Category | null)?.type ?? "EXPENSE");

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Danh mục
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Quản lý danh mục thu nhập và chi tiêu
        </p>
      </div>

      {/* Two-column layout */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.1 }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryColumn
            type="INCOME"
            items={income}
            onAdd={openCreate}
            onEdit={openEdit}
            onDelete={handleDelete}
            onBudget={openBudget}
          />
          <div className="hidden md:block w-px bg-gray-200 dark:bg-gray-700 self-stretch absolute left-1/2" />
          <CategoryColumn
            type="EXPENSE"
            items={expense}
            onAdd={openCreate}
            onEdit={openEdit}
            onDelete={handleDelete}
            onBudget={openBudget}
          />
        </div>
      )}

      {/* Category Modal */}
      <AnimatePresence>
        {catModal !== null && (
          <Modal
            title={
              isEditing
                ? "Chỉnh sửa danh mục"
                : `Thêm danh mục ${modalType === "INCOME" ? "thu nhập" : "chi tiêu"}`
            }
            onClose={() => setCatModal(null)}
          >
            <form onSubmit={handleCatSubmit} className="space-y-4">
              {/* Suggestion chips — create mode only */}
              {!isEditing && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Chọn nhanh hoặc nhập tên bên dưới
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS[modalType].map(({ name, emoji }) => {
                      const active = selectedSuggestions.has(name);
                      return (
                        <motion.button
                          key={name}
                          type="button"
                          whileTap={{ scale: 0.92 }}
                          onClick={() => toggleSuggestion(name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                            active
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400"
                          }`}
                        >
                          <span>{emoji}</span>
                          <span>{name}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                  {selectedSuggestions.size > 0 && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-2">
                      Đã chọn {selectedSuggestions.size} danh mục
                    </p>
                  )}
                </div>
              )}

              <Input
                label={isEditing ? "Tên" : "Hoặc nhập tên tùy chỉnh"}
                required={!isEditing && selectedSuggestions.size === 0}
                value={catForm.name}
                onChange={(e) =>
                  setCatForm({ ...catForm, name: e.target.value })
                }
                placeholder={isEditing ? "" : "Nhập tên danh mục..."}
              />
              {isEditing && (
                <Select
                  label="Loại"
                  value={catForm.type}
                  onChange={(e) =>
                    setCatForm({
                      ...catForm,
                      type: e.target.value as CategoryType,
                    })
                  }
                >
                  <option value="INCOME">Thu nhập</option>
                  <option value="EXPENSE">Chi tiêu</option>
                </Select>
              )}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setCatModal(null)}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {!isEditing && selectedSuggestions.size > 0
                    ? `Tạo ${selectedSuggestions.size + (catForm.name.trim() ? 1 : 0)} danh mục`
                    : "Lưu"}
                </Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Budget Modal */}
      <AnimatePresence>
        {budgetModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setBudgetModal(null)}
            />
            <motion.div
              className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6 border border-slate-200 dark:border-slate-700/40"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {budgetModal.budget ? "Sửa ngân sách" : "Đặt ngân sách"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {budgetModal.name}
                  </p>
                </div>
                <button
                  onClick={() => setBudgetModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <X size={17} />
                </button>
              </div>

              <form onSubmit={handleBudgetSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Số tiền giới hạn (₫)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={budgetForm.amount}
                    onChange={(e) =>
                      setBudgetForm((f) => ({ ...f, amount: e.target.value }))
                    }
                    placeholder="0"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Chu kỳ
                  </label>
                  <div className="flex gap-3">
                    {(["MONTHLY", "WEEKLY"] as BudgetPeriod[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() =>
                          setBudgetForm((f) => ({ ...f, period: p }))
                        }
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          budgetForm.period === p
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400"
                        }`}
                      >
                        {PERIOD_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </div>

                {budgetError && (
                  <p className="text-sm text-red-500">{budgetError}</p>
                )}

                <div className="flex gap-2 pt-1">
                  {budgetModal.budget && (
                    <button
                      type="button"
                      onClick={handleBudgetDelete}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800/30 transition-colors"
                    >
                      Xóa
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setBudgetModal(null)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={budgetSaving}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-60"
                  >
                    {budgetSaving ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
