import { useEffect, useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { motion, type Variants } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp, TrendingDown, Wallet, Sparkles,
  PiggyBank, AlertTriangle, type LucideIcon,
} from 'lucide-react';

const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Chào buổi sáng';
  if (h < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

function fmtVND(v: number) {
  return v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

function StatCard({
  label, value, icon: Icon, color,
}: { label: string; value: number; icon: LucideIcon; color: string }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.18)' }}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 cursor-default"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <motion.span
          className={`p-2 rounded-lg ${color}`}
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Icon size={18} className="text-white" />
        </motion.span>
      </div>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">
        {fmtVND(value)}
      </p>
    </motion.div>
  );
}

function InsightCard({
  icon: Icon, iconBg, label, value, sub, highlight,
}: {
  icon: LucideIcon;
  iconBg: string;
  label: string;
  value: string;
  sub?: string;
  highlight?: 'green' | 'red' | 'amber';
}) {
  const highlightClass =
    highlight === 'green'
      ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
      : highlight === 'red'
      ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
      : highlight === 'amber'
      ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20'
      : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800';

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3, boxShadow: '0 12px 28px -8px rgba(0,0,0,0.14)' }}
      className={`rounded-xl p-4 border shadow-sm cursor-default ${highlightClass}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${iconBg} flex-shrink-0`}>
          <Icon size={16} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
          <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight truncate">
            {value}
          </p>
          {sub && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data, loading, fetchDashboard } = useDashboard();
  const { user } = useAuth();

  useEffect(() => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - 29);
    fetchDashboard({
      dateFrom: from.toISOString().slice(0, 10),
      dateTo: today.toISOString().slice(0, 10),
    });
  }, [fetchDashboard]);

  const insights = useMemo(() => {
    if (!data) return null;

    const topCategory = data.expenseByCategory.length
      ? data.expenseByCategory.reduce((a, b) => (a.value > b.value ? a : b))
      : null;

    const savingsRate =
      data.totalIncome > 0
        ? Math.round(((data.totalIncome - data.totalExpense) / data.totalIncome) * 100)
        : null;

    return { topCategory, savingsRate };
  }, [data]);

  const greeting = getGreeting();
  const displayName = user?.name || user?.email?.split('@')[0] || 'bạn';

  if (loading)
    return (
      <div className="p-8 flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
          />
        ))}
      </div>
    );

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ── Hero section ──────────────────────────────────── */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-6 md:p-8 text-white shadow-lg"
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-indigo-400/20 blur-2xl" />

        <div className="relative">
          <p className="text-blue-200 text-sm font-medium mb-1">{greeting} 👋</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 capitalize">{displayName}!</h1>
          <p className="text-blue-100 text-sm md:text-base max-w-md leading-relaxed">
            Quản lý tài chính thông minh giúp bạn tự do hơn mỗi ngày. Hãy xem những gì đang xảy ra trong 30 ngày qua.
          </p>

          {data && (
            <div className="mt-5 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-medium">
              <Sparkles size={15} className="text-yellow-300" />
              {data.balance >= 0
                ? `Số dư hiện tại: ${fmtVND(data.balance)} — tốt lắm!`
                : `Số dư âm ${fmtVND(Math.abs(data.balance))} — hãy cẩn thận chi tiêu nhé.`}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Insight cards ────────────────────────────────── */}
      {data && (
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          variants={containerVariants}
        >
          <InsightCard
            icon={TrendingDown}
            iconBg="bg-red-500"
            label="Chi tiêu tháng này"
            value={fmtVND(data.totalExpense)}
            sub="30 ngày gần nhất"
            highlight={data.totalExpense > data.totalIncome ? 'red' : undefined}
          />
          <InsightCard
            icon={TrendingUp}
            iconBg="bg-emerald-500"
            label="Thu nhập tháng này"
            value={fmtVND(data.totalIncome)}
            sub="30 ngày gần nhất"
            highlight="green"
          />
          <InsightCard
            icon={PiggyBank}
            iconBg={
              insights?.savingsRate == null
                ? 'bg-slate-400'
                : insights.savingsRate >= 20
                ? 'bg-emerald-500'
                : insights.savingsRate >= 0
                ? 'bg-amber-500'
                : 'bg-red-500'
            }
            label="Tỉ lệ tiết kiệm"
            value={
              insights?.savingsRate != null
                ? `${insights.savingsRate}%`
                : 'Chưa có dữ liệu'
            }
            sub={
              insights?.savingsRate != null
                ? insights.savingsRate >= 20
                  ? 'Tuyệt vời, giữ vững nhé!'
                  : insights.savingsRate >= 0
                  ? 'Cố gắng tiết kiệm thêm'
                  : 'Chi nhiều hơn thu!'
                : undefined
            }
            highlight={
              insights?.savingsRate == null
                ? undefined
                : insights.savingsRate >= 20
                ? 'green'
                : insights.savingsRate >= 0
                ? 'amber'
                : 'red'
            }
          />
          <InsightCard
            icon={insights?.topCategory ? AlertTriangle : Wallet}
            iconBg="bg-violet-500"
            label="Danh mục chi nhiều nhất"
            value={insights?.topCategory?.name ?? 'Chưa có dữ liệu'}
            sub={
              insights?.topCategory
                ? fmtVND(insights.topCategory.value)
                : undefined
            }
          />
        </motion.div>
      )}

      {/* ── Stat cards ───────────────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        <StatCard label="Tổng thu nhập" value={data?.totalIncome ?? 0} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard label="Tổng chi tiêu" value={data?.totalExpense ?? 0} icon={TrendingDown} color="bg-red-500" />
        <StatCard label="Số dư" value={data?.balance ?? 0} icon={Wallet} color="bg-indigo-500" />
      </motion.div>

      {/* ── Charts ───────────────────────────────────────── */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
      >
        <ChartCard title="Chi tiêu theo danh mục">
          {data?.expenseByCategory.length ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={data.expenseByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {data.expenseByCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: unknown) =>
                      Number(v).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Không có dữ liệu chi tiêu</p>
          )}
        </ChartCard>

        <ChartCard title="Dòng tiền (30 ngày gần nhất)">
          {data?.cashflow.length ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data.cashflow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: string) => {
                      const [, m, d] = v.split('-');
                      return `${d}/${m}`;
                    }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: number) =>
                      v >= 1_000_000
                        ? `${(v / 1_000_000).toFixed(1)}tr`
                        : v >= 1_000
                        ? `${(v / 1_000).toFixed(0)}k`
                        : String(v)
                    }
                  />
                  <Tooltip
                    labelFormatter={(label: string) => {
                      const [y, m, d] = label.split('-');
                      return `${d}/${m}/${y}`;
                    }}
                    formatter={(v: unknown) =>
                      Number(v).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Thu nhập"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    name="Chi tiêu"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">Không có dữ liệu dòng tiền</p>
          )}
        </ChartCard>
      </motion.div>
    </motion.div>
  );
}
