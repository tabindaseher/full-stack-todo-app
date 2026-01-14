import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?: 0 | 1 | 2 | 3 | 4;
  bordered?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  padding = 'md',
  elevation = 1,
  bordered = true,
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const elevationClasses = {
    0: 'shadow-none',
    1: 'shadow-sm',
    2: 'shadow',
    3: 'shadow-md',
    4: 'shadow-lg',
  };

  const borderClass = bordered ? 'border border-gray-200' : '';

  const classes = `rounded-lg bg-white ${paddingClasses[padding]} ${elevationClasses[elevation]} ${borderClass} ${className}`;

  return (
    <div className={classes}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-xl font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;