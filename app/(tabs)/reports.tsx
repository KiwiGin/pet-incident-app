import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextBasic } from '@/components/TextBasic';
import { SelectorBasic } from '@/components/SelectorBasic';
import { PetCardComponent } from '@/components/PetCardComponent';
import { petsService } from '@/services/pets.service';
import { useAuth } from '@/contexts/AuthContext';
import { Pet } from '@/types';

type IncidentType = 'all' | 'lost' | 'adoption';

export default function MyIncidentsScreen() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<IncidentType>('all');

  useEffect(() => {
    if (user) {
      loadIncidents();
    }
  }, [user, selectedType]);

  const loadIncidents = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const type = selectedType === 'all' ? undefined : selectedType;
      const incidents = await petsService.getUserIncidents(user.id, type);
      setPets(incidents);
    } catch (error) {
      console.error('Error loading incidents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectorPress = () => {
    Alert.alert(
      'Tipo de incidencia',
      'Seleccione el tipo de incidencia',
      [
        { text: 'Todas', onPress: () => setSelectedType('all') },
        { text: 'Pérdidas', onPress: () => setSelectedType('lost') },
        { text: 'Adopciones', onPress: () => setSelectedType('adoption') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const getSelectorText = () => {
    switch (selectedType) {
      case 'all':
        return 'Tipo de incidencia';
      case 'lost':
        return 'Pérdidas';
      case 'adoption':
        return 'Adopciones';
      default:
        return 'Tipo de incidencia';
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <TextBasic variant="title">Mis incidencias</TextBasic>
          <TextBasic style={styles.emptyText}>
            Inicia sesión para ver tus incidencias
          </TextBasic>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextBasic variant="title" style={styles.title}>
          Mis incidencias
        </TextBasic>
        <TextBasic style={styles.subtitle} color="#AAA">
          Vea sus incidencias de perdidas o adopciones
        </TextBasic>

        <SelectorBasic
          value={getSelectorText()}
          onPress={handleSelectorPress}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C8E64D" />
        </View>
      ) : pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <TextBasic style={styles.emptyText}>
            No tienes incidencias registradas
          </TextBasic>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PetCardComponent
              pet={item}
              showFavorite={false}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    gap: 15,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
  }
});
