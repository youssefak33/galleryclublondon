import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Share, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import Screen from '@/components/Screen';
import Card from '@/components/Card';
import AppButton from '@/components/AppButton';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile } = useUserStore();
  const { logout, user } = useAuthStore();
  const [showReferralCode, setShowReferralCode] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Générer un code de parrainage basé sur l'ID utilisateur (toujours le même)
  const getReferralCode = () => {
    if (!user) return '';
    // Créer un code basé sur l'ID utilisateur (ex: GCL-USER-1)
    return `GCL-${user.id.toUpperCase()}`;
  };

  const handleCopyReferralCode = async () => {
    const code = getReferralCode();
    await Clipboard.setStringAsync(code);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };

  const handleShareReferralCode = async () => {
    const code = getReferralCode();
    const message = `Join me at Gallery Club London! Use my referral code: ${code} and get exclusive benefits!`;
    
    try {
      await Share.share({
        message: message,
        title: 'Join Gallery Club London',
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share referral code');
    }
  };

  const handleParticipateBestDressing = () => {
    // Naviguer vers le feed avec le hashtag pré-rempli
    router.push({
      pathname: '/(tabs)/feed',
      params: { hashtag: '#best_dressing_game', gameType: 'dressing' },
    });
  };

  const handleParticipateBestDance = () => {
    // Naviguer vers le feed avec le hashtag pré-rempli et forcer vidéo
    router.push({
      pathname: '/(tabs)/feed',
      params: { hashtag: '#best_dance_game', gameType: 'dance', forceVideo: 'true' },
    });
  };

  if (!profile) {
    return (
      <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: COLORS.textPrimary }}>Loading profile...</Text>
      </Screen>
    );
  }

  const getMembershipColor = (membership: string) => {
    if (membership === 'Gold') return COLORS.accent; // #FFD700
    if (membership === 'Silver') return '#C0C0C0';
    return '#CD7F32'; // Bronze
  };

  const getMembershipBackgroundColor = (membership: string) => {
    if (membership === 'Gold') return 'rgba(255, 215, 0, 0.15)'; // Gold avec transparence
    if (membership === 'Silver') return 'rgba(192, 192, 192, 0.15)'; // Silver avec transparence
    return 'rgba(205, 127, 50, 0.15)'; // Bronze avec transparence
  };

  return (
    <Screen scrollable>
      <View style={styles.header}>
        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
        <AppButton title="Logout" onPress={handleLogout} variant="secondary" />
      </View>

      <Card style={[styles.membershipCard, { 
        backgroundColor: getMembershipBackgroundColor(profile.membership),
        borderColor: getMembershipColor(profile.membership),
        borderWidth: 2,
      }]}>
        <View style={styles.membershipHeader}>
          <Text style={[styles.membershipTitle, { color: getMembershipColor(profile.membership) }]}>
            Membership Status
          </Text>
          <Ionicons name="shield-checkmark" size={24} color={getMembershipColor(profile.membership)} />
        </View>
        <Text style={[styles.membership, { color: getMembershipColor(profile.membership) }]}>
          {profile.membership}
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>My Stats</Text>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Gender</Text>
          <Text style={styles.statsValue}>{profile.gender}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Points</Text>
          <Text style={styles.statsValue}>{profile.points}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statsLabel}>Music Tastes</Text>
          <Text style={styles.statsValue}>{profile.musicTastes.join(', ')}</Text>
        </View>
      </Card>
      
      <Card>
        <Text style={styles.cardTitle}>Earn Points</Text>
        
        <View style={styles.gameItem}>
          <View style={styles.gameHeader}>
            <Ionicons name="shirt-outline" size={24} color={COLORS.accent} />
            <Text style={styles.gameTitle}>Best Dressing</Text>
          </View>
          <Text style={styles.gameDescription}>
            Win the best dressed contest and earn 500 points!
          </Text>
          <Text style={styles.gameHint}>
            Participate by posting a photo or video with the hashtag #best_dressing_game
          </Text>
          <TouchableOpacity
            style={styles.pointsBadge}
            onPress={handleParticipateBestDressing}
            activeOpacity={0.7}
          >
            <Text style={styles.pointsText}>+500 pts</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gameItem}>
          <View style={styles.gameHeader}>
            <Ionicons name="musical-notes-outline" size={24} color={COLORS.accent} />
            <Text style={styles.gameTitle}>Best Dance</Text>
          </View>
          <Text style={styles.gameDescription}>
            Show your moves and win the dance competition for 750 points!
          </Text>
          <Text style={styles.gameHint}>
            Participate by posting a video with the hashtag #best_dance_game
          </Text>
          <TouchableOpacity
            style={styles.pointsBadge}
            onPress={handleParticipateBestDance}
            activeOpacity={0.7}
          >
            <Text style={styles.pointsText}>+750 pts</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gameItem}>
          <View style={styles.gameHeader}>
            <Ionicons name="people-outline" size={24} color={COLORS.accent} />
            <Text style={styles.gameTitle}>Invite Friends</Text>
          </View>
          <Text style={styles.gameDescription}>
            Invite your friends to join the club. Earn 200 points per friend!
          </Text>
          <TouchableOpacity
            style={styles.pointsBadge}
            onPress={() => setShowReferralCode(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.pointsText}>+200 pts/friend</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Modal Referral Code */}
      <Modal
        visible={showReferralCode}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowReferralCode(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowReferralCode(false)}
          />
          <View style={styles.referralModalContent}>
            <View style={styles.referralModalHeader}>
              <Text style={styles.referralModalTitle}>Your Referral Code</Text>
              <TouchableOpacity onPress={() => setShowReferralCode(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.referralModalDescription}>
              Share this code with your friends to earn 200 points per friend!
            </Text>
            
            <View style={styles.referralCodeBox}>
              <Text style={styles.referralCode}>{getReferralCode()}</Text>
            </View>
            
            <View style={styles.referralActions}>
              <TouchableOpacity
                style={styles.referralActionButton}
                onPress={handleCopyReferralCode}
              >
                <Ionicons name="copy-outline" size={24} color={COLORS.accent} />
                <Text style={styles.referralActionText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.referralActionButton}
                onPress={handleShareReferralCode}
              >
                <Ionicons name="share-outline" size={24} color={COLORS.accent} />
                <Text style={styles.referralActionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SIZES.base * 2,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  email: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base * 2,
  },
  membershipCard: {
    backgroundColor: COLORS.surfaceHighlight,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },
  membershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  membershipTitle: {
    ...FONTS.h4,
    fontWeight: 'bold',
  },
  membership: {
    ...FONTS.h1,
    fontWeight: 'bold',
    marginTop: SIZES.base,
  },
  cardTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginBottom: SIZES.base * 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
  },
  statsLabel: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  statsValue: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  gameItem: {
    marginBottom: SIZES.padding,
    paddingBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  gameTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginLeft: SIZES.base,
  },
  gameDescription: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  gameHint: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SIZES.base,
    fontSize: 12,
  },
  pointsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    paddingHorizontal: SIZES.base * 1.5,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    cursor: 'pointer',
  },
  pointsText: {
    ...FONTS.body4,
    color: COLORS.primaryBackground,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralModalContent: {
    backgroundColor: COLORS.primaryBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    width: '90%',
    maxWidth: 400,
    zIndex: 1,
  },
  referralModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  referralModalTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  referralModalDescription: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  referralCodeBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 2,
    marginBottom: SIZES.padding,
    alignItems: 'center',
  },
  referralCode: {
    ...FONTS.h2,
    color: COLORS.accent,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  referralActions: {
    flexDirection: 'row',
    gap: SIZES.base,
  },
  referralActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceHighlight,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    gap: SIZES.base / 2,
  },
  referralActionText: {
    ...FONTS.body3,
    color: COLORS.accent,
    fontWeight: '600',
  },
});
