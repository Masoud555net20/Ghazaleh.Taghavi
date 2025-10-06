import React from 'react';

interface MaterialCardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'low' | 'medium' | 'high' | 'hover';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'glass' | 'gradient' | 'dark';
  interactive?: boolean;
  onClick?: () => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  children,
  className = '',
  elevation = 'medium',
  rounded = 'lg',
  padding = 'md',
  background = 'white',
  interactive = false,
  onClick
}) => {
  const getElevationStyles = () => {
    switch (elevation) {
      case 'low':
        return 'shadow-sm hover:shadow-md';
      case 'medium':
        return 'shadow-lg hover:shadow-xl';
      case 'high':
        return 'shadow-2xl hover:shadow-3xl';
      case 'hover':
        return 'shadow-md hover:shadow-2xl hover:-translate-y-1';
      default:
        return 'shadow-lg';
    }
  };

  const getRoundedStyles = () => {
    switch (rounded) {
      case 'none':
        return 'rounded-none';
      case 'sm':
        return 'rounded-sm';
      case 'md':
        return 'rounded-md';
      case 'lg':
        return 'rounded-lg';
      case 'xl':
        return 'rounded-xl';
      case 'full':
        return 'rounded-full';
      default:
        return 'rounded-lg';
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return 'p-0';
      case 'sm':
        return 'p-3';
      case 'md':
        return 'p-6';
      case 'lg':
        return 'p-8';
      case 'xl':
        return 'p-12';
      default:
        return 'p-6';
    }
  };

  const getBackgroundStyles = () => {
    switch (background) {
      case 'white':
        return 'bg-white';
      case 'glass':
        return 'bg-white/10 backdrop-blur-md border border-white/20';
      case 'gradient':
        return 'bg-gradient-to-br from-blue-50 to-purple-50';
      case 'dark':
        return 'bg-gray-900 text-white';
      default:
        return 'bg-white';
    }
  };

  const cardClasses = `
    ${getElevationStyles()}
    ${getRoundedStyles()}
    ${getPaddingStyles()}
    ${getBackgroundStyles()}
    ${interactive ? 'cursor-pointer transition-all duration-300' : ''}
    ${className}
  `.trim();

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      style={{
        transform: 'translateZ(0)', // Force hardware acceleration
      }}
    >
      {children}
    </div>
  );
};

interface FloatingActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  children,
  onClick,
  className = '',
  size = 'md',
  color = 'primary',
  position = 'bottom-right'
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'w-12 h-12';
      case 'md':
        return 'w-16 h-16';
      case 'lg':
        return 'w-20 h-20';
      default:
        return 'w-16 h-16';
    }
  };

  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${getSizeStyles()}
        ${getColorStyles()}
        ${getPositionStyles()}
        fixed rounded-full shadow-2xl hover:shadow-3xl
        transition-all duration-300 hover:scale-110
        flex items-center justify-center z-50
        ${className}
      `.trim()}
      style={{
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </button>
  );
};

interface MaterialButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export const MaterialButton: React.FC<MaterialButtonProps> = ({
  children,
  onClick,
  variant = 'contained',
  color = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'contained':
        return getContainedStyles();
      case 'outlined':
        return getOutlinedStyles();
      case 'text':
        return getTextStyles();
      default:
        return getContainedStyles();
    }
  };

  const getContainedStyles = () => {
    const colorMap = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl',
      success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg hover:shadow-xl',
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
    };
    return colorMap[color] || colorMap.primary;
  };

  const getOutlinedStyles = () => {
    const colorMap = {
      primary: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
      secondary: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50',
      success: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
      warning: 'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50',
      danger: 'border-2 border-red-600 text-red-600 hover:bg-red-50',
    };
    return colorMap[color] || colorMap.primary;
  };

  const getTextStyles = () => {
    const colorMap = {
      primary: 'text-blue-600 hover:bg-blue-50',
      secondary: 'text-gray-600 hover:bg-gray-50',
      success: 'text-green-600 hover:bg-green-50',
      warning: 'text-yellow-600 hover:bg-yellow-50',
      danger: 'text-red-600 hover:bg-red-50',
    };
    return colorMap[color] || colorMap.primary;
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-base';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        rounded-lg font-medium transition-all duration-300
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-opacity-50
        ${className}
      `.trim()}
      style={{
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </button>
  );
};

interface MaterialChipProps {
  label: string;
  variant?: 'filled' | 'outlined';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onDelete?: () => void;
  className?: string;
}

export const MaterialChip: React.FC<MaterialChipProps> = ({
  label,
  variant = 'filled',
  color = 'primary',
  size = 'md',
  onDelete,
  className = ''
}) => {
  const getVariantStyles = () => {
    if (variant === 'outlined') {
      const colorMap = {
        primary: 'border-blue-600 text-blue-600 bg-transparent',
        secondary: 'border-gray-600 text-gray-600 bg-transparent',
        success: 'border-green-600 text-green-600 bg-transparent',
        warning: 'border-yellow-600 text-yellow-600 bg-transparent',
        danger: 'border-red-600 text-red-600 bg-transparent',
      };
      return colorMap[color] || colorMap.primary;
    } else {
      const colorMap = {
        primary: 'bg-blue-600 text-white',
        secondary: 'bg-gray-600 text-white',
        success: 'bg-green-600 text-white',
        warning: 'bg-yellow-600 text-white',
        danger: 'bg-red-600 text-white',
      };
      return colorMap[color] || colorMap.primary;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-1 text-sm';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  return (
    <div
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${variant === 'outlined' ? 'border' : ''}
        rounded-full font-medium inline-flex items-center gap-1
        transition-all duration-300 hover:scale-105
        ${className}
      `.trim()}
      style={{
        transform: 'translateZ(0)',
      }}
    >
      {label}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-4 h-4 rounded-full hover:bg-black/10 flex items-center justify-center text-xs"
        >
          ×
        </button>
      )}
    </div>
  );
};

interface MaterialProgressProps {
  value: number;
  max?: number;
  variant?: 'linear' | 'circular';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
}

export const MaterialProgress: React.FC<MaterialProgressProps> = ({
  value,
  max = 100,
  variant = 'linear',
  color = 'primary',
  size = 'md',
  className = '',
  showValue = false
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const getColorStyles = () => {
    const colorMap = {
      primary: 'bg-blue-600',
      secondary: 'bg-gray-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      danger: 'bg-red-600',
    };
    return colorMap[color] || colorMap.primary;
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return variant === 'linear' ? 'h-2' : 'w-8 h-8';
      case 'md':
        return variant === 'linear' ? 'h-4' : 'w-12 h-12';
      case 'lg':
        return variant === 'linear' ? 'h-6' : 'w-16 h-16';
      default:
        return variant === 'linear' ? 'h-4' : 'w-12 h-12';
    }
  };

  if (variant === 'circular') {
    const strokeWidth = size === 'sm' ? 2 : size === 'md' ? 3 : 4;
    const radius = size === 'sm' ? 12 : size === 'md' ? 18 : 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`relative ${getSizeStyles()} ${className}`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
          <circle
            cx="21"
            cy="21"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="21"
            cy="21"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`text-current ${getColorStyles()}`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium">{Math.round(percentage)}%</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full ${getSizeStyles()} bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${getColorStyles()} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};

export default {
  MaterialCard,
  FloatingActionButton,
  MaterialButton,
  MaterialChip,
  MaterialProgress
};
