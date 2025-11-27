import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

interface TextBasicProps extends RNTextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  color?: string;
  weight?: 'normal' | 'semibold' | 'bold';
}

export function TextBasic({
  variant = 'body',
  color = '#FFF',
  weight = 'normal',
  style,
  children,
  ...props
}: TextBasicProps) {
  const getTextStyle = () => {
    switch (variant) {
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'body':
        return styles.body;
      case 'caption':
        return styles.caption;
      default:
        return styles.body;
    }
  };

  const getFontWeight = (): '400' | '600' | '700' => {
    switch (weight) {
      case 'bold':
        return '700';
      case 'semibold':
        return '600';
      default:
        return '400';
    }
  };

  return (
    <RNText
      style={[
        getTextStyle(),
        { color, fontWeight: getFontWeight() },
        style
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
  }
});
