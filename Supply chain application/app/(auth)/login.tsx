import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, FONTS, FONT_SIZES, SPACING, SHADOWS } from '@/constants/theme';
import { Shield, Key, Mail, Truck } from 'lucide-react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        router.replace('/(app)');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'worker' | 'customer' | 'deliverer') => {
    setIsLoading(true);
    setError('');

    try {
      let demoEmail = '';
      let demoPassword = '';

      switch (role) {
        case 'admin':
          demoEmail = 'admin@logistics.com';
          demoPassword = 'admin123';
          break;
        case 'worker':
          demoEmail = 'worker@logistics.com';
          demoPassword = 'worker123';
          break;
        case 'customer':
          demoEmail = 'customer@example.com';
          demoPassword = 'customer123';
          break;
        case 'deliverer':
          demoEmail = 'deliverer@example.com';
          demoPassword = 'delivery123';
          break;
      }

      setEmail(demoEmail);
      setPassword(demoPassword);

      const success = await login(demoEmail, demoPassword);
      if (success) {
        router.replace('/(app)');
      } else {
        setError('Demo login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Truck size={64} color={COLORS.primary} strokeWidth={1.5} />
          <Text style={styles.logoText}>LogiTrack</Text>
          <Text style={styles.tagline}>Logistics Management System</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to your account</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputContainer}>
            <Mail size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Key size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Demo Accounts</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.demoContainer}>
            <TouchableOpacity 
              style={[styles.demoButton, styles.demoButtonAdmin]} 
              onPress={() => handleDemoLogin('admin')}
            >
              <Shield size={18} color="#fff" />
              <Text style={styles.demoButtonText}>Admin</Text>
              <Text style={styles.demoCredentials}>admin@logistics.com / admin123</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.demoButton, styles.demoButtonWorker]} 
              onPress={() => handleDemoLogin('worker')}
            >
              <Mail size={18} color="#fff" />
              <Text style={styles.demoButtonText}>Worker</Text>
              <Text style={styles.demoCredentials}>worker@logistics.com / worker123</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.demoButton, styles.demoButtonCustomer]} 
              onPress={() => handleDemoLogin('customer')}
            >
              <Mail size={18} color="#fff" />
              <Text style={styles.demoButtonText}>Customer</Text>
              <Text style={styles.demoCredentials}>customer@example.com / customer123</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.demoButton, styles.demoButtonDeliverer]} 
              onPress={() => handleDemoLogin('deliverer')}
            >
              <Truck size={18} color="#fff" />
              <Text style={styles.demoButtonText}>Deliverer</Text>
              <Text style={styles.demoCredentials}>deliverer@example.com / delivery123</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.registerLink}>Register here</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoText: {
    fontFamily: FONTS.heading,
    fontSize: 32,
    color: COLORS.primary,
    marginTop: SPACING.s,
  },
  tagline: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.s,
    color: COLORS.textSecondary,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.xl,
    ...SHADOWS.medium,
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.textSecondary,
    marginBottom: SPACING.l,
  },
  errorText: {
    fontFamily: FONTS.body,
    color: COLORS.error,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: SPACING.m,
    backgroundColor: COLORS.inputBackground,
  },
  inputIcon: {
    marginLeft: SPACING.m,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    padding: SPACING.m,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.m,
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
  },
  buttonText: {
    fontFamily: FONTS.button,
    fontSize: FONT_SIZES.m,
    color: COLORS.surface,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.l,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontFamily: FONTS.body,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.m,
  },
  demoContainer: {
    marginBottom: SPACING.l,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  demoButtonAdmin: {
    backgroundColor: '#1D4ED8',
  },
  demoButtonWorker: {
    backgroundColor: '#047857',
  },
  demoButtonCustomer: {
    backgroundColor: '#6D28D9',
  },
  demoButtonDeliverer: {
    backgroundColor: '#B91C1C',
  },
  demoButtonText: {
    fontFamily: FONTS.button,
    fontSize: FONT_SIZES.m,
    color: COLORS.surface,
    marginLeft: SPACING.m,
  },
  demoCredentials: {
    fontFamily: FONTS.caption,
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 'auto',
  },
  registerText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.s,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  registerLink: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.primary,
  },
});