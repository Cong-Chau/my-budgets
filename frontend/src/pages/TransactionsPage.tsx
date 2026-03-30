import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useTransactions } from '../context/TransactionContext';
import { useCategories } from '../context/CategoryContext';
import type { Transaction, TransactionType } from '../types';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

interface FormState {
  amount: string;
  type: TransactionType;
  categoryId: string;
  date: string;
  note: string;
}

const emptyForm = (): FormState => ({
  amount: '',
  type: 'EXPENSE',
  categoryId: '',
  date: new Date().toISOString().slice(0, 10),
  note: '',
});

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: i * 0.05, ease: 'easeOut' },
  }),
  exit: { opacity: 0, x: 16, transition: { duration: 0.2 } },
};

export default function TransactionsPage() {
  const { items, loading, fetchTransactions, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { items: categories, fetchCategories } = useCategories();
  const [modal, setModal] = useState<null | 'create' | Transaction>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [filter, setFilter] = useState({ dateFrom: '', dateTo: '', type: '' });

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [fetchCategories, fetchTransactions]);

  const openCreate = () => { setForm(emptyForm()); setModal('create'); };
  const openEdit = (t: Transaction) => {
    setForm({
      amount: String(t.amount),
      type: t.type,
      categoryId: String(t.categoryId),
      date: t.date.slice(0, 10),
      note: t.note ?? '',
    });
    setModal(t);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      amount: parseFloat(form.amount),
      type: form.type,
      categoryId: parseInt(form.categoryId),
      date: form.date,
      note: form.note || undefined,
    };
    if (modal === 'create') {
      await createTransaction(payload);
    } else if (modal && typeof modal === 'object') {
      await updateTransaction(modal.id, payload);
    }
    setModal(null);
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa giao dịch này?')) deleteTransaction(id);
  };

  const handleFilter = () => {
    fetchTransactions({
      dateFrom: filter.dateFrom || undefined,
      dateTo: filter.dateTo || undefined,
      type: (filter.type as TransactionType) || undefined,
    });
  };

  const filteredCategories = categories.filter((c) => !form.type || c.type === form.type);

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between mb-6">
        <motion.h2
          className="text-xl font-bold text-gray-800 dark:text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          Giao dịch
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button onClick={openCreate} size="sm">
            <Plus size={16} className="inline mr-1" /> Thêm giao dịch
          </Button>
        </motion.div>
      </div>

      {/* Bộ lọc */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-end w-full"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">Từ ngày</label>
          <input
            type="date"
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-white"
            value={filter.dateFrom}
            onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">Đến ngày</label>
          <input
            type="date"
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-white"
            value={filter.dateTo}
            onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">Loại</label>
          <select
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-white"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <option value="">Tất cả</option>
            <option value="INCOME">Thu nhập</option>
            <option value="EXPENSE">Chi tiêu</option>
          </select>
        </div>
        <Button onClick={handleFilter} size="sm" variant="ghost">Áp dụng</Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => { setFilter({ dateFrom: '', dateTo: '', type: '' }); fetchTransactions(); }}
        >
          Đặt lại
        </Button>
      </motion.div>

      {loading ? (
        <motion.div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="h-12 bg-gray-100 dark:bg-gray-700 rounded-xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.15 }}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-600">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Ngày</th>
                <th className="text-left px-5 py-3 font-medium">Danh mục</th>
                <th className="text-left px-5 py-3 font-medium">Ghi chú</th>
                <th className="text-right px-5 py-3 font-medium">Số tiền</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              <AnimatePresence initial={false}>
                {items.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    custom={i}
                    variants={rowVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    layout
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
                  >
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{t.date.slice(0, 10)}</td>
                    <td className="px-5 py-3">
                      <span className="font-medium text-gray-800 dark:text-white">{t.category?.name}</span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-semibold ${t.type === 'INCOME' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {t.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{t.note ?? '—'}</td>
                    <td className={`px-5 py-3 text-right font-semibold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {t.type === 'INCOME' ? '+' : '-'}{Number(t.amount).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.2, color: '#6366f1' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEdit(t)}
                          className="p-1.5 text-gray-400 cursor-pointer"
                        >
                          <Pencil size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2, color: '#ef4444' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 text-gray-400 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {items.length === 0 && (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                      Không có giao dịch nào
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {modal !== null && (
          <Modal
            title={modal === 'create' ? 'Thêm giao dịch' : 'Chỉnh sửa giao dịch'}
            onClose={() => setModal(null)}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Loại"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType, categoryId: '' })}
              >
                <option value="INCOME">Thu nhập</option>
                <option value="EXPENSE">Chi tiêu</option>
              </Select>
              <div className="space-y-2">
                <Input
                  label="Số tiền"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
                <div className="flex gap-2">
                  {[50000, 100000, 200000].map((preset) => (
                    <motion.button
                      key={preset}
                      type="button"
                      onClick={() => setForm({ ...form, amount: String(Number(form.amount || 0) + preset) })}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 text-xs font-semibold px-2 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/40 transition-colors cursor-pointer"
                    >
                      +{preset.toLocaleString('vi-VN')}
                    </motion.button>
                  ))}
                </div>
              </div>
              <Select
                label="Danh mục"
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                <option value="">Chọn danh mục</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
              <Input
                label="Ngày"
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <Input
                label="Ghi chú (tùy chọn)"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" type="button" onClick={() => setModal(null)}>Hủy</Button>
                <Button type="submit">Lưu</Button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
