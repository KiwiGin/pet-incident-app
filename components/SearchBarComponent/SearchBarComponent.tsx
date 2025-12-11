import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../contexts/LanguageContext';

interface SearchBarComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function SearchBarComponent({
  value,
  onChangeText,
  placeholder = 'Buscar',
  accessibilityLabel,
  accessibilityHint
}: SearchBarComponentProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        accessible={true}
        accessibilityLabel={accessibilityLabel || t('accessibility.searchInput')}
        accessibilityHint={accessibilityHint || t('accessibility.searchInputHint')}
        accessibilityRole="search"
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
