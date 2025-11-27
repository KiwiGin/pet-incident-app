import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextBasic } from '../TextBasic';

interface SelectorBasicProps {
  value: string;
  onPress: () => void;
}

export function SelectorBasic({ value, onPress }: SelectorBasicProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <TextBasic style={styles.text} color="#000" weight="semibold">
        {value}
      </TextBasic>
      <Ionicons name="chevron-down" size={20} color="#000" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C8E64D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  text: {
    fontSize: 16,
  }
});
