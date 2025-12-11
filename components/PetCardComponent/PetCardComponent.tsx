import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { TextBasic } from '../TextBasic';
import { Pet, Incident } from '../../types';

interface PetCardComponentProps {
  pet: Pet | Incident;
  onPress?: () => void;
}

// Type guard to check if pet is an Incident
const isIncident = (pet: Pet | Incident): pet is Incident => {
  return '_id' in pet;
};

function PetCardComponentBase({
  pet,
  onPress
}: PetCardComponentProps) {
  const petName = isIncident(pet) ? pet.petName : pet.name;
  const petImage = isIncident(pet) ? pet.imageUrls[0] : pet.image;
  const petDescription = pet.description;
  const petType = isIncident(pet) ? pet.incidentType : pet.status;

  const getSubtitle = () => {
    if (petType === 'lost') {
      return 'Mi compañero ha desaparecido';
    } else if (petType === 'adoption') {
      return 'Busco un hogar';
    }
    return 'Mascota encontrada';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: petImage }}
        style={styles.image}
      />

      <View style={styles.content}>
        <TextBasic variant="subtitle" weight="semibold" style={styles.name}>
          {petName}
        </TextBasic>

        <TextBasic variant="body" style={styles.subtitle}>
          {getSubtitle()}
        </TextBasic>

        <TextBasic variant="caption" style={styles.description} numberOfLines={3}>
          {petDescription}
        </TextBasic>
      </View>
    </TouchableOpacity>
  );
}

export const PetCardComponent = React.memo(PetCardComponentBase, (prevProps, nextProps) => {
  const prevId = isIncident(prevProps.pet) ? prevProps.pet._id : prevProps.pet.id;
  const nextId = isIncident(nextProps.pet) ? nextProps.pet._id : nextProps.pet.id;

  return prevId === nextId;
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
  }
});
