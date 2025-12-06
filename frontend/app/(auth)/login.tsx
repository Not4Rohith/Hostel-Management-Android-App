import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, TextInput, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors } from '../../src/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      
      // Check the store for the role (updated by login)
      const user = useAuthStore.getState().user;
      
      if (user?.role === 'admin') {
        router.replace('/(admin)/rooms');
      } else {
        router.replace('/(student)/dashboard');
      }
    } catch (e) {
      // Error is already handled in store, but we can show alert
      Alert.alert("Login Failed", useAuthStore.getState().error || "Something went wrong");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.form}>
        <Text variant="displaySmall" style={styles.title}>HostelMate</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>Welcome back!</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={handleLogin} 
          loading={isLoading} 
          disabled={isLoading}
          style={styles.button}
        >
          Login
        </Button>
        
        {/* Temporary Hint for Dev */}
        <Text style={{marginTop: 20, textAlign: 'center', color: '#999', fontSize: 12}}>
          Make sure Backend is running on your IP!
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
  form: { padding: 20 },
  title: { fontWeight: 'bold', color: colors.primary, textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: 40, color: colors.secondary },
  input: { marginBottom: 15 },
  button: { marginTop: 10, paddingVertical: 6 }
});