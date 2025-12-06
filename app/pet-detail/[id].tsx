import { ButtonBasic } from '@/components/ButtonBasic';
import { TextBasic } from '@/components/TextBasic';
import { petsService } from '@/services/pets.service';
import { Pet } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

type TabType = 'description' | 'location';

export default function PetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('description');

  useEffect(() => {
    loadPetDetails();
  }, [id]);

  const loadPetDetails = async () => {
    try {
      setIsLoading(true);
      const petData = await petsService.getPetById(id);
      setPet(petData);
    } catch (error) {
      console.error('Error loading pet details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!pet) return null;

    const config = {
      lost: { text: 'Lost', color: '#FF4444' },
      found: { text: 'Found', color: '#44FF88' },
      adoption: { text: 'Adoption', color: '#44FF88' },
    };

    const badge = config[pet.status];

    return (
      <View style={[styles.statusBadge, { backgroundColor: badge.color }]}>
        <TextBasic weight="bold" style={styles.statusText}>
          {badge.text}
        </TextBasic>
      </View>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C8E64D" />
        </View>
      </SafeAreaView>
    );
  }

  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <TextBasic>Pet not found</TextBasic>
          <ButtonBasic
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Pet Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: pet.image }} style={styles.petImage} />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Status Badge */}
          <View style={styles.statusBadgeContainer}>{getStatusBadge()}</View>
        </View>

        {/* Pet Info */}
        <View style={styles.infoContainer}>
          {/* Name */}
          <TextBasic variant="title" weight="bold" style={styles.petName}>
            {pet.name}
          </TextBasic>

          {/* Contact Info */}
          <View style={styles.contactContainer}>
            <TextBasic style={styles.contactText} color="#C8E64D">
              By {pet.reportedBy}
            </TextBasic>
            <TextBasic style={styles.contactText} color="#C8E64D">
              contact : 99999999
            </TextBasic>
          </View>

          {/* Published Date */}
          <TextBasic style={styles.dateText} color="#AAA">
            Publised {formatDate(pet.reportedAt)}
          </TextBasic>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'description' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('description')}
              activeOpacity={0.7}
            >
              <TextBasic
                weight={activeTab === 'description' ? 'bold' : 'regular'}
                style={[
                  styles.tabText,
                  activeTab === 'description' && styles.tabTextActive,
                ]}
              >
                Description
              </TextBasic>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'location' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('location')}
              activeOpacity={0.7}
            >
              <TextBasic
                weight={activeTab === 'location' ? 'bold' : 'regular'}
                style={[
                  styles.tabText,
                  activeTab === 'location' && styles.tabTextActive,
                ]}
              >
                Location
              </TextBasic>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'description' ? (
              <View style={styles.descriptionContainer}>
                <TextBasic style={styles.descriptionText}>
                  {pet.description}
                </TextBasic>

                {/* Additional Info for Adoption */}
                {pet.status === 'adoption' && (
                  <View style={styles.additionalInfo}>
                    {pet.age && (
                      <View style={styles.infoRow}>
                        <Ionicons name="calendar" size={20} color="#C8E64D" />
                        <TextBasic style={styles.infoLabel}>Age:</TextBasic>
                        <TextBasic style={styles.infoValue}>{pet.age}</TextBasic>
                      </View>
                    )}
                    {pet.gender && (
                      <View style={styles.infoRow}>
                        <Ionicons
                          name={pet.gender === 'male' ? 'male' : 'female'}
                          size={20}
                          color="#C8E64D"
                        />
                        <TextBasic style={styles.infoLabel}>Gender:</TextBasic>
                        <TextBasic style={styles.infoValue}>
                          {pet.gender === 'male' ? 'Male' : 'Female'}
                        </TextBasic>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.locationContainer}>
                {pet.location ? (
                  <>
                    <View style={styles.mapContainer}>
                      <MapView
                        style={styles.map}
                        initialRegion={{
                          latitude: pet.location.latitude,
                          longitude: pet.location.longitude,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        }}
                      >
                        <Marker
                          coordinate={{
                            latitude: pet.location.latitude,
                            longitude: pet.location.longitude,
                          }}
                          pinColor={pet.status === 'lost' ? '#FF4444' : '#44FF88'}
                        />
                      </MapView>
                    </View>
                    {pet.location.address && (
                      <View style={styles.addressContainer}>
                        <Ionicons name="location" size={24} color="#C8E64D" />
                        <TextBasic style={styles.addressText}>
                          {pet.location.address}
                        </TextBasic>
                      </View>
                    )}
                  </>
                ) : (
                  <TextBasic color="#AAA" style={styles.noLocationText}>
                    Location not available
                  </TextBasic>
                )}
              </View>
            )}
          </View>

          {/* Contact Button */}
          <View style={styles.buttonContainer}>
            <ButtonBasic
              title={pet.status === 'adoption' ? 'Adopt Me' : 'Contact Owner'}
              onPress={() => console.log('Contact owner')}
              variant="primary"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  imageContainer: {
    width: '100%',
    height: width * 1.2,
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
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
  statusBadgeContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#FFF',
    textTransform: 'uppercase',
  },
  infoContainer: {
    backgroundColor: '#000',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  petName: {
    fontSize: 28,
    marginBottom: 12,
  },
  contactContainer: {
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 24,
  },
  tab: {
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#C8E64D',
  },
  tabText: {
    fontSize: 16,
    color: '#AAA',
  },
  tabTextActive: {
    color: '#C8E64D',
  },
  tabContent: {
    minHeight: 200,
  },
  descriptionContainer: {
    gap: 20,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#CCC',
  },
  additionalInfo: {
    gap: 12,
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#AAA',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFF',
  },
  locationContainer: {
    gap: 16,
  },
  mapContainer: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#C8E64D',
  },
  map: {
    flex: 1,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#FFF',
  },
  noLocationText: {
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 40,
  },
  buttonContainer: {
    marginTop: 32,
  },
});
