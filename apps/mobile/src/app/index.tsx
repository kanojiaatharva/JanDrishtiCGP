import React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';

export default function MobileApp() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>JanDrishti Mobile Foundation</Text>
      <Text style={styles.subtitle}>Foundation successfully initialized.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 16, color: '#64748b', marginTop: 8 }
});
