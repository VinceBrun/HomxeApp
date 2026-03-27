/**
 * Vendor Home Screen
 * Service management hub for artisans and vendors to track jobs and schedules.
 */

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Spacing from '@/constants/SPACING';

export default function VendorHomeScreen() {
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <View style={{ padding: Spacing.lg }}>
        <Text style={[styles.title, { color: text }]}>Vendor Home</Text>
        <Text style={[styles.subtitle, { color: text }]}>View jobs, manage schedules, and track service requests.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: '600' },
  subtitle: { marginTop: Spacing.sm, fontSize: 16 },
});
