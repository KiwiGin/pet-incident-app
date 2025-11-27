import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextBasic } from '@/components/TextBasic';
import { ButtonBasic } from '@/components/ButtonBasic';
import { SearchBarComponent } from '@/components/SearchBarComponent';
import { PetCardComponent } from '@/components/PetCardComponent';
import { petsService } from '@/services/pets.service';
import { Pet } from '@/types';

export default function AdoptionScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setIsLoading(true);
      const adoptionPets = await petsService.getAdoptionPets();
      setPets(adoptionPets);
    } catch (error) {
      console.error('Error loading adoption pets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await petsService.searchAdoptionPets(query);
        setPets(results);
      } catch (error) {
        console.error('Error searching adoption pets:', error);
      }
    } else {
      loadPets();
    }
  };

  const handleToggleFavorite = async (petId: string) => {
    try {
      await petsService.toggleFavorite(petId);
      setPets(prevPets =>
        prevPets.map(pet =>
          pet.id === petId ? { ...pet, isFavorite: !pet.isFavorite } : pet
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleNearMe = () => {
    console.log('Near me clicked');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextBasic variant="title" style={styles.title}>
          Animales en <TextBasic variant="title" color="#C8E64D">adopción</TextBasic>
        </TextBasic>

        <View style={styles.searchRow}>
          <View style={styles.searchBarContainer}>
            <SearchBarComponent
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Buscar"
            />
          </View>

          <ButtonBasic
            title="cerca de mí"
            onPress={handleNearMe}
            variant="primary"
            style={styles.nearMeButton}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C8E64D" />
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PetCardComponent
              pet={item}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  searchBarContainer: {
    flex: 1,
  },
  nearMeButton: {
    width: 120,
    height: 45,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  }
});
