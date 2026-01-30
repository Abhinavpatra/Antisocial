import { View, type ViewProps } from 'react-native';
import { useAppTheme } from '@/hooks/useTheme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  className,
  lightColor,
  darkColor,
  style,
  ...otherProps
}: ThemedViewProps & { className?: string }) {
  const { theme, colors } = useAppTheme();
  const resolvedBg =
    theme === 'dark' ? (darkColor ?? colors.background) : (lightColor ?? colors.background);

  return (
    <View
      className={`${className || ''}`}
      style={[{ backgroundColor: resolvedBg }, style]}
      {...otherProps}
    />
  );
}
