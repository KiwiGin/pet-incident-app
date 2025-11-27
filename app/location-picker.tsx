import { ButtonBasic } from '@/components/ButtonBasic';
import { TextBasic } from '@/components/TextBasic';
import { useLocation } from '@/contexts/LocationContext';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export default function LocationPickerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setSelectedLocation: setContextLocation } = useLocation();

  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: -12.0464,
    longitude: -77.0428,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setRegion(newRegion);
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación actual');
    }
  };

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    try {
      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = addressResult
        ? `${addressResult.street || ''} ${addressResult.district || ''}, ${addressResult.city || ''}`
        : 'Ubicación seleccionada';

      setSelectedLocation({
        latitude,
        longitude,
        address: address.trim(),
      });
    } catch (error) {
      console.error('Error getting address:', error);
      setSelectedLocation({
        latitude,
        longitude,
        address: 'Ubicación seleccionada',
      });
    }
  };

  const handleConfirm = () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Por favor selecciona una ubicación en el mapa');
      return;
    }

    // Save location to context
    setContextLocation(selectedLocation);

    // Navigate back with location data
    router.back();
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
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <TextBasic variant="title" style={styles.title}>
            Seleccionar ubicación
          </TextBasic>
          <TextBasic style={styles.subtitle} color="#AAA">
            Toca en el mapa para seleccionar
          </TextBasic>
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              pinColor="#C8E64D"
            />
          )}
        </MapView>
      </View>

      {/* Location Info */}
      {selectedLocation && (
        <View style={styles.locationInfo}>
          <Ionicons name="location" size={24} color="#C8E64D" />
          <View style={styles.locationTextContainer}>
            <TextBasic variant="subtitle" weight="semibold">
              Ubicación seleccionada
            </TextBasic>
            <TextBasic style={styles.address} color="#AAA">
              {selectedLocation.address || `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`}
            </TextBasic>
          </View>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
          activeOpacity={0.8}
        >
          <Ionicons name="locate" size={24} color="#C8E64D" />
          <TextBasic style={styles.currentLocationText}>
            Mi ubicación actual
          </TextBasic>
        </TouchableOpacity>

        <ButtonBasic
          title="Confirmar ubicación"
          onPress={handleConfirm}
          variant="primary"
        />
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
    backgroundColor: '#2A2A2A',
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
    borderWidth: 2,
    borderColor: '#C8E64D',
  },
  map: {
    flex: 1,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    gap: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  address: {
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  currentLocationText: {
    fontSize: 16,
    color: '#C8E64D',
  },
});
