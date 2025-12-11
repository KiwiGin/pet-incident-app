import { ButtonBasic } from '@/components/ButtonBasic';
import { InputBasic } from '@/components/InputBasic';
import { SelectorBasic } from '@/components/SelectorBasic';
import { TextAreaBasic } from '@/components/TextAreaBasic';
import { TextBasic } from '@/components/TextBasic';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
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
      Alert.alert('Límite alcanzado', 'Puedes agregar hasta 3 imágenes');
      return;
    }

    Alert.alert(
      'Seleccionar imagen',
      '¿Cómo deseas agregar la foto?',
      [
        {
          text: 'Cámara',
          onPress: async () => {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
              Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la cámara');
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
          text: 'Galería',
          onPress: async () => {
            const hasPermission = await requestGalleryPermission();
            if (!hasPermission) {
              Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería');
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
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleRemoveImage = (index: number) => {
    setImageUris(prev => prev.filter((_, i) => i !== index));
  };

  const handlePetTypeSelector = () => {
    Alert.alert(
      'Tipo de mascota',
      'Seleccione el tipo de mascota',
      [
        { text: 'Perro', onPress: () => setPetType('dog') },
        { text: 'Gato', onPress: () => setPetType('cat') },
        { text: 'Otro', onPress: () => setPetType('other') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleTypeSelector = () => {
    Alert.alert(
      'Tipo de incidencia',
      'Seleccione el tipo de incidencia',
      [
        { text: 'Pérdida', onPress: () => setIncidentType('lost') },
        { text: 'Adopción', onPress: () => setIncidentType('adoption') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleLocationPicker = () => {
    router.push('/location-picker');
  };

  const handleCreateIncident = async () => {
    // Validations
    if (!petName.trim()) {
      Alert.alert('Error', 'Por favor ingresa el nombre de la mascota');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Por favor describe la situación');
      return;
    }

    if (imageUris.length === 0) {
      Alert.alert('Error', 'Por favor agrega al menos una foto');
      return;
    }

    if (!selectedLocation) {
      Alert.alert('Error', 'Por favor selecciona una ubicación en el mapa');
      return;
    }

    if (!contactPhone.trim()) {
      Alert.alert('Error', 'Por favor ingresa un número de contacto');
      return;
    }

    if (!contactEmail.trim()) {
      Alert.alert('Error', 'Por favor ingresa un email de contacto');
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

      Alert.alert('Éxito', 'Incidencia creada correctamente', [
        {
          text: 'OK',
          onPress: () => {
            setSelectedLocation(null);
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('Error creating incident:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'No se pudo crear la incidencia'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeText = () => {
    return incidentType === 'lost' ? 'Pérdida' : 'Adopción';
  };

  const getPetTypeText = () => {
    const types = { dog: 'Perro', cat: 'Gato', other: 'Otro' };
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
          >
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <TextBasic variant="title" style={styles.greeting}>
              Hello {user?.name || 'User'}
            </TextBasic>
            <TextBasic style={styles.subtitle} color="#C8E64D">
              Crea tu incidencia de perdida o adopcion
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
            {imageUris.length > 0 ? (
              <Image source={{ uri: imageUris[0] }} style={styles.cameraImage} />
            ) : (
              <Ionicons name="camera" size={40} color="#C8E64D" />
            )}
          </TouchableOpacity>

          {/* Additional images preview */}
          {imageUris.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {imageUris.map((uri, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <Image source={{ uri }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
                {imageUris.length < 3 && (
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
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputBasic
            placeholder="Nombre de la mascota"
            value={petName}
            onChangeText={setPetName}
          />

          <SelectorBasic
            value={`Tipo de mascota: ${getPetTypeText()}`}
            onPress={handlePetTypeSelector}
          />

          <InputBasic
            placeholder="Raza (opcional)"
            value={breed}
            onChangeText={setBreed}
          />

          <TextAreaBasic
            placeholder="Shortly describe your situation"
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
              {selectedLocation?.address || 'select location on the map'}
            </TextBasic>
          </TouchableOpacity>

          <SelectorBasic
            value={`Tipo de incidencia: ${getTypeText()}`}
            onPress={handleTypeSelector}
          />

          <InputBasic
            placeholder="Teléfono de contacto"
            value={contactPhone}
            onChangeText={setContactPhone}
            keyboardType="phone-pad"
          />

          <InputBasic
            placeholder="Email de contacto"
            value={contactEmail}
            onChangeText={setContactEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <ButtonBasic
            title={isSubmitting ? "Creando..." : "Crear incidencia"}
            onPress={handleCreateIncident}
            variant="primary"
            style={styles.createButton}
            disabled={isSubmitting}
          />

          {isSubmitting && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#C8E64D" />
              <TextBasic style={styles.loadingText}>
                Subiendo imágenes y creando incidencia...
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
    marginTop: 15,
    paddingHorizontal: 20,
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
