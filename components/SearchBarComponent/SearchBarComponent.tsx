import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBarComponent({
  value,
  onChangeText,
  placeholder = 'Buscar'
}: SearchBarComponentProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
      <Ionicons name="paw" size={20} color="#C8E64D" style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#C8E64D',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  }
});
