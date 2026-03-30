import React from "react";
import { motion } from "framer-motion";
import { Card } from "./Card";

interface StatCardProps {
  title: string;
  amount: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  colorClass?: string;
  iconBg?: string;
  index?: number;
}

export function StatCard({
  title,
  amount,
  trend,
  trendUp,
  icon,
  colorClass = "text-blue-600 dark:text-blue-400",
  iconBg = "bg-slate-100 dark:bg-slate-700/50",
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)' }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="flex flex-col gap-4 border border-slate-200 dark:border-slate-700/40">
        <div className="flex justify-between items-start">
          <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">{title}</h3>
          <motion.div
            className={`p-2.5 rounded-xl ${iconBg} ${colorClass}`}
            whileHover={{ scale: 1.15, rotate: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            {icon}
          </motion.div>
        </div>
        <div>
          <p className={`text-3xl font-bold tracking-tight ${colorClass}`}>{amount}</p>
          {trend && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
              className={`text-sm mt-2 flex items-center gap-1 ${
                trendUp
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </motion.p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
