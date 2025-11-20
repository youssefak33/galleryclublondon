import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_FEED_CONTENT, MOCK_USERS, FeedContent, User } from '@/api/mockData';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FeedScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [showAddContent, setShowAddContent] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [contentType, setContentType] = useState<'image' | 'video'>('image');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Gérer les paramètres de navigation (hashtag pré-rempli)
  useEffect(() => {
    if (params.hashtag) {
      setNewCaption(params.hashtag as string);
      setShowAddContent(true);
      if (params.forceVideo === 'true') {
        setContentType('video');
      }
      // Nettoyer les paramètres après avoir ouvert le modal
      router.setParams({ hashtag: undefined, gameType: undefined, forceVideo: undefined });
    }
  }, [params.hashtag]);

  // Fonction pour fermer le modal proprement
  const handleCloseModal = () => {
    setShowAddContent(false);
    // Réinitialiser les valeurs si nécessaire
    if (params.hashtag) {
      setNewCaption('');
      setContentType('image');
    }
  };

  // Filtrer le contenu selon la visibilité (les membres ne voient que le public)
  const isStaff = user?.role === 'staff';
  const feedContent = MOCK_FEED_CONTENT.filter(
    (content) => isStaff || content.visibility === 'public'
  );

  // Obtenir l'utilisateur pour un contenu
  const getUserForContent = (userId: string) => {
    return MOCK_USERS.find((u) => u.id === userId);
  };

  // Obtenir le nom à afficher
  const getDisplayName = (contentUser: User, contentUserId: string) => {
    if (!user) return contentUser.name;
    // Le staff voit toujours les noms complets
    if (isStaff) {
      return contentUser.name;
    }
    const isMyContent = user.id === contentUserId;
    if (isMyContent) {
      // Mes contenus : nom complet
      return contentUser.name;
    } else {
      // Contenus des autres : prénom seulement
      return contentUser.name.split(' ')[0];
    }
  };

  // Rendre un élément du feed (style TikTok)
  const renderFeedItem = ({ item }: { item: FeedContent }) => {
    const contentUser = getUserForContent(item.userId);
    if (!contentUser) return null;

    const isLiked = likedPosts.has(item.id);
    const timeAgo = getTimeAgo(item.createdAt);
    const displayName = getDisplayName(contentUser, item.userId);

    return (
      <View style={styles.feedItem}>
        {/* Media (image ou vidéo) */}
        <View style={styles.mediaContainer}>
          <Image source={{ uri: item.mediaUrl }} style={styles.media} />
          {item.type === 'video' && (
            <View style={styles.videoIndicator}>
              <Ionicons name="play-circle" size={40} color={COLORS.textPrimary} />
            </View>
          )}
          {item.visibility === 'private' && (
            <View style={styles.privateBadge}>
              <Ionicons name="lock-closed" size={16} color={COLORS.textPrimary} />
              <Text style={styles.privateText}>Staff Only</Text>
            </View>
          )}
        </View>

        {/* Bottom info */}
        <View style={styles.bottomInfo}>
          <View style={styles.bottomInfoLeft}>
            <View style={styles.userInfo}>
              <Image source={{ uri: contentUser.avatar }} style={styles.userAvatar} />
              <Text style={styles.userName}>{displayName}</Text>
            </View>
            {item.caption && (
              <Text style={styles.caption} numberOfLines={2}>
                {item.caption}
              </Text>
            )}
            <Text style={styles.timeAgo}>{timeAgo}</Text>
          </View>

          {/* Actions like et comment en vertical à droite */}
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.bottomActionButton}
              onPress={() => {
                const newLiked = new Set(likedPosts);
                if (isLiked) {
                  newLiked.delete(item.id);
                } else {
                  newLiked.add(item.id);
                }
                setLikedPosts(newLiked);
              }}
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={28}
                color={isLiked ? COLORS.error : COLORS.textPrimary}
              />
              <Text style={styles.bottomActionCount}>{item.likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomActionButton}>
              <Ionicons name="chatbubble-outline" size={28} color={COLORS.textPrimary} />
              <Text style={styles.bottomActionCount}>{item.comments}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleAddContent = () => {
    if (newCaption.trim()) {
      Alert.alert(
        'Content Added',
        `Your ${contentType} has been added to the feed! ${visibility === 'private' ? '(Staff only)' : ''}`
      );
      setNewCaption('');
      setContentType('image');
      setVisibility('public');
      handleCloseModal();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <TouchableOpacity onPress={() => setShowAddContent(true)}>
          <Ionicons name="add-circle" size={32} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {/* Feed vertical style TikTok */}
      <FlatList
        data={feedContent}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT * 0.75}
        snapToAlignment="start"
        decelerationRate="fast"
      />

      {/* Modal Add Content */}
      <Modal
        visible={showAddContent}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleCloseModal}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Type selection */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  contentType === 'image' && styles.typeButtonActive,
                ]}
                onPress={() => setContentType('image')}
              >
                <Ionicons
                  name="image-outline"
                  size={24}
                  color={contentType === 'image' ? COLORS.accent : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    contentType === 'image' && styles.typeButtonTextActive,
                  ]}
                >
                  Image
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  contentType === 'video' && styles.typeButtonActive,
                ]}
                onPress={() => setContentType('video')}
              >
                <Ionicons
                  name="videocam-outline"
                  size={24}
                  color={contentType === 'video' ? COLORS.accent : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    contentType === 'video' && styles.typeButtonTextActive,
                  ]}
                >
                  Video
                </Text>
              </TouchableOpacity>
            </View>

            {/* Visibility selection */}
            <View style={styles.visibilitySection}>
              <Text style={styles.visibilityLabel}>Visibility</Text>
              <View style={styles.visibilitySelector}>
                <TouchableOpacity
                  style={[
                    styles.visibilityButton,
                    visibility === 'public' && styles.visibilityButtonActive,
                  ]}
                  onPress={() => setVisibility('public')}
                >
                  <Ionicons
                    name="globe-outline"
                    size={20}
                    color={visibility === 'public' ? COLORS.accent : COLORS.textSecondary}
                  />
                  <Text
                    style={[
                      styles.visibilityButtonText,
                      visibility === 'public' && styles.visibilityButtonTextActive,
                    ]}
                  >
                    Public
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.visibilityButton,
                    visibility === 'private' && styles.visibilityButtonActive,
                  ]}
                  onPress={() => setVisibility('private')}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={visibility === 'private' ? COLORS.accent : COLORS.textSecondary}
                  />
                  <Text
                    style={[
                      styles.visibilityButtonText,
                      visibility === 'private' && styles.visibilityButtonTextActive,
                    ]}
                  >
                    Staff Only
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.visibilityHint}>
                {visibility === 'private'
                  ? 'Only staff can see this content (for contests, etc.)'
                  : 'Everyone can see this content'}
              </Text>
            </View>

            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              value={newCaption}
              onChangeText={setNewCaption}
            />

            <TouchableOpacity
              style={styles.addMediaButton}
              onPress={() => Alert.alert('Media Picker', `${contentType} picker coming soon!`)}
            >
              <Ionicons
                name={contentType === 'image' ? 'image-outline' : 'videocam-outline'}
                size={24}
                color={COLORS.accent}
              />
              <Text style={styles.addMediaText}>Add {contentType === 'image' ? 'Photo' : 'Video'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, !newCaption.trim() && styles.modalButtonDisabled]}
              onPress={handleAddContent}
              disabled={!newCaption.trim()}
            >
              <Text style={styles.modalButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base * 2,
    paddingTop: SIZES.padding * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
    zIndex: 10,
  },
  headerTitle: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  feedItem: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
    position: 'relative',
  },
  mediaContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
  },
  videoIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  privateBadge: {
    position: 'absolute',
    top: SIZES.base * 2,
    right: SIZES.base * 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  privateText: {
    ...FONTS.body4,
    color: COLORS.textPrimary,
    marginLeft: SIZES.base / 2,
    fontSize: 12,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.base * 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bottomInfoLeft: {
    flex: 1,
    marginRight: SIZES.base * 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: SIZES.base,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  userName: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  caption: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
  },
  timeAgo: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  bottomActions: {
    alignItems: 'center',
  },
  bottomActionButton: {
    alignItems: 'center',
    marginBottom: SIZES.base * 1.5,
  },
  bottomActionCount: {
    ...FONTS.body4,
    color: COLORS.textPrimary,
    marginTop: SIZES.base / 2,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.primaryBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    width: '90%',
    maxWidth: 400,
    zIndex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: SIZES.base * 2,
    gap: SIZES.base,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceHighlight,
  },
  typeButtonText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base / 2,
  },
  typeButtonTextActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  visibilitySection: {
    marginBottom: SIZES.base * 2,
  },
  visibilityLabel: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
    fontWeight: '600',
  },
  visibilitySelector: {
    flexDirection: 'row',
    gap: SIZES.base,
    marginBottom: SIZES.base / 2,
  },
  visibilityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  visibilityButtonActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceHighlight,
  },
  visibilityButtonText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base / 2,
  },
  visibilityButtonTextActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
  visibilityHint: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
  },
  captionInput: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    minHeight: 100,
    marginBottom: SIZES.base * 2,
    textAlignVertical: 'top',
  },
  addMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    marginBottom: SIZES.base * 2,
  },
  addMediaText: {
    ...FONTS.body3,
    color: COLORS.accent,
    marginLeft: SIZES.base,
    fontWeight: '600',
  },
  modalButton: {
    backgroundColor: COLORS.accent,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    alignItems: 'center',
  },
  modalButtonDisabled: {
    backgroundColor: COLORS.textDisabled,
  },
  modalButtonText: {
    ...FONTS.body3,
    color: COLORS.primaryBackground,
    fontWeight: 'bold',
  },
});
