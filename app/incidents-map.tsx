import { TextBasic } from '@/components/TextBasic';
import { petsService } from '@/services/pets.service';
import { bleSimulationService, ProximityAlert } from '@/services/ble-simulation.service';
import { Pet } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Platform
} from 'react-native';
import MapView, { Marker, Region, Circle } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const DETECTION_RADIUS = 500; // 500 meters
const MAX_ZOOM_DELTA = 0.01; // Limit zoom out (like Pokemon GO)
const MIN_ZOOM_DELTA = 0.001; // Minimum zoom

export default function IncidentsMapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [lostPets, setLostPets] = useState<Pet[]>([]);
  const [adoptionPets, setAdoptionPets] = useState<Pet[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearbyPets, setNearbyPets] = useState<ProximityAlert[]>([]);
  const [pulseAnim] = useState(new Animated.Value(1));

  const [region, setRegion] = useState<Region>({
    latitude: -12.0464,
    longitude: -77.0428,
    latitudeDelta: 0.005, // Start more zoomed in
    longitudeDelta: 0.005,
  });

  useEffect(() => {
    loadPetsWithLocations();
    getCurrentLocation();

    return () => {
      bleSimulationService.stopSimulation();
    };
  }, []);

  // Pulse animation for nearby pets
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const sendProximityAlert = (alert: ProximityAlert) => {
    // Use Alert instead of push notifications for Expo Go compatibility
    Alert.alert(
      '🐾 ¡Mascota perdida cerca!',
      `${alert.pet.name} está a ${alert.distance}m de ti.\nSeñal: ${alert.signalStrength}%`,
      [
        { text: 'OK', style: 'default' },
        {
          text: 'Ver en mapa',
          onPress: () => {
            if (mapRef.current && alert.pet.location) {
              mapRef.current.animateToRegion({
                latitude: alert.pet.location.latitude,
                longitude: alert.pet.location.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }, 1000);
            }
          }
        },
      ]
    );
  };

  const loadPetsWithLocations = async () => {
    try {
      const lost = await petsService.getLostPets();
      const adoption = await petsService.getAdoptionPets();

      // Filter only pets with location data
      const lostWithLocation = lost.filter(pet => pet.location);
      const adoptionWithLocation = adoption.filter(pet => pet.location);

      setLostPets(lostWithLocation);
      setAdoptionPets(adoptionWithLocation);

      // Start BLE simulation for lost pets only
      if (userLocation && lostWithLocation.length > 0) {
        bleSimulationService.startSimulation(
          lostWithLocation,
          userLocation,
          (updatedPets) => {
            setLostPets(updatedPets);
            // Update nearby pets
            const nearby = bleSimulationService.getNearbyPets(userLocation, updatedPets);
            setNearbyPets(nearby);
          },
          (alert) => {
            sendProximityAlert(alert);
          }
        );
      }
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userLoc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setUserLocation(userLoc);

      const newRegion = {
        ...userLoc,
        latitudeDelta: 0.005, // Zoomed in like Pokemon GO
        longitudeDelta: 0.005,
      };

      setRegion(newRegion);

      // Center map on user
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleRegionChange = (newRegion: Region) => {
    // Limit zoom level (like Pokemon GO)
    const limitedRegion = {
      ...newRegion,
      latitudeDelta: Math.max(MIN_ZOOM_DELTA, Math.min(MAX_ZOOM_DELTA, newRegion.latitudeDelta)),
      longitudeDelta: Math.max(MIN_ZOOM_DELTA, Math.min(MAX_ZOOM_DELTA, newRegion.longitudeDelta)),
    };

    setRegion(limitedRegion);
  };

  const handleMarkerPress = (pet: Pet) => {
    // TODO: Navigate to pet detail screen or show bottom sheet
    Alert.alert(
      pet.name,
      `${pet.status === 'lost' ? 'Perdido' : 'En adopción'}\n${pet.description}`,
      [
        { text: 'Cerrar', style: 'cancel' },
        { text: 'Ver detalles', onPress: () => console.log('Ver detalles:', pet.id) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <TextBasic variant="title" style={styles.title}>
            Mapa de incidencias
          </TextBasic>
          <TextBasic style={styles.subtitle} color="#AAA">
            incidencias de perdida o adopcion en el mapa
          </TextBasic>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={handleRegionChange}
          mapType="satellite"
          showsUserLocation={true}
          showsMyLocationButton={false}
          followsUserLocation={false}
        >
          {/* Detection radius circle */}
          {userLocation && (
            <Circle
              center={userLocation}
              radius={DETECTION_RADIUS}
              fillColor="rgba(200, 230, 77, 0.1)"
              strokeColor="rgba(200, 230, 77, 0.3)"
              strokeWidth={2}
            />
          )}

          {/* Lost pets (moving in real-time) */}
          {lostPets.map((pet) => {
            if (!pet.location) return null;

            // Check if pet is nearby
            const isNearby = nearbyPets.some(n => n.pet.id === pet.id);

            return (
              <Marker
                key={pet.id}
                coordinate={{
                  latitude: pet.location.latitude,
                  longitude: pet.location.longitude,
                }}
                onPress={() => handleMarkerPress(pet)}
              >
                <Animated.View
                  style={[
                    styles.markerContainer,
                    {
                      borderColor: '#FF4444',
                      transform: isNearby ? [{ scale: pulseAnim }] : [],
                    },
                  ]}
                >
                  <Image
                    source={{ uri: pet.image }}
                    style={styles.markerImage}
                  />
                  {isNearby && (
                    <View style={styles.nearbyIndicator}>
                      <Ionicons name="radio" size={12} color="#FFD700" />
                    </View>
                  )}
                </Animated.View>
              </Marker>
            );
          })}

          {/* Adoption pets (static) */}
          {adoptionPets.map((pet) => {
            if (!pet.location) return null;
            return (
              <Marker
                key={pet.id}
                coordinate={{
                  latitude: pet.location.latitude,
                  longitude: pet.location.longitude,
                }}
                onPress={() => handleMarkerPress(pet)}
              >
                <View
                  style={[
                    styles.markerContainer,
                    {
                      borderColor: '#44FF88',
                    },
                  ]}
                >
                  <Image
                    source={{ uri: pet.image }}
                    style={styles.markerImage}
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>

        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
          activeOpacity={0.8}
        >
          <Ionicons name="locate" size={24} color="#000" />
        </TouchableOpacity>

        {/* Nearby Pets Radar Panel */}
        {nearbyPets.length > 0 && (
          <View style={styles.radarPanel}>
            <View style={styles.radarHeader}>
              <Ionicons name="radio" size={20} color="#C8E64D" />
              <TextBasic variant="subtitle" weight="semibold" style={styles.radarTitle}>
                Mascotas perdidas cerca ({nearbyPets.length})
              </TextBasic>
            </View>
            {nearbyPets.slice(0, 3).map((alert) => (
              <TouchableOpacity
                key={alert.pet.id}
                style={styles.radarItem}
                onPress={() => handleMarkerPress(alert.pet)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: alert.pet.image }}
                  style={styles.radarPetImage}
                />
                <View style={styles.radarPetInfo}>
                  <TextBasic weight="semibold" style={styles.radarPetName}>
                    {alert.pet.name}
                  </TextBasic>
                  <View style={styles.radarPetStats}>
                    <Ionicons name="location" size={12} color="#AAA" />
                    <TextBasic style={styles.radarDistance}>
                      {alert.distance}m
                    </TextBasic>
                    <View style={styles.signalStrength}>
                      {[...Array(5)].map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.signalBar,
                            i < Math.ceil(alert.signalStrength / 20) && styles.signalBarActive,
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 20,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
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
  },
  nearbyIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  radarPanel: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#C8E64D',
  },
  radarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  radarTitle: {
    fontSize: 14,
    color: '#FFF',
  },
  radarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  radarPetImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  radarPetInfo: {
    flex: 1,
  },
  radarPetName: {
    fontSize: 14,
    color: '#FFF',
    marginBottom: 4,
  },
  radarPetStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radarDistance: {
    fontSize: 12,
    color: '#AAA',
  },
  signalStrength: {
    flexDirection: 'row',
    gap: 2,
    marginLeft: 8,
  },
  signalBar: {
    width: 3,
    height: 12,
    backgroundColor: '#333',
    borderRadius: 1.5,
  },
  signalBarActive: {
    backgroundColor: '#C8E64D',
  },
});
