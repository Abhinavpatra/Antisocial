import { View, type ViewProps } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  className,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps & { className?: string }) {
  const colorScheme = useColorScheme();

  // Default background classes based on theme
  const defaultBgClass = colorScheme === 'dark' ? 'bg-gray-900' : 'bg-white';

  return (
    <View className={`${defaultBgClass} ${className || ''}`} {...otherProps} />
  );
}
