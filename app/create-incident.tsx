import { ButtonBasic } from '@/components/ButtonBasic';
import { InputBasic } from '@/components/InputBasic';
import { SelectorBasic } from '@/components/SelectorBasic';
import { TextAreaBasic } from '@/components/TextAreaBasic';
import { TextBasic } from '@/components/TextBasic';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IncidentType = 'lost' | 'adoption';

export default function CreateIncidentScreen() {
  const { user } = useAuth();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentType, setIncidentType] = useState<IncidentType>('lost');
  const [imageUri, setImageUri] = useState<string | null>(null);

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
              setImageUri(result.assets[0].uri);
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
              setImageUri(result.assets[0].uri);
            }
          },
        },
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

  const handleCreateIncident = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Por favor describe la situación');
      return;
    }

    if (!imageUri) {
      Alert.alert('Error', 'Por favor agrega una foto');
      return;
    }

    // TODO: Implement create incident logic
    Alert.alert('Éxito', 'Incidencia creada correctamente', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const getTypeText = () => {
    return incidentType === 'lost' ? 'Pérdida' : 'Adopción';
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
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.cameraImage} />
            ) : (
              <Ionicons name="camera" size={40} color="#C8E64D" />
            )}
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputBasic
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
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

          <ButtonBasic
            title="Crear incidencia"
            onPress={handleCreateIncident}
            variant="primary"
            style={styles.createButton}
          />
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
});
