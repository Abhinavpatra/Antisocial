import { useAppTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  onPress?: () => void;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  onPress,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const { colors } = useAppTheme();

  const handlePress = () => {
    if (disabled || isLoading) return;
    Haptics.selectionAsync();
    onPress?.();
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary';
      case 'secondary':
        return 'bg-slate-200 dark:bg-slate-700';
      case 'outline':
        return 'bg-transparent border border-slate-300 dark:border-slate-600';
      case 'ghost':
        return 'bg-transparent';
      default:
        return 'bg-primary';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-3';
      case 'md':
        return 'py-3 px-5';
      case 'lg':
        return 'py-4 px-6';
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return 'text-white font-semibold';
      case 'secondary':
        return 'text-slate-900 dark:text-white font-medium';
      case 'outline':
        return 'text-slate-700 dark:text-slate-200 font-medium';
      case 'ghost':
        return 'text-primary font-medium';
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      className={`rounded-2xl flex-row justify-center items-center ${getVariantStyle()} ${getSizeStyle()} ${disabled ? 'opacity-50' : ''} ${className || ''}`}
      {...props}>
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : colors.text} size="small" />
      ) : (
        <Text className={`${getTextStyle()} text-center text-base`}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
