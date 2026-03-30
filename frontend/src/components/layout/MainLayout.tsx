import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  duration: 0.3,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
};

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100">
      <Sidebar />
      <main className="flex-1 ml-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
