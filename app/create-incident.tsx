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
import { useRouter } from 'expo-router';
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

export default function CreateIncidentScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const router = useRouter();

  // Form fields matching API requirements
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState<PetType>('dog');
  const [breed, setBreed] = useState('');
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentType>('lost');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clean up location when component unmounts
    return () => {
      setSelectedLocation(null);
    };
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const handleImagePicker = () => {
    if (imageUris.length >= 3) {
      Alert.alert(t('incidents.photoLimit'), t('incidents.photoLimitMessage'));
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

  const handleRemoveImage = (index: number) => {
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

  const handleCreateIncident = async () => {
    // Validations
    if (!petName.trim()) {
      Alert.alert(t('common.error'), t('createIncident.errorPetName'));
      return;
    }

    if (!description.trim()) {
      Alert.alert(t('common.error'), t('createIncident.errorDescription'));
      return;
    }

    if (imageUris.length === 0) {
      Alert.alert(t('common.error'), t('createIncident.errorPhoto'));
      return;
    }

    if (!selectedLocation) {
      Alert.alert(t('common.error'), t('createIncident.errorLocation'));
      return;
    }

    if (!contactPhone.trim()) {
      Alert.alert(t('common.error'), t('createIncident.errorPhone'));
      return;
    }

    if (!contactEmail.trim()) {
      Alert.alert(t('common.error'), t('createIncident.errorEmail'));
      return;
    }

    try {
      setIsSubmitting(true);

      // Step 1: Upload images to Cloudinary
      const uploadedUrls = await uploadService.uploadMultiple(imageUris);

      // Step 2: Create incident
      await incidentsService.createIncident({
        incidentType,
        petName: petName.trim(),
        petType,
        breed: breed.trim() || undefined,
        description: description.trim(),
        imageUrls: uploadedUrls,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        locationName: selectedLocation.address || 'Ubicación desconocida',
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
      });

      Alert.alert(t('common.success'), t('incidents.createSuccess'), [
        {
          text: t('common.ok'),
          onPress: () => {
            setSelectedLocation(null);
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('Error creating incident:', error);
      Alert.alert(
        t('common.error'),
        error instanceof Error ? error.message : t('incidents.errorLoading')
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.backButton')}
            accessibilityHint={t('accessibility.backButtonHint')}
          >
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <TextBasic variant="title" style={styles.greeting}>
              {t('incidents.hello')} {user?.name || 'User'}
            </TextBasic>
            <TextBasic style={styles.subtitle} color="#C8E64D">
              {t('createIncident.subtitle')}
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
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.imageButton')}
            accessibilityHint={t('accessibility.imageButtonHint')}
          >
            {imageUris.length > 0 ? (
              <Image
                source={{ uri: imageUris[0] }}
                style={styles.cameraImage}
                accessible={true}
                accessibilityLabel={t('accessibility.petImage')}
                accessibilityRole="image"
              />
            ) : (
              <Ionicons name="camera" size={40} color="#C8E64D" />
            )}
          </TouchableOpacity>
        </View>

        {/* Additional images preview - moved outside to fix layout */}
        {imageUris.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imagePreviewContent}>
              {imageUris.map((uri, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={t('accessibility.removeImageButton')}
                    accessibilityHint={t('accessibility.removeImageButtonHint')}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              ))}
              {imageUris.length < 3 && (
                <TouchableOpacity
                  style={styles.addMoreButton}
                  onPress={handleImagePicker}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={t('incidents.addPhoto')}
                  accessibilityHint={t('accessibility.imageButtonHint')}
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
            accessibilityLabel={t('incidents.petName')}
          />

          <SelectorBasic
            value={`${t('incidents.petType')}: ${getPetTypeText()}`}
            onPress={handlePetTypeSelector}
          />

          <InputBasic
            placeholder={t('incidents.breed')}
            value={breed}
            onChangeText={setBreed}
            accessibilityLabel={t('incidents.breed')}
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
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${t('incidents.location')}: ${selectedLocation?.address || t('incidents.selectLocationMap')}`}
            accessibilityHint={t('accessibility.mapButtonHint')}
          >
            <TextBasic style={styles.locationText}>
              {selectedLocation?.address || t('incidents.selectLocationMap')}
            </TextBasic>
          </TouchableOpacity>

          <SelectorBasic
            value={`${t('incidents.incidentType')}: ${getTypeText()}`}
            onPress={handleTypeSelector}
          />

          <InputBasic
            placeholder={t('incidents.contactPhone')}
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
            accessibilityLabel={t('incidents.contactPhone')}
          />

          <InputBasic
            placeholder={t('incidents.contactEmail')}
            value={contactEmail}
            onChangeText={setContactEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel={t('incidents.contactEmail')}
          />

          <ButtonBasic
            title={isSubmitting ? t('incidents.creating') : t('incidents.create')}
            onPress={handleCreateIncident}
            variant="primary"
            style={styles.createButton}
            disabled={isSubmitting}
            accessibilityLabel={t('accessibility.submitButton')}
            accessibilityHint={t('accessibility.submitButtonHint')}
          />

          {isSubmitting && (
            <View
              style={styles.loadingContainer}
              accessible={true}
              accessibilityLabel={t('incidents.uploadingImages')}
            >
              <ActivityIndicator size="large" color="#C8E64D" />
              <TextBasic style={styles.loadingText}>
                {t('incidents.uploadingImages')}
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
