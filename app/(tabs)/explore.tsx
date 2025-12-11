import { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { TextBasic } from '@/components/TextBasic';
import { ButtonBasic } from '@/components/ButtonBasic';
import { SearchBarComponent } from '@/components/SearchBarComponent';
import { PetCardComponent } from '@/components/PetCardComponent';
import { useLanguage } from '@/contexts/LanguageContext';
import { incidentsService } from '@/services/incidents.service';
import { Incident } from '@/types';
import * as Location from 'expo-location';

export default function AdoptionScreen() {
  const { t } = useLanguage();
  const router = useRouter();
  const [pets, setPets] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isNearbyMode, setIsNearbyMode] = useState(false);

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

      const response = await incidentsService.getAdoptionPets({
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
      console.error('Error loading adoption pets:', error);
      Alert.alert(t('common.error'), t('explore.errorLoadingPets'));
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

        const response = await incidentsService.getAdoptionPets({
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
        console.error('Error searching adoption pets:', error);
        Alert.alert(t('common.error'), t('explore.errorSearchingPets'));
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
          t('explore.locationPermissionDenied'),
          t('explore.locationPermissionMessage')
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
      const nearbyPets = await incidentsService.getNearbyAdoptionPets({
        latitude,
        longitude,
        radius: 500, // 500 meters - realistic BLE range
      });

      setPets(nearbyPets);
      setHasMore(false); // Nearby search doesn't support pagination
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading nearby pets:', error);
      Alert.alert(t('common.error'), t('explore.errorLoadingNearbyPets'));
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextBasic variant="title" style={styles.title}>
          {t('explore.titlePart1')} <TextBasic variant="title" color="#C8E64D">{t('explore.titlePart2')}</TextBasic>
        </TextBasic>

        <View style={styles.searchRow}>
          <View style={styles.searchBarContainer}>
            <SearchBarComponent
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder={t('explore.searchPlaceholder')}
            />
          </View>

          <ButtonBasic
            title={t('explore.nearMe')}
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
                <TextBasic style={styles.loadingText}>{t('common.loadingMore')}</TextBasic>
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
