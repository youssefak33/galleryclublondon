import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Share, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    if (membership === 'Gold') return COLORS.goldGradient[0];
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
      {/* Header Premium avec gradient */}
      <LinearGradient
        colors={[COLORS.surface, COLORS.primaryBackground]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <View style={[styles.avatarBadge, { backgroundColor: getMembershipColor(profile.membership) }]}>
              <Ionicons name="checkmark" size={16} color={COLORS.primaryBackground} />
            </View>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <View style={styles.pointsContainer}>
            <Ionicons name="star" size={20} color={COLORS.textSecondary} />
            <Text style={styles.pointsText}>{profile.points} Points</Text>
          </View>
        </View>
      </LinearGradient>

      <Card variant="premium" style={[styles.membershipCard, { 
        borderColor: getMembershipColor(profile.membership),
        borderWidth: 2,
      }]}>
        <LinearGradient
          colors={[getMembershipBackgroundColor(profile.membership), getMembershipBackgroundColor(profile.membership) + '00']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.membershipGradient}
        >
          <View style={styles.membershipHeader}>
            <View style={styles.membershipTitleContainer}>
              <Ionicons name="shield-checkmark" size={28} color={getMembershipColor(profile.membership)} />
              <Text style={[styles.membershipTitle, { color: getMembershipColor(profile.membership) }]}>
                Membership Status
              </Text>
            </View>
          </View>
          <Text style={[styles.membership, { color: getMembershipColor(profile.membership) }]}>
            {profile.membership}
          </Text>
          <View style={styles.membershipBadge}>
            <Ionicons name="diamond" size={16} color={getMembershipColor(profile.membership)} />
            <Text style={[styles.membershipBadgeText, { color: getMembershipColor(profile.membership) }]}>
              Premium Member
            </Text>
          </View>
        </LinearGradient>
      </Card>

      <Card variant="premium">
        <View style={styles.cardHeader}>
          <Ionicons name="stats-chart" size={24} color={COLORS.textSecondary} />
          <Text style={styles.cardTitle}>My Stats</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="person" size={20} color={COLORS.textTertiary} />
            <View style={styles.statContent}>
              <Text style={styles.statsLabel}>Gender</Text>
              <Text style={styles.statsValue}>{profile.gender}</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={20} color={COLORS.textSecondary} />
            <View style={styles.statContent}>
              <Text style={styles.statsLabel}>Points</Text>
              <Text style={styles.statsValue}>{profile.points}</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="musical-notes" size={20} color={COLORS.textSecondary} />
            <View style={styles.statContent}>
              <Text style={styles.statsLabel}>Music Tastes</Text>
              <View style={styles.musicTags}>
                {profile.musicTastes.map((taste, index) => (
                  <View key={index} style={styles.musicTag}>
                    <Text style={styles.musicTagText}>{taste}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
        <AppButton title="Logout" onPress={handleLogout} variant="secondary" style={styles.logoutButton} />
      </Card>
      
      <Card variant="premium">
        <View style={styles.cardHeader}>
          <Ionicons name="trophy" size={24} color={COLORS.textSecondary} />
          <Text style={styles.cardTitle}>Earn Points</Text>
        </View>
        
        <View style={styles.gameItem}>
          <LinearGradient
            colors={[COLORS.surfaceHighlight, COLORS.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gameCard}
          >
            <View style={styles.gameHeader}>
              <View style={styles.gameIconContainer}>
                <Ionicons name="shirt" size={28} color={COLORS.textSecondary} />
              </View>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>Best Dressing</Text>
                <Text style={styles.gameDescription}>
                  Win the best dressed contest and earn 500 points!
                </Text>
                <Text style={styles.gameHint}>
                  Post a photo or video with #best_dressing_game
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.pointsBadge}
              onPress={handleParticipateBestDressing}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={20} color={COLORS.primaryBackground} />
              <Text style={styles.pointsText}>+500 pts</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.gameItem}>
          <LinearGradient
            colors={[COLORS.surfaceHighlight, COLORS.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gameCard}
          >
            <View style={styles.gameHeader}>
              <View style={styles.gameIconContainer}>
                <Ionicons name="musical-notes" size={28} color={COLORS.textSecondary} />
              </View>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>Best Dance</Text>
                <Text style={styles.gameDescription}>
                  Show your moves and win 750 points!
                </Text>
                <Text style={styles.gameHint}>
                  Post a video with #best_dance_game
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.pointsBadge, styles.pointsBadgeBrand]}
              onPress={handleParticipateBestDance}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={20} color={COLORS.textPrimary} />
              <Text style={[styles.pointsText, styles.pointsTextBrand]}>+750 pts</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.gameItem}>
          <LinearGradient
            colors={[COLORS.surfaceHighlight, COLORS.surface]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gameCard}
          >
            <View style={styles.gameHeader}>
              <View style={styles.gameIconContainer}>
                <Ionicons name="people" size={28} color={COLORS.textSecondary} />
              </View>
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle}>Invite Friends</Text>
                <Text style={styles.gameDescription}>
                  Invite friends and earn 200 points per friend!
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.pointsBadge}
              onPress={() => setShowReferralCode(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="gift" size={20} color={COLORS.primaryBackground} />
              <Text style={styles.pointsText}>+200 pts/friend</Text>
            </TouchableOpacity>
          </LinearGradient>
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
                <Ionicons name="copy-outline" size={24} color={COLORS.textSecondary} />
                <Text style={styles.referralActionText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.referralActionButton}
                onPress={handleShareReferralCode}
              >
                <Ionicons name="share-outline" size={24} color={COLORS.textSecondary} />
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
  headerGradient: {
    borderRadius: 5,
    marginBottom: SIZES.base * 2,
    padding: SIZES.base * 2,
    ...SIZES.shadow.md,
  },
  header: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: SIZES.base,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    ...SIZES.shadow.sm,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryBackground,
    ...SIZES.shadow.sm,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SIZES.base / 2,
  },
  email: {
    ...FONTS.body3,
    color: COLORS.textTertiary,
    marginBottom: SIZES.base * 2,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base,
    borderRadius: 5,
    gap: SIZES.base,
    ...SIZES.shadow.sm,
  },
  pointsText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  membershipCard: {
    overflow: 'hidden',
    marginBottom: SIZES.padding,
  },
  membershipGradient: {
    padding: SIZES.padding,
  },
  membershipHeader: {
    marginBottom: SIZES.base * 2,
  },
  membershipTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  membershipTitle: {
    ...FONTS.h4,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  membership: {
    ...FONTS.h2,
    fontWeight: '800',
    marginTop: SIZES.base / 2,
    letterSpacing: 1,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: SIZES.base,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: 5,
    gap: SIZES.base / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  membershipBadgeText: {
    ...FONTS.body4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base * 2,
    gap: SIZES.base,
  },
  cardTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statsContainer: {
    gap: SIZES.base,
    marginBottom: SIZES.base * 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceHighlight,
  },
  statContent: {
    flex: 1,
  },
  statsLabel: {
    ...FONTS.body4,
    color: COLORS.textTertiary,
    marginBottom: SIZES.base / 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsValue: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  musicTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
    marginTop: SIZES.base / 2,
  },
  musicTag: {
    backgroundColor: COLORS.glass,
    paddingHorizontal: SIZES.base * 1.5,
    paddingVertical: SIZES.base / 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  musicTagText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: SIZES.base,
  },
  gameItem: {
    marginBottom: SIZES.base * 2,
  },
  gameCard: {
    borderRadius: 5,
    padding: SIZES.base * 2,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glass,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 6,
  },
  gameHeader: {
    flexDirection: 'row',
    marginBottom: SIZES.base,
  },
  gameIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 5,
    backgroundColor: COLORS.glass,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base,
    ...SIZES.shadow.sm,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    fontWeight: '800',
    marginBottom: SIZES.base / 2,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  gameDescription: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 2,
    lineHeight: 20,
  },
  gameHint: {
    ...FONTS.body4,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
    fontSize: 12,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.textSecondary,
    paddingHorizontal: SIZES.base * 2,
    paddingVertical: SIZES.base * 1.5,
    borderRadius: 5,
    gap: SIZES.base / 2,
    ...SIZES.shadow.md,
  },
  pointsBadgePremium: {
    backgroundColor: COLORS.brand,
  },
  pointsBadgeBrand: {
    backgroundColor: COLORS.textSecondary,
  },
  pointsTextBrand: {
    color: COLORS.textPrimary,
  },
  pointsText: {
    ...FONTS.body3,
    color: COLORS.primaryBackground,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralModalContent: {
    backgroundColor: COLORS.glass,
    borderRadius: 5,
    padding: SIZES.padding,
    width: '90%',
    maxWidth: 400,
    zIndex: 1,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
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
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 5,
    padding: SIZES.base * 2,
    marginBottom: SIZES.padding,
    alignItems: 'center',
  },
  referralCode: {
    ...FONTS.h2,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.glass,
    borderRadius: 5,
    padding: SIZES.base * 1.5,
    gap: SIZES.base / 2,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  referralActionText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
