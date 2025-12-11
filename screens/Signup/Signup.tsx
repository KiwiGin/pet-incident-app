import React, { useState } from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { InputBasic } from '../../components/InputBasic';
import { ButtonBasic } from '../../components/ButtonBasic';
import { TextBasic } from '../../components/TextBasic';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, isLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(t('common.error'), t('auth.fillAllRequiredFields'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordsDoNotMatch'));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t('common.error'), t('auth.passwordMinLength'));
      return;
    }

    try {
      await signup({ name, email, password, phone });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        t('auth.signupFailed'),
        error instanceof Error ? error.message : t('auth.errorOccurred')
      );
    }
  };

  const handleLogin = () => {
    router.back();
  };

  return (
    <ImageBackground
      source={require('../../assets/images/dog login.png')}
      style={styles.background}
      blurRadius={3}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <TextBasic variant="title" style={styles.title} color="#C8E64D">
              {t('auth.signup')}
            </TextBasic>

            <View style={styles.inputsContainer}>
              <InputBasic
                placeholder={t('auth.fullName')}
                value={name}
                onChangeText={setName}
              />

              <InputBasic
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputBasic
                placeholder={t('auth.phoneOptional')}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <InputBasic
                placeholder={t('auth.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <InputBasic
                placeholder={t('auth.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <ButtonBasic
              title={t('auth.signUp')}
              onPress={handleSignup}
              loading={isLoading}
              style={styles.signupButton}
            />

            <View style={styles.loginContainer}>
              <TextBasic color="#FFF">{t('auth.alreadyHaveAccount')} </TextBasic>
              <TouchableOpacity onPress={handleLogin}>
                <TextBasic weight="semibold" color="#C8E64D">
                  {t('auth.login')}
                </TextBasic>
              </TouchableOpacity>
            </View>
          </View>

          <Image
            source={require('../../assets/images/cat login.png')}
            style={styles.catImage}
            resizeMode="contain"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  formContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 30,
    padding: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    marginBottom: 30,
    textAlign: 'center',
  },
  inputsContainer: {
    width: '100%',
    gap: 20,
    marginBottom: 20,
  },
  signupButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catImage: {
    width: 200,
    height: 150,
    alignSelf: 'center',
  }
});
