import React, { useState } from 'react';
import { TextInput, View, TextInputProps, StyleSheet } from 'react-native';

interface TextAreaBasicProps extends TextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  numberOfLines?: number;
}

export function TextAreaBasic({
  placeholder,
  value,
  onChangeText,
  numberOfLines = 4,
  ...props
}: TextAreaBasicProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      <TextInput
        style={styles.textArea}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#C8E64D',
    borderRadius: 25,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  containerFocused: {
    borderColor: '#A8C63D',
  },
  textArea: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
});
