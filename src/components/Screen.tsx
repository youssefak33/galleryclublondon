import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '@/constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  gradient?: boolean;
}

const Screen: React.FC<ScreenProps> = ({ children, style, scrollable = false, gradient = false }) => {
  const Container = scrollable ? ScrollView : View;

  const content = (
    <Container 
      style={[styles.container, style]}
      contentContainerStyle={scrollable ? styles.scrollContent : undefined}
    >
      {children}
    </Container>
  );

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.backdropCenter, COLORS.backdropEdge]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={gradient ? COLORS.goldGradient.map(color => `${color}20`) : ['transparent', 'transparent']}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safeArea}>
        {content}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: SIZES.padding,
  },
});

export default Screen;
