import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, FONTS, FONT_SIZES, SPACING, SHADOWS } from '@/constants/theme';
import { User, Mail, Key, Truck, ArrowLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'deliverer'>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await register({
        name,
        email,
        password,
        role
      });

      if (success) {
        router.replace('/(app)');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={COLORS.text} />
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our logistics platform</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'customer' && styles.roleButtonActive
              ]}
              onPress={() => setRole('customer')}
            >
              <User size={20} color={role === 'customer' ? COLORS.surface : COLORS.primary} />
              <Text 
                style={[
                  styles.roleButtonText,
                  role === 'customer' && styles.roleButtonTextActive
                ]}
              >
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'deliverer' && styles.roleButtonActive
              ]}
              onPress={() => setRole('deliverer')}
            >
              <Truck size={20} color={role === 'deliverer' ? COLORS.surface : COLORS.primary} />
              <Text 
                style={[
                  styles.roleButtonText,
                  role === 'deliverer' && styles.roleButtonTextActive
                ]}
              >
                Deliverer
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <User size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor={COLORS.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

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

          <View style={styles.inputContainer}>
            <Key size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={COLORS.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginPromptContainer}>
            <Text style={styles.loginPromptText}>
              Already have an account?{' '}
              <Text 
                style={styles.loginLink}
                onPress={() => router.replace('/(auth)/login')}
              >
                Login here
              </Text>
            </Text>
          </View>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: SPACING.l,
  },
  backButtonText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.m,
    color: COLORS.text,
    marginLeft: SPACING.xs,
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
  roleSelector: {
    flexDirection: 'row',
    marginBottom: SPACING.l,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    marginRight: SPACING.s,
  },
  roleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleButtonText: {
    fontFamily: FONTS.button,
    fontSize: FONT_SIZES.s,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  roleButtonTextActive: {
    color: COLORS.surface,
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
  loginPromptContainer: {
    marginTop: SPACING.l,
    alignItems: 'center',
  },
  loginPromptText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.s,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.primary,
  },
});