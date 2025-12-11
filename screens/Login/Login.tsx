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

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.fillAllFields'));
      return;
    }

    try {
      await login({ email, password });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        t('auth.loginFailed'),
        error instanceof Error ? error.message : t('auth.invalidCredentials')
      );
    }
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  const handleForgotPassword = () => {
    Alert.alert(t('auth.forgotPassword'), t('auth.passwordRecovery'));
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
              {t('auth.login')}
            </TextBasic>

            <View style={styles.inputsContainer}>
              <InputBasic
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputBasic
                placeholder={t('auth.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity onPress={handleForgotPassword}>
                <TextBasic style={styles.forgotPassword} color="#AAA">
                  {t('auth.forgotPassword')}
                </TextBasic>
              </TouchableOpacity>
            </View>

            <ButtonBasic
              title={t('auth.logIn')}
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.signupContainer}>
              <TextBasic color="#FFF">{t('auth.dontHaveAccount')} </TextBasic>
              <TouchableOpacity onPress={handleSignup}>
                <TextBasic weight="semibold" color="#C8E64D">
                  {t('auth.signUp')}
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
  forgotPassword: {
    textAlign: 'center',
    marginTop: 10,
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catImage: {
    width: 200,
    height: 150,
    alignSelf: 'center',
  }
});
