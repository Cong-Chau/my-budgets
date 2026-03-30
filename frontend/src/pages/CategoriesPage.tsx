import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useCategories } from '../context/CategoryContext';
import type { Category, CategoryType } from '../types';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

interface FormState { name: string; type: CategoryType }

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.25 },
  },
};

export default function CategoriesPage() {
  const { items, loading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories();
  const [modal, setModal] = useState<null | 'create' | Category>(null);
  const [form, setForm] = useState<FormState>({ name: '', type: 'EXPENSE' });

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => { setForm({ name: '', type: 'EXPENSE' }); setModal('create'); };
  const openEdit = (c: Category) => { setForm({ name: c.name, type: c.type }); setModal(c); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modal === 'create') {
      await createCategory(form);
    } else if (modal && typeof modal === 'object') {
      await updateCategory(modal.id, form);
    }
    setModal(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa danh mục này?')) deleteCategory(id);
  };

  const badgeColor = (type: CategoryType) =>
    type === 'INCOME' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700';

  return (
    <motion.div
      className="p-8"
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
          Danh mục
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button onClick={openCreate} size="sm">
            <Plus size={16} className="inline mr-1" /> Thêm danh mục
          </Button>
        </motion.div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="h-20 bg-gray-100 dark:bg-gray-700 rounded-xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.1 }}
            />
          ))}
        </div>
      ) : (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map((c, i) => (
              <motion.div
                key={c.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
                whileHover={{ y: -4, boxShadow: '0 16px 32px -8px rgba(0,0,0,0.14)' }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">{c.name}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${badgeColor(c.type)}`}>
                    {c.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.2, color: '#6366f1' }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => openEdit(c)}
                    className="p-1.5 text-gray-400 cursor-pointer"
                  >
                    <Pencil size={15} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2, color: '#ef4444' }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 text-gray-400 cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {modal !== null && (
          <Modal
            title={modal === 'create' ? 'Thêm danh mục' : 'Chỉnh sửa danh mục'}
            onClose={() => setModal(null)}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Tên"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Select
                label="Loại"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as CategoryType })}
              >
                <option value="INCOME">Thu nhập</option>
                <option value="EXPENSE">Chi tiêu</option>
              </Select>
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
