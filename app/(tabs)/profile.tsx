import { ButtonBasic } from '@/components/ButtonBasic';
import { TextBasic } from '@/components/TextBasic';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { uploadService } from '@/services/upload.service';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout, updateUserProfile } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      t('profile.logoutConfirm'),
      t('profile.logoutMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleChangePhoto = () => {
    Alert.alert(
      t('profile.changePhoto'),
      t('profile.selectPhotoSource'),
      [
        {
          text: t('profile.camera'),
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert(t('common.error'), t('profile.cameraPermissionDenied'));
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled) {
              await uploadPhoto(result.assets[0].uri);
            }
          },
        },
        {
          text: t('profile.gallery'),
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert(t('common.error'), t('profile.galleryPermissionDenied'));
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled) {
              await uploadPhoto(result.assets[0].uri);
            }
          },
        },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const uploadPhoto = async (uri: string) => {
    try {
      setIsUpdatingPhoto(true);
      const uploadedUrl = await uploadService.uploadSingle(uri);
      await updateUserProfile({ avatar: uploadedUrl });
      Alert.alert(t('common.success'), t('profile.photoUpdated'));
    } catch (error) {
      console.error('Error updating photo:', error);
      Alert.alert(t('common.error'), t('profile.photoUpdateError'));
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleLanguageChange = (lang: 'es' | 'en') => {
    setLanguage(lang);
    setSettingsModalVisible(false);
    Alert.alert(t('common.success'), t('settings.languageChanged'));
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <TextBasic variant="title">{t('profile.title')}</TextBasic>
          <TextBasic style={styles.subtitle}>
            {t('profile.loginPrompt')}
          </TextBasic>
          <ButtonBasic
            title={t('auth.login')}
            onPress={() => router.push('/login')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.greenBackground} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Settings Button */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setSettingsModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>

          {/* Avatar */}
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleChangePhoto}
            disabled={isUpdatingPhoto}
            activeOpacity={0.8}
          >
            <Image
              source={
                user.avatar
                  ? { uri: user.avatar }
                  : require('@/assets/images/avatar_default.png')
              }
              style={styles.avatar}
            />
            {isUpdatingPhoto && (
              <View style={styles.avatarLoader}>
                <ActivityIndicator size="large" color="#C8E64D" />
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.nameContainer}>
            <TextBasic variant="title" style={styles.userName}>
              {user.name}
            </TextBasic>
            <Ionicons name="star" size={24} color="#C8E64D" />
          </View>

          <View style={styles.infoCard}>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Ionicons name="call" size={20} color="#C8E64D" />
                <TextBasic style={styles.fieldLabel}>{t('profile.phone')}</TextBasic>
              </View>
              <TextBasic style={styles.fieldValue}>{user.phone}</TextBasic>
            </View>

            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Ionicons name="mail" size={20} color="#C8E64D" />
                <TextBasic style={styles.fieldLabel}>{t('profile.email')}</TextBasic>
              </View>
              <TextBasic style={styles.fieldValue}>{user.email}</TextBasic>
            </View>
          </View>

          <ButtonBasic
            title={t('profile.logout')}
            onPress={handleLogout}
            variant="primary"
          />

          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationCircle}>
              <Image
                source={require('@/assets/images/dog selection profile.png')}
                style={styles.dogIllustration}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Settings Modal */}
      <Modal
        visible={settingsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TextBasic variant="title" style={styles.modalTitle}>
                {t('settings.title')}
              </TextBasic>
              <TouchableOpacity
                onPress={() => setSettingsModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.settingsSection}>
              <TextBasic style={styles.sectionTitle} weight="semibold">
                {t('settings.language')}
              </TextBasic>
              <TextBasic style={styles.sectionSubtitle} color="#AAA">
                {t('settings.selectLanguage')}
              </TextBasic>

              <View style={styles.languageOptions}>
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === 'es' && styles.languageOptionActive,
                  ]}
                  onPress={() => handleLanguageChange('es')}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageInfo}>
                    <TextBasic style={styles.languageFlag}>🇪🇸</TextBasic>
                    <TextBasic
                      style={styles.languageName}
                      weight={language === 'es' ? 'semibold' : 'normal'}
                    >
                      Español
                    </TextBasic>
                  </View>
                  {language === 'es' && (
                    <Ionicons name="checkmark-circle" size={24} color="#C8E64D" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === 'en' && styles.languageOptionActive,
                  ]}
                  onPress={() => handleLanguageChange('en')}
                  activeOpacity={0.7}
                >
                  <View style={styles.languageInfo}>
                    <TextBasic style={styles.languageFlag}>🇺🇸</TextBasic>
                    <TextBasic
                      style={styles.languageName}
                      weight={language === 'en' ? 'semibold' : 'normal'}
                    >
                      English
                    </TextBasic>
                  </View>
                  {language === 'en' && (
                    <Ionicons name="checkmark-circle" size={24} color="#C8E64D" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  greenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: '#C8E64D',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#C8E64D',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  avatarContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  avatarLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C8E64D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
  },
  userName: {
    fontSize: 24,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    padding: 20,
    gap: 18,
    marginBottom: 25,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#AAA',
  },
  fieldValue: {
    fontSize: 16,
    color: '#FFF',
    paddingLeft: 28,
  },
  illustrationContainer: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  illustrationCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  dogIllustration: {
    width: '100%',
    height: '100%',
  },
  subtitle: {
    fontSize: 18,
    color: '#CCC',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 24,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsSection: {
    gap: 15,
  },
  sectionTitle: {
    fontSize: 18,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  languageOptions: {
    gap: 12,
    marginTop: 10,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionActive: {
    borderColor: '#C8E64D',
    backgroundColor: '#2A2A2A',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  languageFlag: {
    fontSize: 32,
  },
  languageName: {
    fontSize: 16,
    color: '#FFF',
  },
});
