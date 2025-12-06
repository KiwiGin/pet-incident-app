import { ButtonBasic } from '@/components/ButtonBasic';
import { PetCardComponent } from '@/components/PetCardComponent';
import { SearchBarComponent } from '@/components/SearchBarComponent';
import { TextBasic } from '@/components/TextBasic';
import { useAuth } from '@/contexts/AuthContext';
import { petsService } from '@/services/pets.service';
import { Pet } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [fabAnimation] = useState(new Animated.Value(0));
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading]);

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

      const lostPets = await petsService.getLostPets(page);
      const totalCount = await petsService.getTotalLostPetsCount();

      if (page === 1) {
        setPets(lostPets);
        setHasMore(lostPets.length < totalCount);
      } else {
        setPets(prevPets => {
          const newPets = [...prevPets, ...lostPets];
          setHasMore(newPets.length < totalCount);
          return newPets;
        });
      }

      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading pets:', error);
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

        const results = await petsService.searchPets(query, page);
        const totalCount = await petsService.getSearchPetsCount(query);

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
        console.error('Error searching pets:', error);
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

  const toggleFab = () => {
    const toValue = isFabOpen ? 0 : 1;

    Animated.spring(fabAnimation, {
      toValue,
      useNativeDriver: true,
      friction: 5,
    }).start();

    setIsFabOpen(!isFabOpen);
  };

  const handleLocationPress = () => {
    toggleFab();
    router.push('/incidents-map');
  };

  const handleReportPress = () => {
    toggleFab();
    router.push('/create-incident');
  };

  const rotation = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const locationButtonTranslate = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const reportButtonTranslate = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -150],
  });

  if (authLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C8E64D" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextBasic variant="title" style={styles.title}>
          Animales <TextBasic variant="title" color="#FF6B6B">perdidos</TextBasic>
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
            title="Cerca de mí"
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

      {/* Overlay */}
      {isFabOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleFab}
        />
      )}

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        {/* Location Button */}
        <Animated.View
          style={[
            styles.fabOption,
            {
              transform: [{ translateY: locationButtonTranslate }],
              opacity: fabAnimation,
            },
          ]}
          pointerEvents={isFabOpen ? 'auto' : 'none'}
        >
          <View style={styles.fabOptionRow}>
            <TextBasic style={styles.fabLabel}>Mapa de incidencias</TextBasic>
            <TouchableOpacity
              style={styles.fabOptionButton}
              onPress={handleLocationPress}
              activeOpacity={0.8}
            >
              <Ionicons name="location" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Report/Paw Button */}
        <Animated.View
          style={[
            styles.fabOption,
            {
              transform: [{ translateY: reportButtonTranslate }],
              opacity: fabAnimation,
            },
          ]}
          pointerEvents={isFabOpen ? 'auto' : 'none'}
        >
          <View style={styles.fabOptionRow}>
            <TextBasic style={styles.fabLabel}>Crear incidencia</TextBasic>
            <TouchableOpacity
              style={styles.fabOptionButton}
              onPress={handleReportPress}
              activeOpacity={0.8}
            >
              <Ionicons name="paw" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Main FAB Button */}
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={toggleFab}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={32} color="#000" />
          </TouchableOpacity>
        </Animated.View>
      </View>
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
    paddingBottom: 100,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#AAA',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 10,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 90,
    right: 0,
    left: 0,
    alignItems: 'flex-end',
    paddingRight: 20,
    zIndex: 20,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C8E64D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabOption: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingRight: 20,
  },
  fabOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fabLabel: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  fabOptionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#C8E64D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});
