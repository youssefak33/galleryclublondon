import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
        <AppButton 
          title="Book Ticket" 
          onPress={() => handleBookEvent(item, 'ticket')} 
        />
        <View style={{width: SIZES.base}}/>
        <AppButton 
          title="Book VIP Table" 
          onPress={() => handleBookEvent(item, 'vip')} 
          variant="secondary" 
        />
      </View>
    </Card>
  );

  // Rendu pour le staff
  const renderStaffEvent = ({ item }: { item: Event }) => {
    const bookings = getBookingsForEvent(item.id);
    const ticketCount = bookings.filter(b => b.bookingType === 'ticket').length;
    const vipCount = bookings.filter(b => b.bookingType === 'vip').length;

    return (
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
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Tickets: {ticketCount} | VIP: {vipCount} | Total: {bookings.length}
          </Text>
        </View>
        <AppButton 
          title="Check Guests" 
          onPress={() => handleCheckGuests(item)}
          variant="secondary"
        />
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
      <Card style={styles.eventCard}>
        <Text style={styles.eventTitle}>Regular Night</Text>
        <Text style={styles.eventDate}>
          {date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        <Text style={styles.eventDescription}>
          Join us for a regular night at Gallery Club London. Great music, great vibes!
        </Text>
        {!isStaff && (
          <View style={styles.buttonContainer}>
            <AppButton 
              title="Buy Ticket" 
              onPress={() => handleBookEvent(regularEvent, 'ticket')} 
            />
            <View style={{width: SIZES.base}}/>
            <AppButton 
              title="Book VIP Table" 
              onPress={() => handleBookEvent(regularEvent, 'vip')} 
              variant="secondary" 
            />
          </View>
        )}
      </Card>
    );
  };

  return (
    <Screen scrollable>
      <Text style={styles.title}>
        {isStaff ? 'Event Management' : 'Upcoming Events'}
      </Text>

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
                  color={selectedPaymentMethod === 'card' ? COLORS.accent : COLORS.textSecondary}
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
                  color={selectedPaymentMethod === 'apple' ? COLORS.accent : COLORS.textSecondary}
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
                  color={selectedPaymentMethod === 'google' ? COLORS.accent : COLORS.textSecondary}
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
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  upcomingEventsList: {
    marginBottom: SIZES.padding,
  },
  calendarCard: {
    marginBottom: SIZES.padding,
    padding: SIZES.base * 2,
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
    borderRadius: SIZES.radius,
    position: 'relative',
  },
  todayCell: {
    backgroundColor: COLORS.surface,
  },
  selectedCell: {
    backgroundColor: COLORS.accent,
  },
  dateNumber: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  todayText: {
    color: COLORS.accent,
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
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  selectedDot: {
    backgroundColor: COLORS.primaryBackground,
  },
  modalEventCard: {
    marginBottom: SIZES.base,
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
  },
  statsContainer: {
    marginVertical: SIZES.base,
    padding: SIZES.base,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
  },
  statsText: {
    ...FONTS.body4,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.primaryBackground,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    maxHeight: '80%',
    padding: SIZES.padding,
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
    color: COLORS.accent,
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
    color: COLORS.accent,
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
    color: COLORS.accent,
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
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentMethodSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surface,
  },
  paymentMethodText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base * 2,
    flex: 1,
  },
  paymentMethodTextSelected: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  payButton: {
    marginTop: SIZES.base,
  },
});
