import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextBasic } from '../TextBasic';
import { Pet } from '../../types';

interface PetCardComponentProps {
  pet: Pet;
  onPress?: () => void;
  onToggleFavorite?: (petId: string) => void;
  showFavorite?: boolean;
}

function PetCardComponentBase({
  pet,
  onPress,
  onToggleFavorite,
  showFavorite = true
}: PetCardComponentProps) {
  const handleFavoritePress = React.useCallback(() => {
    onToggleFavorite?.(pet.id);
  }, [onToggleFavorite, pet.id]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: pet.image }}
        style={styles.image}
      />

      <View style={styles.content}>
        <TextBasic variant="subtitle" weight="semibold" style={styles.name}>
          {pet.name}
        </TextBasic>

        <TextBasic variant="body" style={styles.subtitle}>
          Mi compañero ha desaparecido
        </TextBasic>

        <TextBasic variant="caption" style={styles.description} numberOfLines={3}>
          {pet.description}
        </TextBasic>
      </View>

      {showFavorite && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
        >
          <View style={styles.favoriteCircle}>
            <Ionicons
              name={pet.isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={pet.isFavorite ? '#FF6B6B' : '#888'}
            />
          </View>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

export const PetCardComponent = React.memo(PetCardComponentBase, (prevProps, nextProps) => {
  return (
    prevProps.pet.id === nextProps.pet.id &&
    prevProps.pet.isFavorite === nextProps.pet.isFavorite &&
    prevProps.showFavorite === nextProps.showFavorite
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  content: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'flex-start',
  },
  name: {
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
    color: '#CCC',
  },
  description: {
    color: '#AAA',
    lineHeight: 18,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  favoriteCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
