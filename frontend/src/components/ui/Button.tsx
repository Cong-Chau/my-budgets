import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
}

const variantClass = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  ghost:
    'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600',
};

const sizeClass = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm' };

export default function Button({ variant = 'primary', size = 'md', className = '', ...props }: Props) {
  return (
    <button
      {...props}
      className={`rounded-lg font-medium transition disabled:opacity-50 cursor-pointer ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    />
  );
}
