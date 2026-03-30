import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${error ? "border-red-400" : "border-gray-300 dark:border-gray-600"} ${className}`}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
