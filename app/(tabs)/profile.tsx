import { ButtonBasic } from '@/components/ButtonBasic';
import { TextBasic } from '@/components/TextBasic';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <TextBasic variant="title">Perfil</TextBasic>
          <TextBasic style={styles.subtitle}>
            Inicia sesión para ver tu perfil
          </TextBasic>
          <ButtonBasic
            title="Iniciar sesión"
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
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/avatar_default.png')}
              style={styles.avatar}
            />
          </View>

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
                <TextBasic style={styles.fieldLabel}>Phone Mobile</TextBasic>
              </View>
              <TextBasic style={styles.fieldValue}>+51 987 654 321</TextBasic>
            </View>

            <View style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Ionicons name="mail" size={20} color="#C8E64D" />
                <TextBasic style={styles.fieldLabel}>Email</TextBasic>
              </View>
              <TextBasic style={styles.fieldValue}>{user.email}</TextBasic>
            </View>
          </View>

          <ButtonBasic
            title="log out"
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
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
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
  }
});
