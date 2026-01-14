import React from 'react';
import Button from './button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    text: string;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  showAction?: boolean;
  showSecondaryAction?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  secondaryAction,
  showAction = true,
  showSecondaryAction = false
}) => {
  return (
    <div className="text-center py-12">
      {icon && <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">{icon}</div>}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {showAction && action && (
        <div className="mt-6">
          <Button onClick={action.onClick}>
            {action.text}
          </Button>
        </div>
      )}
      {showSecondaryAction && secondaryAction && (
        <div className="mt-4">
          <Button onClick={secondaryAction.onClick} variant="outline">
            {secondaryAction.text}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;