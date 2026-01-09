import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
}

const Card = ({ children, className = '', variant = 'default' }: CardProps) => {
  const baseClasses = 'rounded-xl border bg-card text-card-foreground shadow-sm';
  const variantClasses = variant === 'elevated' ? 'shadow-lg' : '';
  const classes = `${baseClasses} ${variantClasses} ${className}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={classes}
    >
      {children}
    </motion.div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  const classes = `flex flex-col space-y-1.5 p-6 ${className}`;
  return <div className={classes}>{children}</div>;
};

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

const CardTitle = ({ children, className = '' }: CardTitleProps) => {
  const classes = `text-2xl font-semibold leading-none tracking-tight ${className}`;
  return <h3 className={classes}>{children}</h3>;
};

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

const CardDescription = ({ children, className = '' }: CardDescriptionProps) => {
  const classes = `text-sm text-muted-foreground ${className}`;
  return <p className={classes}>{children}</p>;
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

const CardContent = ({ children, className = '' }: CardContentProps) => {
  const classes = `p-6 pt-0 ${className}`;
  return <div className={classes}>{children}</div>;
};

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  const classes = `flex items-center p-6 pt-0 ${className}`;
  return <div className={classes}>{children}</div>;
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };