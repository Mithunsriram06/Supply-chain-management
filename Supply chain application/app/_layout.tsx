import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import FontProvider from '@/providers/FontProvider';
import AuthProvider from '@/providers/AuthProvider';
import MockDataProvider from '@/providers/MockDataProvider';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <FontProvider>
      <MockDataProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </MockDataProvider>
    </FontProvider>
  );
}