import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ className = '', ...props }: InputProps) => {
  const classes = `flex h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`;

  return <input className={classes} {...props} />;
};

export default Input;