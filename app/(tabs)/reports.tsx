import { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { TextBasic } from '@/components/TextBasic';
import { SelectorBasic } from '@/components/SelectorBasic';
import { PetCardComponent } from '@/components/PetCardComponent';
import { incidentsService, Incident } from '@/services/incidents.service';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

type IncidentType = 'all' | 'lost' | 'adoption';

export default function MyIncidentsScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<IncidentType>('all');

  useEffect(() => {
    if (user) {
      loadIncidents();
    }
  }, [user, selectedType]);

  // Refresh when screen comes into focus (e.g., after editing or deleting)
  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadIncidents();
      }
    }, [user, selectedType])
  );

  const loadIncidents = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const result = await incidentsService.getMyIncidents({
        status: 'active',
        page: 1,
        limit: 50,
      });

      // Filter by type if not 'all'
      let filteredIncidents = result.incidents;
      if (selectedType !== 'all') {
        filteredIncidents = result.incidents.filter(
          (incident) => incident.incidentType === selectedType
        );
      }

      setIncidents(filteredIncidents);
    } catch (error) {
      console.error('Error loading incidents:', error);
      Alert.alert(t('common.error'), t('myIncidents.errorLoading'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string, petName: string) => {
    Alert.alert(
      t('myIncidents.deleteConfirm'),
      `${t('myIncidents.deleteMessage')} ${petName}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('myIncidents.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await incidentsService.deleteIncident(id);
              Alert.alert(t('common.success'), t('myIncidents.deleted'));
              loadIncidents();
            } catch (error) {
              console.error('Error deleting incident:', error);
              Alert.alert(t('common.error'), t('myIncidents.errorDeleting'));
            }
          },
        },
      ]
    );
  };

  const handleEdit = (id: string) => {
    router.push(`/edit-incident/${id}` as any);
  };

  const handleSelectorPress = () => {
    Alert.alert(
      t('myIncidents.selectType'),
      t('myIncidents.selectTypeMessage'),
      [
        { text: t('myIncidents.all'), onPress: () => setSelectedType('all') },
        { text: t('myIncidents.lost'), onPress: () => setSelectedType('lost') },
        { text: t('myIncidents.adoption'), onPress: () => setSelectedType('adoption') },
        { text: t('common.cancel'), style: 'cancel' }
      ]
    );
  };

  const getSelectorText = () => {
    switch (selectedType) {
      case 'all':
        return t('myIncidents.selectType');
      case 'lost':
        return t('myIncidents.lost');
      case 'adoption':
        return t('myIncidents.adoption');
      default:
        return t('myIncidents.selectType');
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <TextBasic variant="title">{t('myIncidents.title')}</TextBasic>
          <TextBasic style={styles.emptyText}>
            {t('myIncidents.loginPrompt')}
          </TextBasic>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextBasic variant="title" style={styles.title}>
          {t('myIncidents.title')}
        </TextBasic>
        <TextBasic style={styles.subtitle} color="#AAA">
          {t('incidents.viewIncidents')}
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
      ) : incidents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <TextBasic style={styles.emptyText}>
            {t('myIncidents.noIncidents')}
          </TextBasic>
        </View>
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <PetCardComponent
                pet={item}
                showFavorite={false}
                onPress={() => handleEdit(item._id)}
              />
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEdit(item._id)}
                >
                  <Ionicons name="create-outline" size={20} color="#FFF" />
                  <TextBasic style={styles.actionButtonText}>{t('myIncidents.edit')}</TextBasic>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item._id, item.petName)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                  <TextBasic style={styles.actionButtonText}>{t('myIncidents.delete')}</TextBasic>
                </TouchableOpacity>
              </View>
            </View>
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
  },
  cardContainer: {
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#4A90E2',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
