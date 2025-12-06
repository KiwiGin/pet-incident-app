import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { ButtonBasic } from '../../components/ButtonBasic';
import { InputBasic } from '../../components/InputBasic';
import { TextBasic } from '../../components/TextBasic';
import { useAuth } from '../../contexts/AuthContext';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, isLoading } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await signup({ name, email, password });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Signup Failed',
        error instanceof Error ? error.message : 'An error occurred'
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
              Signup
            </TextBasic>

            <View style={styles.inputsContainer}>
              <InputBasic
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
              />

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

              <InputBasic
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <ButtonBasic
              title="Sign up"
              onPress={handleSignup}
              loading={isLoading}
              style={styles.signupButton}
            />

            <View style={styles.loginContainer}>
              <TextBasic color="#FFF">Already have an account? </TextBasic>
              <TouchableOpacity onPress={handleLogin}>
                <TextBasic weight="semibold" color="#C8E64D">
                  Login
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
