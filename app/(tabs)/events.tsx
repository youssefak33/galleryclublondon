import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Screen from '@/components/Screen';
import Card from '@/components/Card';
import AppButton from '@/components/AppButton';
import { MOCK_EVENTS, Event } from '@/api/mockData';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

export default function EventsScreen() {

  const renderEvent = ({ item }: { item: Event }) => (
    <Card style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>
        {new Date(item.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventGuests}>
        Special Guests: {item.specialGuests.join(', ')}
      </Text>
      <View style={styles.buttonContainer}>
        <AppButton title="Book Ticket" onPress={() => {}} />
        <View style={{width: SIZES.base}}/>
        <AppButton title="Book VIP Table" onPress={() => {}} variant="secondary" />
      </View>
    </Card>
  );

  return (
    <Screen>
      <Text style={styles.title}>Upcoming Events</Text>
      <FlatList
        data={MOCK_EVENTS}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginBottom: SIZES.padding,
  },
  eventCard: {
    marginBottom: SIZES.padding,
  },
  eventTitle: {
    ...FONTS.h3,
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  eventDate: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginVertical: SIZES.base / 2,
  },
  eventDescription: {
    ...FONTS.body4,
    color: COLORS.textPrimary,
    marginVertical: SIZES.base,
  },
  eventGuests: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SIZES.base * 2,
  },
  buttonContainer: {
    flexDirection: 'row',
  }
});
