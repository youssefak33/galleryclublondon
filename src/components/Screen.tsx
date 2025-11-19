import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
}

const Screen: React.FC<ScreenProps> = ({ children, style, scrollable = false }) => {
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container style={[styles.container, style]}>
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  container: {
    flex: 1,
    padding: 20,
  },
});

export default Screen;
