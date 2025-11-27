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

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login({ email, password });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error instanceof Error ? error.message : 'Invalid credentials'
      );
    }
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password recovery feature coming soon!');
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
              Login
            </TextBasic>

            <View style={styles.inputsContainer}>
              <InputBasic
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputBasic
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity onPress={handleForgotPassword}>
                <TextBasic style={styles.forgotPassword} color="#AAA">
                  Forgot Password?
                </TextBasic>
              </TouchableOpacity>
            </View>

            <ButtonBasic
              title="Log in"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.signupContainer}>
              <TextBasic color="#FFF">Doesn't have an account? </TextBasic>
              <TouchableOpacity onPress={handleSignup}>
                <TextBasic weight="semibold" color="#C8E64D">
                  Signup
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
