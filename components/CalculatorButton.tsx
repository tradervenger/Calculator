
import React from 'react';

interface CalculatorButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'action' | 'special';
  className?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'number',
  className = ''
}) => {
  const handlePress = () => {
    // Basic vibration feedback for mobile feel
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onClick();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'operator':
        return 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700';
      case 'action':
        return 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 active:bg-zinc-600';
      case 'special':
        return 'bg-orange-500 text-white hover:bg-orange-400 active:bg-orange-600';
      default:
        return 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800 active:bg-zinc-700';
    }
  };

  return (
    <button
      onClick={handlePress}
      className={`
        h-16 w-full rounded-2xl flex items-center justify-center 
        text-xl font-medium transition-all duration-100 transform active:scale-95
        ${getVariantStyles()}
        ${className}
      `}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;
