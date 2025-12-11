import { ButtonBasic } from '@/components/ButtonBasic';
import { PetCardComponent } from '@/components/PetCardComponent';
import { SearchBarComponent } from '@/components/SearchBarComponent';
import { TextBasic } from '@/components/TextBasic';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { incidentsService } from '@/services/incidents.service';
import { Incident } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [pets, setPets] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [fabAnimation] = useState(new Animated.Value(0));
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isNearbyMode, setIsNearbyMode] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reload the current view (search, nearby, or all)
      if (isNearbyMode && userLocation) {
        handleNearMe();
      } else if (searchQuery.trim()) {
        handleSearch(searchQuery, 1);
      } else {
        loadPets(1);
      }
    }, [isNearbyMode, searchQuery])
  );

  const loadPets = async (page: number = 1) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await incidentsService.getLostPets({
        page,
        limit: 10,
      });

      if (page === 1) {
        setPets(response.pets);
        setHasMore(response.pagination.hasMore);
      } else {
        setPets(prevPets => [...prevPets, ...response.pets]);
        setHasMore(response.pagination.hasMore);
      }

      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading pets:', error);
      Alert.alert(t('common.error'), t('home.errorLoadingPets'));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleSearch = async (query: string, page: number = 1) => {
    setSearchQuery(query);
    setIsNearbyMode(false); // Exit nearby mode when searching

    if (query.trim()) {
      try {
        if (page === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await incidentsService.getLostPets({
          page,
          limit: 10,
          petName: query,
        });

        if (page === 1) {
          setPets(response.pets);
          setHasMore(response.pagination.hasMore);
        } else {
          setPets(prevPets => [...prevPets, ...response.pets]);
          setHasMore(response.pagination.hasMore);
        }

        setCurrentPage(page);
      } catch (error) {
        console.error('Error searching pets:', error);
        Alert.alert(t('common.error'), t('home.errorSearchingPets'));
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
    // Don't load more in nearby mode (not paginated)
    if (!isLoadingMore && hasMore && !isNearbyMode) {
      if (searchQuery.trim()) {
        handleSearch(searchQuery, currentPage + 1);
      } else {
        loadPets(currentPage + 1);
      }
    }
  };

  const handleNearMe = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          t('home.locationPermissionDenied'),
          t('home.locationPermissionMessage')
        );
        return;
      }

      setIsLoading(true);
      setSearchQuery(''); // Clear search when using nearby
      setIsNearbyMode(true);

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      // Load nearby pets (500m radius - BLE detection range)
      const nearbyPets = await incidentsService.getNearbyLostPets({
        latitude,
        longitude,
        radius: 500, // 500 meters - realistic BLE range
      });

      setPets(nearbyPets);
      setHasMore(false); // Nearby search doesn't support pagination
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading nearby pets:', error);
      Alert.alert(t('common.error'), t('home.errorLoadingNearbyPets'));
      setIsNearbyMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPetCard = useCallback(({ item }: { item: Incident }) => (
    <PetCardComponent
      pet={item}
      onPress={() => router.push({
        pathname: '/pet-detail/[id]',
        params: { id: item._id }
      })}
    />
  ), [router]);

  const keyExtractor = useCallback((item: Incident) => item._id, []);

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
          {t('home.titlePart1')} <TextBasic variant="title" color="#FF6B6B">{t('home.titlePart2')}</TextBasic>
        </TextBasic>

        <View style={styles.searchRow}>
          <View style={styles.searchBarContainer}>
            <SearchBarComponent
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder={t('home.searchPlaceholder')}
              accessibilityLabel={t('accessibility.searchInput')}
              accessibilityHint={t('accessibility.searchInputHint')}
            />
          </View>

          <ButtonBasic
            title={t('home.nearMe')}
            onPress={handleNearMe}
            variant="primary"
            style={styles.nearMeButton}
            accessibilityLabel={t('accessibility.nearMeButton')}
            accessibilityHint={t('accessibility.nearMeButtonHint')}
          />
        </View>
      </View>

      {isLoading ? (
        <View
          style={styles.loadingContainer}
          accessible={true}
          accessibilityLabel={t('accessibility.loading')}
        >
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
              <View
                style={styles.footerLoader}
                accessible={true}
                accessibilityLabel={t('common.loadingMore')}
              >
                <ActivityIndicator size="small" color="#C8E64D" />
                <TextBasic style={styles.loadingText}>{t('common.loadingMore')}</TextBasic>
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
            <TextBasic style={styles.fabLabel}>{t('home.fabLabelMap')}</TextBasic>
            <TouchableOpacity
              style={styles.fabOptionButton}
              onPress={handleLocationPress}
              activeOpacity={0.8}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t('accessibility.mapButton')}
              accessibilityHint={t('accessibility.mapButtonHint')}
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
            <TextBasic style={styles.fabLabel}>{t('home.fabLabelCreate')}</TextBasic>
            <TouchableOpacity
              style={styles.fabOptionButton}
              onPress={handleReportPress}
              activeOpacity={0.8}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={t('incidents.create')}
              accessibilityHint={t('accessibility.submitButtonHint')}
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
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={isFabOpen ? t('common.close') : t('incidents.create')}
            accessibilityHint={isFabOpen ? t('accessibility.cancelButtonHint') : t('accessibility.submitButtonHint')}
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
