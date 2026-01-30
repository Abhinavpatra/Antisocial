import { useAppTheme } from '@/hooks/useTheme';
import { View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'default' | 'outlined' | 'elevated';
}

export function Card({ className, variant = 'default', style, ...props }: CardProps) {
  const { colors } = useAppTheme();

  const getVariantClasses = () => {
    switch (variant) {
      case 'outlined':
        return 'border border-slate-200 dark:border-slate-800 bg-transparent';
      case 'elevated':
        return 'bg-white dark:bg-slate-900 shadow-sm';
      default:
        return 'bg-slate-100 dark:bg-slate-900';
    }
  };

  return (
    <View
      className={`rounded-3xl p-4 ${getVariantClasses()} ${className || ''}`}
      style={style}
      {...props}
    />
  );
}
