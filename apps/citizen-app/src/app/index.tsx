import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';

export default function CitizenApp() {
  const [step, setStep] = useState('HOME');

  if (step === 'CONFIRM') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Review Report</Text>
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Text style={styles.aiBadge}>✨ AI Understood</Text>
              <Text style={styles.confidence}>94% Confidence</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Language</Text>
              <Text style={styles.value}>Hindi (hi)</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Issue Category</Text>
              <Text style={styles.value}>Drinking Water</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>Ward 14</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Summary</Text>
              <Text style={styles.value}>Unsafe drinking water and frequently broken handpumps</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={() => setStep('HOME')}>
            <Text style={styles.outlineButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => setStep('SUCCESS')}>
            <Text style={styles.primaryButtonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'SUCCESS') {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Report Submitted</Text>
        <Text style={styles.successText}>Your report ID is JR-2026-001284.</Text>
        <Text style={styles.successText}>The administration will review it shortly.</Text>
        <TouchableOpacity style={[styles.button, styles.primaryButton, { marginTop: 32 }]} onPress={() => setStep('HOME')}>
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Namaste, Meena</Text>
        <Text style={styles.subtitle}>How can we help your community today?</Text>
      </View>
      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.micButton} onPress={() => setStep('CONFIRM')}>
          <Text style={styles.micIcon}>🎙️</Text>
        </TouchableOpacity>
        <Text style={styles.instructionText}>Tap to speak</Text>
        <Text style={styles.instructionHindi}>आप बोलिए...</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.secondaryButtonText}>Type Instead</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
