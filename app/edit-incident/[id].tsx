import { ButtonBasic } from '@/components/ButtonBasic';
import { InputBasic } from '@/components/InputBasic';
import { SelectorBasic } from '@/components/SelectorBasic';
import { TextAreaBasic } from '@/components/TextAreaBasic';
import { TextBasic } from '@/components/TextBasic';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { incidentsService } from '@/services/incidents.service';
import { uploadService } from '@/services/upload.service';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IncidentType = 'lost' | 'adoption';
type PetType = 'dog' | 'cat' | 'other';

export default function EditIncidentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const router = useRouter();

  // Form fields
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<PetType>('dog');
  const [breed, setBreed] = useState('');
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentType>('lost');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIncident();

    // Clean up location when component unmounts
    return () => {
      setSelectedLocation(null);
    };
  }, [id]);

  const loadIncident = async () => {
    try {
      setIsLoading(true);
      const incident = await incidentsService.getIncidentById(id);

      // Pre-fill form with existing data
      setPetName(incident.petName);
      setPetType(incident.petType);
      setBreed(incident.breed || '');
      setDescription(incident.description);
      setIncidentType(incident.incidentType);
      setExistingImageUrls(incident.imageUrls);

      // Set location
      setSelectedLocation({
        latitude: incident.location.coordinates[1],
        longitude: incident.location.coordinates[0],
        address: incident.locationName,
      });
    } catch (error) {
      console.error('Error loading incident:', error);
      Alert.alert(t('common.error'), t('incidents.errorLoading'));
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const handleImagePicker = () => {
    const totalImages = existingImageUrls.length + imageUris.length;
    if (totalImages >= 3) {
      Alert.alert(t('incidents.photoLimit'), t('incidents.photoLimitMessageEditing'));
      return;
    }

    Alert.alert(
      t('incidents.selectImage'),
      t('incidents.selectImageSource'),
      [
        {
          text: t('profile.camera'),
          onPress: async () => {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
              Alert.alert(t('profile.cameraPermissionDenied'), t('profile.cameraPermissionDenied'));
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.8,
            });

            if (!result.canceled) {
              setImageUris(prev => [...prev, result.assets[0].uri]);
            }
          },
        },
        {
          text: t('profile.gallery'),
          onPress: async () => {
            const hasPermission = await requestGalleryPermission();
            if (!hasPermission) {
              Alert.alert(t('profile.galleryPermissionDenied'), t('profile.galleryPermissionDenied'));
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 0.8,
            });

            if (!result.canceled) {
              setImageUris(prev => [...prev, result.assets[0].uri]);
            }
          },
        },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setImageUris(prev => prev.filter((_, i) => i !== index));
  };

  const handlePetTypeSelector = () => {
    Alert.alert(
      t('incidents.petType'),
      t('incidents.petType'),
      [
        { text: t('incidents.dog'), onPress: () => setPetType('dog') },
        { text: t('incidents.cat'), onPress: () => setPetType('cat') },
        { text: t('incidents.other'), onPress: () => setPetType('other') },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const handleTypeSelector = () => {
    Alert.alert(
      t('incidents.incidentType'),
      t('myIncidents.selectTypeMessage'),
      [
        { text: t('incidents.lost'), onPress: () => setIncidentType('lost') },
        { text: t('incidents.adoption'), onPress: () => setIncidentType('adoption') },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const handleLocationPicker = () => {
    router.push('/location-picker');
  };

  const handleUpdateIncident = async () => {
    // Validations
    if (!petName.trim()) {
      Alert.alert(t('common.error'), t('createIncident.errorPetName'));
      return;
    }

    if (!description.trim()) {
      Alert.alert(t('common.error'), t('createIncident.errorDescription'));
      return;
    }

    const totalImages = existingImageUrls.length + imageUris.length;
    if (totalImages === 0) {
      Alert.alert(t('common.error'), t('createIncident.errorPhoto'));
      return;
    }

    if (!selectedLocation) {
      Alert.alert(t('common.error'), t('createIncident.errorLocation'));
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload new images if any
      let uploadedUrls: string[] = [];
      if (imageUris.length > 0) {
        uploadedUrls = await uploadService.uploadMultiple(imageUris);
      }

      // Combine existing and new image URLs
      const allImageUrls = [...existingImageUrls, ...uploadedUrls];

      // Update incident
      await incidentsService.updateIncident(id, {
        petName: petName.trim(),
        description: description.trim(),
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        locationName: selectedLocation.address || 'Ubicación desconocida',
      });

      Alert.alert(t('common.success'), t('incidents.updateSuccess'), [
        {
          text: t('common.ok'),
          onPress: () => {
            setSelectedLocation(null);
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('Error updating incident:', error);
      Alert.alert(
        t('common.error'),
        error instanceof Error ? error.message : t('incidents.errorUpdating')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeText = () => {
    return incidentType === 'lost' ? t('incidents.lost') : t('incidents.adoption');
  };

  const getPetTypeText = () => {
    const types = { dog: t('incidents.dog'), cat: t('incidents.cat'), other: t('incidents.other') };
    return types[petType];
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C8E64D" />
          <TextBasic style={styles.loadingText}>{t('editIncident.loadingIncident')}</TextBasic>
        </View>
      </SafeAreaView>
    );
  }

  const allImages = [...existingImageUrls, ...imageUris];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
            <TextBasic variant="title" style={styles.greeting}>
              {t('editIncident.title')}
            </TextBasic>
            <TextBasic style={styles.subtitle} color="#C8E64D">
              {t('editIncident.subtitle')}
            </TextBasic>
          </View>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={require('@/assets/images/dog create incident.png')}
            style={styles.dogIllustration}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleImagePicker}
            activeOpacity={0.8}
          >
            {allImages.length > 0 ? (
              <Image source={{ uri: allImages[0] }} style={styles.cameraImage} />
            ) : (
              <Ionicons name="camera" size={40} color="#C8E64D" />
            )}
          </TouchableOpacity>
        </View>

        {/* Additional images preview */}
        {allImages.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imagePreviewContent}>
              {existingImageUrls.map((uri, index) => (
                <View key={`existing-${index}`} style={styles.imagePreview}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveExistingImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              ))}
              {imageUris.map((uri, index) => (
                <View key={`new-${index}`} style={styles.imagePreview}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveNewImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF4444" />
                  </TouchableOpacity>
                  <View style={styles.newBadge}>
                    <TextBasic style={styles.newBadgeText}>{t('editIncident.newImage')}</TextBasic>
                  </View>
                </View>
              ))}
              {allImages.length < 3 && (
                <TouchableOpacity
                  style={styles.addMoreButton}
                  onPress={handleImagePicker}
                >
                  <Ionicons name="add" size={30} color="#C8E64D" />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <InputBasic
            placeholder={t('incidents.petName')}
            value={petName}
            onChangeText={setPetName}
          />

          <SelectorBasic
            value={`${t('incidents.petType')}: ${getPetTypeText()}`}
            onPress={handlePetTypeSelector}
          />

          <InputBasic
            placeholder={t('incidents.breed')}
            value={breed}
            onChangeText={setBreed}
          />

          <TextAreaBasic
            placeholder={t('incidents.descriptionPlaceholder')}
            value={description}
            onChangeText={setDescription}
            numberOfLines={4}
          />

          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleLocationPicker}
            activeOpacity={0.8}
          >
            <TextBasic style={styles.locationText}>
              {selectedLocation?.address || t('incidents.selectLocationMap')}
            </TextBasic>
          </TouchableOpacity>

          <SelectorBasic
            value={`${t('incidents.incidentType')}: ${getTypeText()}`}
            onPress={handleTypeSelector}
          />

          <ButtonBasic
            title={isSubmitting ? t('editIncident.updating') : t('editIncident.updateButton')}
            onPress={handleUpdateIncident}
            variant="primary"
            style={styles.createButton}
            disabled={isSubmitting}
          />

          {isSubmitting && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#C8E64D" />
              <TextBasic style={styles.loadingText}>
                {t('incidents.updatingIncident')}
              </TextBasic>
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
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
  greeting: {
    fontSize: 24,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
  },
  imageSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  dogIllustration: {
    width: 180,
    height: 180,
  },
  cameraButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#C8E64D',
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cameraImage: {
    width: '100%',
    height: '100%',
  },
  form: {
    paddingHorizontal: 20,
    gap: 15,
    paddingBottom: 40,
  },
  locationButton: {
    width: '100%',
    minHeight: 50,
    borderWidth: 2,
    borderColor: '#C8E64D',
    borderRadius: 25,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#FFF',
  },
  createButton: {
    marginTop: 20,
  },
  imagePreviewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  imagePreviewContent: {
    paddingRight: 20,
  },
  imagePreview: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#000',
    borderRadius: 12,
  },
  addMoreButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C8E64D',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#C8E64D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#AAA',
    fontSize: 14,
  },
});
