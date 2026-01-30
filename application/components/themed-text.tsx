import { useAppTheme } from '@/hooks/useTheme';
import { Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  className?: string;
};

const typeClasses = {
  default: 'text-base leading-6',
  defaultSemiBold: 'text-base leading-6 font-semibold',
  title: 'text-3xl font-bold leading-8',
  subtitle: 'text-xl font-bold',
  link: 'text-base leading-8',
};

export function ThemedText({
  className,
  lightColor,
  darkColor,
  type = 'default',
  style,
  ...rest
}: ThemedTextProps) {
  const { theme, colors } = useAppTheme();
  const defaultColor = type === 'link' ? colors.primary : colors.text;
  const resolvedColor =
    theme === 'dark' ? (darkColor ?? defaultColor) : (lightColor ?? defaultColor);
  const finalColorClass = type === 'link' ? '' : '';

  return (
    <Text
      className={`${finalColorClass} ${typeClasses[type]} ${className || ''}`}
      style={[{ color: resolvedColor }, style]}
      {...rest}
    />
  );
}
