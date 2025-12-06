import { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TextBasic } from '@/components/TextBasic';
import { ButtonBasic } from '@/components/ButtonBasic';
import { SearchBarComponent } from '@/components/SearchBarComponent';
import { PetCardComponent } from '@/components/PetCardComponent';
import { petsService } from '@/services/pets.service';
import { Pet } from '@/types';

export default function AdoptionScreen() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async (page: number = 1) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const adoptionPets = await petsService.getAdoptionPets(page);
      const totalCount = await petsService.getTotalAdoptionPetsCount();

      if (page === 1) {
        setPets(adoptionPets);
        setHasMore(adoptionPets.length < totalCount);
      } else {
        setPets(prevPets => {
          const newPets = [...prevPets, ...adoptionPets];
          setHasMore(newPets.length < totalCount);
          return newPets;
        });
      }

      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading adoption pets:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleSearch = async (query: string, page: number = 1) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        if (page === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const results = await petsService.searchAdoptionPets(query, page);
        const totalCount = await petsService.getSearchAdoptionPetsCount(query);

        if (page === 1) {
          setPets(results);
          setHasMore(results.length < totalCount);
        } else {
          setPets(prevPets => {
            const newPets = [...prevPets, ...results];
            setHasMore(newPets.length < totalCount);
            return newPets;
          });
        }

        setCurrentPage(page);
      } catch (error) {
        console.error('Error searching adoption pets:', error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    } else {
      setHasMore(true);
      loadPets(1);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      if (searchQuery.trim()) {
        handleSearch(searchQuery, currentPage + 1);
      } else {
        loadPets(currentPage + 1);
      }
    }
  };

  const handleToggleFavorite = useCallback(async (petId: string) => {
    // Optimistic update - update UI immediately
    setPets(prevPets =>
      prevPets.map(pet =>
        pet.id === petId ? { ...pet, isFavorite: !pet.isFavorite } : pet
      )
    );

    // Then update the service
    try {
      await petsService.toggleFavorite(petId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setPets(prevPets =>
        prevPets.map(pet =>
          pet.id === petId ? { ...pet, isFavorite: !pet.isFavorite } : pet
        )
      );
    }
  }, []);

  const handleNearMe = () => {
    console.log('Near me clicked');
  };

  const renderPetCard = useCallback(({ item }: { item: Pet }) => (
    <PetCardComponent
      pet={item}
      onPress={() => router.push({
        pathname: '/pet-detail/[id]',
        params: { id: item.id }
      })}
      onToggleFavorite={handleToggleFavorite}
    />
  ), [router, handleToggleFavorite]);

  const keyExtractor = useCallback((item: Pet) => item.id, []);

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
          keyExtractor={keyExtractor}
          renderItem={renderPetCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#C8E64D" />
                <TextBasic style={styles.loadingText}>Cargando más...</TextBasic>
              </View>
            ) : null
          }
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
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#AAA',
  }
});
