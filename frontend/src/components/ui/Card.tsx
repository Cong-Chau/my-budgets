import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700/40 shadow-sm p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
