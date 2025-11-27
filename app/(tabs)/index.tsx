import { ButtonBasic } from '@/components/ButtonBasic';
import { PetCardComponent } from '@/components/PetCardComponent';
import { SearchBarComponent } from '@/components/SearchBarComponent';
import { TextBasic } from '@/components/TextBasic';
import { useAuth } from '@/contexts/AuthContext';
import { petsService } from '@/services/pets.service';
import { Pet } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading]);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setIsLoading(true);
      const lostPets = await petsService.getLostPets();
      setPets(lostPets);
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await petsService.searchPets(query);
        setPets(results);
      } catch (error) {
        console.error('Error searching pets:', error);
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
