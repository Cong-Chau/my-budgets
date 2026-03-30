import { useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { motion, type Variants } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { TrendingUp, TrendingDown, Wallet, type LucideIcon } from 'lucide-react';

const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: LucideIcon; color: string }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.18)' }}
      whileTap={{ scale: 0.97 }}
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
        {value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
      </p>
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

  useEffect(() => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - 29);
    fetchDashboard({
      dateFrom: from.toISOString().slice(0, 10),
      dateTo: today.toISOString().slice(0, 10),
    });
  }, [fetchDashboard]);

  if (loading) return (
    <div className="p-8 flex flex-col gap-4">
      {[...Array(3)].map((_, i) => (
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
      className="p-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.h2
        variants={itemVariants}
        className="text-xl font-bold text-gray-800 dark:text-white"
      >
        Tổng quan
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        <StatCard label="Tổng thu nhập" value={data?.totalIncome ?? 0} icon={TrendingUp} color="bg-emerald-500" />
        <StatCard label="Tổng chi tiêu" value={data?.totalExpense ?? 0} icon={TrendingDown} color="bg-red-500" />
        <StatCard label="Số dư" value={data?.balance ?? 0} icon={Wallet} color="bg-indigo-500" />
      </motion.div>

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
                  <Pie data={data.expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {data.expenseByCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: unknown) => Number(v).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} />
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
                  <Line type="monotone" dataKey="income" name="Thu nhập" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="expense" name="Chi tiêu" stroke="#ef4444" strokeWidth={2} dot={false} />
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
