import React from 'react';
import { TouchableOpacity, ActivityIndicator, ViewStyle, StyleSheet } from 'react-native';
import { TextBasic } from '../TextBasic';

interface ButtonBasicProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function ButtonBasic({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
  accessibilityHint
}: ButtonBasicProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'ghost':
        return styles.ghostButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#000';
      case 'secondary':
        return '#FFF';
      case 'ghost':
        return '#C8E64D';
      default:
        return '#000';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <TextBasic style={[styles.text, { color: getTextColor() }]}>
          {title}
        </TextBasic>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#C8E64D',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#C8E64D',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  }
});
