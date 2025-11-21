import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Screen from '@/components/Screen';
import Card from '@/components/Card';
import AppButton from '@/components/AppButton';
import { MOCK_EVENTS, MOCK_BOOKINGS, MOCK_USERS, Event, EventBooking, User } from '@/api/mockData';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';

export default function EventsScreen() {
  const { user } = useAuthStore();
  const isStaff = user?.role === 'staff';
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showGuests, setShowGuests] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDateEvents, setShowDateEvents] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showPayment, setShowPayment] = useState(false);
  const [paymentEvent, setPaymentEvent] = useState<Event | { title: string; date: string } | null>(null);
  const [bookingType, setBookingType] = useState<'ticket' | 'vip' | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'apple' | 'google' | null>(null);

  // Obtenir les 2 prochains événements
  const upcomingEvents = [...MOCK_EVENTS]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  // Formater une date pour le calendrier (YYYY-MM-DD)
  const formatDateForCalendar = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Obtenir les événements pour une date donnée
  const getEventsForDate = (dateString: string): Event[] => {
    return MOCK_EVENTS.filter(event => formatDateForCalendar(new Date(event.date)) === dateString);
  };

  // Vérifier si une date a un événement spécial
  const hasSpecialEvent = (dateString: string): boolean => {
    return getEventsForDate(dateString).length > 0;
  };

  // Obtenir les jours de la semaine actuelle
  const getWeekDays = (weekStart: Date): Date[] => {
    const days: Date[] = [];
    const start = new Date(weekStart);
    // Aller au lundi de la semaine
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Ajuster pour lundi
    start.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);

  // Navigation semaine
  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    setCurrentWeek(newWeek);
    // Mettre à jour le mois si nécessaire
    if (newWeek.getMonth() !== currentMonth.getMonth() || newWeek.getFullYear() !== currentMonth.getFullYear()) {
      setCurrentMonth(newWeek);
    }
  };

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    setCurrentWeek(newWeek);
    // Mettre à jour le mois si nécessaire
    if (newWeek.getMonth() !== currentMonth.getMonth() || newWeek.getFullYear() !== currentMonth.getFullYear()) {
      setCurrentMonth(newWeek);
    }
  };

  // Les flèches du header naviguent semaine par semaine
  const goToPreviousWeekFromHeader = () => {
    goToPreviousWeek();
  };

  const goToNextWeekFromHeader = () => {
    goToNextWeek();
  };

  // Gérer le clic sur une date
  const handleDatePress = (date: Date) => {
    const dateString = formatDateForCalendar(date);
    setSelectedDate(dateString);
    setShowDateEvents(true);
  };

  // Obtenir le nom du mois
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Obtenir le nom abrégé du jour
  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Obtenir les réservations pour un événement
  const getBookingsForEvent = (eventId: string): (EventBooking & { user: User })[] => {
    return MOCK_BOOKINGS
      .filter(booking => booking.eventId === eventId)
      .map(booking => ({
        ...booking,
        user: MOCK_USERS.find(u => u.id === booking.userId)!,
      }))
      .filter(booking => booking.user !== undefined);
  };

  const handleCheckGuests = (event: Event) => {
    setSelectedEvent(event);
    setShowGuests(true);
  };

  // Gérer le clic sur Book Ticket ou Book VIP
  const handleBookEvent = (event: Event | { title: string; date: string }, type: 'ticket' | 'vip') => {
    // Fermer le modal de date events si ouvert
    if (showDateEvents) {
      setShowDateEvents(false);
    }
    setPaymentEvent(event);
    setBookingType(type);
    setShowPayment(true);
  };

  // Rendu pour les membres
  const renderMemberEvent = ({ item }: { item: Event }) => (
    <Card variant="premium" style={styles.eventCard}>
      <LinearGradient
        colors={[COLORS.surfaceHighlight, COLORS.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.eventGradient}
      >
        <View style={styles.eventHeader}>
          <Ionicons name="sparkles" size={28} color={COLORS.textSecondary} />
      <Text style={styles.eventTitle}>{item.title}</Text>
        </View>
        <View style={styles.eventDateContainer}>
          <Ionicons name="calendar" size={20} color={COLORS.textTertiary} />
      <Text style={styles.eventDate}>
        {new Date(item.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>
        </View>
      <Text style={styles.eventDescription}>{item.description}</Text>
        <View style={styles.guestsContainer}>
          <Ionicons name="people" size={18} color={COLORS.textSecondary} />
      <Text style={styles.eventGuests}>
        Special Guests: {item.specialGuests.join(', ')}
      </Text>
        </View>
      <View style={styles.buttonContainer}>
          <AppButton 
            title="Book Ticket" 
            onPress={() => handleBookEvent(item, 'ticket')}
            variant="primary"
            style={styles.eventButton}
          />
          <AppButton 
            title="Book VIP Table" 
            onPress={() => handleBookEvent(item, 'vip')} 
            variant="secondary"
            style={styles.eventButton}
          />
      </View>
      </LinearGradient>
    </Card>
  );

  // Rendu pour le staff
  const renderStaffEvent = ({ item }: { item: Event }) => {
    const bookings = getBookingsForEvent(item.id);
    const ticketCount = bookings.filter(b => b.bookingType === 'ticket').length;
    const vipCount = bookings.filter(b => b.bookingType === 'vip').length;

    return (
      <Card variant="premium" style={styles.eventCard}>
        <LinearGradient
          colors={[COLORS.surfaceHighlight, COLORS.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.eventGradient}
        >
          <View style={styles.eventHeader}>
            <Ionicons name="calendar" size={28} color={COLORS.textSecondary} />
            <Text style={styles.eventTitle}>{item.title}</Text>
          </View>
          <View style={styles.eventDateContainer}>
            <Ionicons name="time" size={20} color={COLORS.textTertiary} />
            <Text style={styles.eventDate}>
              {new Date(item.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <Text style={styles.eventDescription}>{item.description}</Text>
          <View style={styles.guestsContainer}>
            <Ionicons name="people" size={18} color={COLORS.textSecondary} />
            <Text style={styles.eventGuests}>
              Special Guests: {item.specialGuests.join(', ')}
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statBadge}>
              <Ionicons name="ticket" size={16} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{ticketCount} Tickets</Text>
            </View>
            <View style={styles.statBadge}>
              <Ionicons name="diamond" size={16} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{vipCount} VIP</Text>
            </View>
            <View style={styles.statBadge}>
              <Ionicons name="people" size={16} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{bookings.length} Total</Text>
            </View>
          </View>
          <AppButton 
            title="Check Guests" 
            onPress={() => handleCheckGuests(item)}
            variant="secondary"
          />
        </LinearGradient>
      </Card>
    );
  };

  // Rendu d'une soirée simple (par défaut)
  const renderSimpleNight = (dateString: string) => {
    const date = new Date(dateString);
    const regularEvent = {
      title: 'Regular Night',
      date: dateString,
    };
    return (
      <Card variant="premium" style={styles.eventCard}>
        <LinearGradient
          colors={[COLORS.surfaceHighlight, COLORS.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.eventGradient}
        >
          <View style={styles.eventHeader}>
            <Ionicons name="musical-notes" size={28} color={COLORS.textSecondary} />
            <Text style={styles.eventTitle}>Regular Night</Text>
          </View>
          <View style={styles.eventDateContainer}>
            <Ionicons name="calendar" size={20} color={COLORS.textTertiary} />
            <Text style={styles.eventDate}>
              {date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <Text style={styles.eventDescription}>
            Join us for a regular night at Gallery Club London. Great music, great vibes!
          </Text>
          {!isStaff && (
            <View style={styles.buttonContainer}>
              <AppButton 
                title="Buy Ticket" 
                onPress={() => handleBookEvent(regularEvent, 'ticket')}
                variant="primary"
                style={styles.eventButton}
              />
              <AppButton 
                title="Book VIP Table" 
                onPress={() => handleBookEvent(regularEvent, 'vip')} 
                variant="secondary"
                style={styles.eventButton}
              />
            </View>
          )}
        </LinearGradient>
      </Card>
    );
  };

  return (
    <Screen scrollable>
      {/* Header Premium */}
      <View style={styles.header}>
        <LinearGradient
          colors={[COLORS.surface, COLORS.primaryBackground]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Ionicons 
              name={isStaff ? 'calendar' : 'sparkles'} 
              size={32} 
              color={COLORS.textSecondary} 
            />
            <Text style={styles.title}>
              {isStaff ? 'Event Management' : 'Upcoming Events'}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Calendrier personnalisé */}
      <Card style={styles.calendarCard}>
        {/* Header avec mois/année et flèches (navigation semaine par semaine) */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={goToPreviousWeekFromHeader} style={styles.calendarArrow}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.calendarMonthYear}>{getMonthName(currentWeek)}</Text>
          <TouchableOpacity onPress={goToNextWeekFromHeader} style={styles.calendarArrow}>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Ligne des jours de la semaine */}
        <View style={styles.weekDaysRow}>
          {weekDays.map((day, index) => (
            <View key={index} style={styles.weekDayHeader}>
              <Text style={styles.weekDayName}>{getDayName(day)}</Text>
            </View>
          ))}
        </View>

        {/* Ligne des dates de la semaine */}
        <View style={styles.weekDatesRow}>
          {weekDays.map((day, index) => {
            const dateString = formatDateForCalendar(day);
            const hasEvent = hasSpecialEvent(dateString);
            const isToday = formatDateForCalendar(new Date()) === dateString;
            const isSelected = selectedDate === dateString;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCell,
                  isToday && styles.todayCell,
                  isSelected && styles.selectedCell,
                ]}
                onPress={() => handleDatePress(day)}
              >
                <Text
                  style={[
                    styles.dateNumber,
                    isToday && styles.todayText,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {day.getDate()}
                </Text>
                {hasEvent && (
                  <View style={[styles.eventDot, isSelected && styles.selectedDot]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

      </Card>

      {/* 2 Prochains événements */}
      <Text style={styles.sectionTitle}>Upcoming Special Events</Text>
      <FlatList
        data={upcomingEvents}
        renderItem={isStaff ? renderStaffEvent : renderMemberEvent}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.upcomingEventsList}
      />

      {/* Modal pour afficher les événements d'une date */}
      <Modal
        visible={showDateEvents}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateEvents(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowDateEvents(false)}
          />
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'Events'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowDateEvents(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {selectedDate && (
              <ScrollView>
                {hasSpecialEvent(selectedDate) ? (
                  // Afficher les événements spéciaux
                  getEventsForDate(selectedDate).map(event => (
                    <View key={event.id} style={styles.modalEventCard}>
                      {isStaff ? renderStaffEvent({ item: event }) : renderMemberEvent({ item: event })}
                    </View>
                  ))
                ) : (
                  // Afficher une soirée simple
                  renderSimpleNight(selectedDate)
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal pour afficher les invités */}
      <Modal
        visible={showGuests}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGuests(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedEvent?.title} - Guests
              </Text>
              <TouchableOpacity
                onPress={() => setShowGuests(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {selectedEvent && (
              <FlatList
                data={getBookingsForEvent(selectedEvent.id)}
                renderItem={({ item }) => (
                  <Card style={styles.guestCard}>
                    <Text style={styles.guestName}>{item.user.name}</Text>
                    <Text style={styles.guestEmail}>{item.user.email}</Text>
                    <Text style={styles.guestMembership}>
                      {item.user.membership} Member
                    </Text>
                    <Text style={styles.guestBookingType}>
                      Booking: {item.bookingType.toUpperCase()}
                    </Text>
                    <Text style={styles.guestBookingDate}>
                      Booked: {new Date(item.bookingDate).toLocaleDateString()}
                    </Text>
                  </Card>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No bookings yet</Text>
                }
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de paiement */}
      <Modal
        visible={showPayment}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowPayment(false);
          setSelectedPaymentMethod(null);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowPayment(false);
            setSelectedPaymentMethod(null);
          }}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {bookingType === 'ticket' ? 'Book Ticket' : 'Book VIP Table'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowPayment(false);
                  setSelectedPaymentMethod(null);
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {paymentEvent && (
              <View style={styles.paymentEventInfo}>
                <Text style={styles.paymentEventTitle}>
                  {paymentEvent.title}
                </Text>
                <Text style={styles.paymentEventDate}>
                  {new Date(paymentEvent.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                <Text style={styles.paymentAmount}>
                  {bookingType === 'ticket' ? '£25.00' : '£150.00'}
                </Text>
              </View>
            )}

            <Text style={styles.paymentMethodTitle}>Select Payment Method</Text>

            <View style={styles.paymentMethods}>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === 'card' && styles.paymentMethodSelected,
                ]}
                onPress={() => setSelectedPaymentMethod('card')}
              >
                <Ionicons
                  name="card-outline"
                  size={32}
                  color={selectedPaymentMethod === 'card' ? COLORS.textSecondary : COLORS.textTertiary}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    selectedPaymentMethod === 'card' && styles.paymentMethodTextSelected,
                  ]}
                >
                  Credit/Debit Card
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === 'apple' && styles.paymentMethodSelected,
                ]}
                onPress={() => setSelectedPaymentMethod('apple')}
              >
                <Ionicons
                  name="logo-apple"
                  size={32}
                  color={selectedPaymentMethod === 'apple' ? COLORS.textSecondary : COLORS.textTertiary}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    selectedPaymentMethod === 'apple' && styles.paymentMethodTextSelected,
                  ]}
                >
                  Apple Pay
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === 'google' && styles.paymentMethodSelected,
                ]}
                onPress={() => setSelectedPaymentMethod('google')}
              >
                <Ionicons
                  name="logo-google"
                  size={32}
                  color={selectedPaymentMethod === 'google' ? COLORS.textSecondary : COLORS.textTertiary}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    selectedPaymentMethod === 'google' && styles.paymentMethodTextSelected,
                  ]}
                >
                  Google Pay
                </Text>
              </TouchableOpacity>
            </View>

            <AppButton
              title={selectedPaymentMethod ? 'Complete Payment' : 'Select Payment Method'}
              onPress={() => {
                if (selectedPaymentMethod) {
                  // Simulation du paiement
                  Alert.alert(
                    'Payment Successful!',
                    `Your ${bookingType === 'ticket' ? 'ticket' : 'VIP table'} has been booked successfully.`,
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          setShowPayment(false);
                          setSelectedPaymentMethod(null);
                          setPaymentEvent(null);
                          setBookingType(null);
                        },
                      },
                    ]
                  );
                }
              }}
              disabled={!selectedPaymentMethod}
              style={styles.payButton}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: SIZES.base * 2,
  },
  headerGradient: {
    borderRadius: 5,
    padding: SIZES.base * 2,
    ...SIZES.shadow.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  upcomingEventsList: {
    marginBottom: SIZES.padding,
  },
  calendarCard: {
    marginBottom: SIZES.padding,
    padding: SIZES.base * 3,
    backgroundColor: COLORS.glass,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
  },
  calendarArrow: {
    padding: SIZES.base / 2,
  },
  calendarMonthYear: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SIZES.base,
  },
  weekDayHeader: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayName: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  weekDatesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SIZES.base * 2,
  },
  dateCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.base,
    borderRadius: 5,
    position: 'relative',
  },
  todayCell: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  selectedCell: {
    backgroundColor: COLORS.textSecondary,
    borderWidth: 1,
    borderColor: COLORS.goldGradient[0],
  },
  dateNumber: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  todayText: {
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  selectedText: {
    color: COLORS.primaryBackground,
    fontWeight: 'bold',
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: COLORS.textSecondary,
  },
  selectedDot: {
    backgroundColor: COLORS.primaryBackground,
  },
  modalEventCard: {
    marginBottom: SIZES.base,
  },
  eventCard: {
    marginBottom: SIZES.padding,
    overflow: 'hidden',
  },
  eventGradient: {
    padding: SIZES.base * 2,
    borderRadius: 5,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
    gap: SIZES.base,
  },
  eventTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    fontWeight: '700',
    letterSpacing: 0.3,
    flex: 1,
  },
  eventDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
    gap: SIZES.base / 2,
  },
  eventDate: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  eventDescription: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
    lineHeight: 18,
  },
  guestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
    gap: SIZES.base / 2,
    padding: SIZES.base,
    backgroundColor: COLORS.glass,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  eventGuests: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: SIZES.base,
    gap: SIZES.base,
  },
  eventButton: {
    flex: 1,
    minHeight: 40,
    paddingVertical: SIZES.base,
  },
  eventButtonText: {
    ...FONTS.body4,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base / 2,
    marginVertical: SIZES.base,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.glass,
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base,
    borderRadius: 5,
    gap: SIZES.base / 2,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  statText: {
    ...FONTS.body4,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.glass,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    maxHeight: '80%',
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: -12 },
    shadowRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    paddingBottom: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
  },
  guestCard: {
    marginBottom: SIZES.base,
    padding: SIZES.base * 1.5,
  },
  guestName: {
    ...FONTS.h4,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  guestEmail: {
    ...FONTS.body4,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base / 2,
  },
  guestMembership: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 2,
  },
  guestBookingType: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SIZES.base / 2,
  },
  guestBookingDate: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  emptyText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.padding * 2,
  },
  paymentEventInfo: {
    marginBottom: SIZES.padding * 2,
    paddingBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  paymentEventTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  paymentEventDate: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  paymentAmount: {
    ...FONTS.h2,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    marginTop: SIZES.base,
  },
  paymentMethodTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SIZES.base * 2,
  },
  paymentMethods: {
    gap: SIZES.base,
    marginBottom: SIZES.padding * 2,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.base * 2,
    backgroundColor: COLORS.glass,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  paymentMethodSelected: {
    borderColor: COLORS.goldGradient[0],
    backgroundColor: COLORS.glass,
  },
  paymentMethodText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base * 2,
    flex: 1,
  },
  paymentMethodTextSelected: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  payButton: {
    marginTop: SIZES.base,
  },
});
