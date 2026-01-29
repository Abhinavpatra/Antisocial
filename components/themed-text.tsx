import { Text, type TextProps } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

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
  link: 'text-base leading-8 text-cyan-600',
};

export function ThemedText({
  className,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const colorScheme = useColorScheme();

  // Default text color based on theme
  const textColorClass = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-900';

  // Link has its own color
  const finalColorClass = type === 'link' ? '' : textColorClass;

  return (
    <Text
      className={`${finalColorClass} ${typeClasses[type]} ${className || ''}`}
      {...rest}
    />
  );
}
