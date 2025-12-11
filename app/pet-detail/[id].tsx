import { ButtonBasic } from '@/components/ButtonBasic';
import { TextBasic } from '@/components/TextBasic';
import { TextAreaBasic } from '@/components/TextAreaBasic';
import { incidentsService } from '@/services/incidents.service';
import { commentsService, Comment } from '@/services/comments.service';
import { Incident } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

type TabType = 'description' | 'location' | 'comments';

export default function PetDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [pet, setPet] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  useEffect(() => {
    loadPetDetails();
    loadComments(); // Load comments on mount to show correct count
  }, [id]);

  useEffect(() => {
    if (activeTab === 'comments') {
      loadComments(); // Reload when switching to comments tab
    }
  }, [activeTab]);

  const loadPetDetails = async () => {
    try {
      setIsLoading(true);
      const petData = await incidentsService.getIncidentById(id);
      setPet(petData);
    } catch (error) {
      console.error('Error loading pet details:', error);
      Alert.alert(t('common.error'), t('petDetail.errorLoading'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setIsLoadingComments(true);
      const result = await commentsService.getCommentsByIncident(id, 1, 20);
      setComments(result.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
      Alert.alert(t('common.error'), t('comments.errorLoading'));
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      Alert.alert(t('common.error'), t('comments.emptyComment'));
      return;
    }

    if (!user) {
      Alert.alert(t('common.error'), t('comments.loginRequired'));
      return;
    }

    try {
      setIsSubmittingComment(true);
      await commentsService.createComment(id, {
        content: newComment.trim(),
      });
      setNewComment('');
      loadComments(); // Reload comments
      Alert.alert(t('common.success'), t('comments.commentAdded'));
    } catch (error) {
      console.error('Error creating comment:', error);
      Alert.alert(t('common.error'), t('comments.errorCreating'));
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editingCommentText.trim()) {
      Alert.alert(t('common.error'), t('comments.emptyCommentEdit'));
      return;
    }

    try {
      await commentsService.updateComment(commentId, {
        content: editingCommentText.trim(),
      });
      setEditingCommentId(null);
      setEditingCommentText('');
      loadComments();
      Alert.alert(t('common.success'), t('comments.commentUpdated'));
    } catch (error) {
      console.error('Error updating comment:', error);
      Alert.alert(t('common.error'), t('comments.errorUpdating'));
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert(
      t('comments.deleteComment'),
      t('comments.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await commentsService.deleteComment(commentId);
              loadComments();
              Alert.alert(t('common.success'), t('comments.commentDeleted'));
            } catch (error) {
              console.error('Error deleting comment:', error);
              Alert.alert(t('common.error'), t('comments.errorDeleting'));
            }
          },
        },
      ]
    );
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return t('comments.justNow');
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;

    return new Intl.DateTimeFormat('es-ES', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getStatusBadge = () => {
    if (!pet) return null;

    const config = {
      lost: { text: t('petDetail.lost'), color: '#FF4444' },
      adoption: { text: t('petDetail.adoption'), color: '#44FF88' },
    };

    const badge = config[pet.incidentType];

    return (
      <View style={[styles.statusBadge, { backgroundColor: badge.color }]}>
        <TextBasic weight="bold" style={styles.statusText}>
          {badge.text}
        </TextBasic>
      </View>
    );
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const handleContact = () => {
    if (!pet) return;

    Alert.alert(
      t('petDetail.contact'),
      t('petDetail.chooseContact'),
      [
        {
          text: t('petDetail.call'),
          onPress: () => Linking.openURL(`tel:${pet.contactPhone}`),
        },
        {
          text: t('petDetail.email'),
          onPress: () => Linking.openURL(`mailto:${pet.contactEmail}`),
        },
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C8E64D" />
        </View>
      </SafeAreaView>
    );
  }

  if (!pet) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <TextBasic>{t('petDetail.petNotFound')}</TextBasic>
          <ButtonBasic
            title={t('petDetail.goBack')}
            onPress={() => router.back()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Pet Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: pet.imageUrls[currentImageIndex] || pet.imageUrls[0] }}
            style={styles.petImage}
          />

          {/* Image Navigation */}
          {pet.imageUrls.length > 1 && (
            <View style={styles.imageNavigation}>
              {pet.imageUrls.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.imageDot,
                    currentImageIndex === index && styles.imageDotActive,
                  ]}
                  onPress={() => setCurrentImageIndex(index)}
                />
              ))}
            </View>
          )}

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Status Badge */}
          <View style={styles.statusBadgeContainer}>{getStatusBadge()}</View>
        </View>

        {/* Pet Info */}
        <View style={styles.infoContainer}>
          {/* Name */}
          <TextBasic variant="title" weight="bold" style={styles.petName}>
            {pet.petName}
          </TextBasic>

          {/* Pet Type and Breed */}
          <View style={styles.petTypeContainer}>
            <TextBasic style={styles.petTypeText} color="#C8E64D">
              {pet.petType.charAt(0).toUpperCase() + pet.petType.slice(1)}
              {pet.breed && ` • ${pet.breed}`}
            </TextBasic>
          </View>

          {/* Contact Info */}
          <View style={styles.contactContainer}>
            {pet.user && (
              <TextBasic style={styles.contactText} color="#C8E64D">
                {t('petDetail.by')} {pet.user.fullName}
              </TextBasic>
            )}
            <TextBasic style={styles.contactText} color="#C8E64D">
              {t('petDetail.contact')}: {pet.contactPhone}
            </TextBasic>
          </View>

          {/* Published Date */}
          <TextBasic style={styles.dateText} color="#AAA">
            {t('petDetail.publishedOn')} {formatDate(pet.createdAt)}
          </TextBasic>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'description' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('description')}
              activeOpacity={0.7}
            >
              <TextBasic
                weight={activeTab === 'description' ? 'bold' : 'regular'}
                style={[
                  styles.tabText,
                  activeTab === 'description' && styles.tabTextActive,
                ]}
              >
                {t('petDetail.description')}
              </TextBasic>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'location' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('location')}
              activeOpacity={0.7}
            >
              <TextBasic
                weight={activeTab === 'location' ? 'bold' : 'regular'}
                style={[
                  styles.tabText,
                  activeTab === 'location' && styles.tabTextActive,
                ]}
              >
                {t('petDetail.location')}
              </TextBasic>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'comments' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('comments')}
              activeOpacity={0.7}
            >
              <TextBasic
                weight={activeTab === 'comments' ? 'bold' : 'regular'}
                style={[
                  styles.tabText,
                  activeTab === 'comments' && styles.tabTextActive,
                ]}
              >
                {t('petDetail.comments')} ({comments.length})
              </TextBasic>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'description' ? (
              <View style={styles.descriptionContainer}>
                <TextBasic style={styles.descriptionText}>
                  {pet.description}
                </TextBasic>

                {/* Status Info */}
                <View style={styles.additionalInfo}>
                  <View style={styles.infoRow}>
                    <Ionicons name="information-circle" size={20} color="#C8E64D" />
                    <TextBasic style={styles.infoLabel}>{t('petDetail.status')}:</TextBasic>
                    <TextBasic style={styles.infoValue}>
                      {pet.status === 'active' ? t('petDetail.active') : pet.status === 'resolved' ? t('petDetail.resolved') : t('petDetail.closed')}
                    </TextBasic>
                  </View>
                </View>
              </View>
            ) : activeTab === 'location' ? (
              <View style={styles.locationContainer}>
                {pet.location && pet.location.coordinates.length === 2 ? (
                  <>
                    <View style={styles.mapContainer}>
                      <MapView
                        style={styles.map}
                        initialRegion={{
                          latitude: pet.location.coordinates[1],
                          longitude: pet.location.coordinates[0],
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        }}
                      >
                        <Marker
                          coordinate={{
                            latitude: pet.location.coordinates[1],
                            longitude: pet.location.coordinates[0],
                          }}
                          pinColor={pet.incidentType === 'lost' ? '#FF4444' : '#44FF88'}
                        />
                      </MapView>
                    </View>
                    <View style={styles.addressContainer}>
                      <Ionicons name="location" size={24} color="#C8E64D" />
                      <TextBasic style={styles.addressText}>
                        {pet.locationName}
                      </TextBasic>
                    </View>
                    {pet.distance && (
                      <TextBasic style={styles.distanceText} color="#AAA">
                        {(pet.distance / 1000).toFixed(2)} {t('petDetail.kmAway')}
                      </TextBasic>
                    )}
                  </>
                ) : (
                  <TextBasic color="#AAA" style={styles.noLocationText}>
                    {t('petDetail.noLocation')}
                  </TextBasic>
                )}
              </View>
            ) : (
              <View style={styles.commentsContainer}>
                {/* Comments List */}
                {isLoadingComments ? (
                  <View style={styles.loadingCommentsContainer}>
                    <ActivityIndicator size="small" color="#C8E64D" />
                    <TextBasic style={styles.loadingCommentsText}>
                      {t('comments.loading')}
                    </TextBasic>
                  </View>
                ) : comments.length === 0 ? (
                  <View style={styles.emptyCommentsContainer}>
                    <Ionicons name="chatbubbles-outline" size={48} color="#555" />
                    <TextBasic style={styles.emptyCommentsText} color="#AAA">
                      {t('comments.noComments')}
                    </TextBasic>
                    <TextBasic style={styles.emptyCommentsSubtext} color="#666">
                      {t('comments.beFirst')}
                    </TextBasic>
                  </View>
                ) : (
                  <View style={styles.commentsList}>
                    {comments.map((comment) => (
                      <View key={comment._id} style={styles.commentCard}>
                        {/* Comment Header */}
                        <View style={styles.commentHeader}>
                          <View style={styles.commentUserInfo}>
                            {comment.user.photoURL ? (
                              <Image
                                source={{ uri: comment.user.photoURL }}
                                style={styles.commentAvatar}
                              />
                            ) : (
                              <View style={styles.commentAvatarPlaceholder}>
                                <Ionicons name="person" size={20} color="#C8E64D" />
                              </View>
                            )}
                            <View style={styles.commentUserDetails}>
                              <TextBasic weight="semibold" style={styles.commentUserName}>
                                {comment.user.fullName}
                              </TextBasic>
                              <TextBasic style={styles.commentDate} color="#888">
                                {formatCommentDate(comment.createdAt)}
                                {comment.isEdited && ` (${t('comments.edited')})`}
                              </TextBasic>
                            </View>
                          </View>

                          {/* Action Buttons - only show for own comments */}
                          {user && user.id === comment.userId && (
                            <View style={styles.commentActions}>
                              <TouchableOpacity
                                onPress={() => {
                                  setEditingCommentId(comment._id);
                                  setEditingCommentText(comment.content);
                                }}
                                style={styles.commentActionButton}
                              >
                                <Ionicons name="create-outline" size={18} color="#C8E64D" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleDeleteComment(comment._id)}
                                style={styles.commentActionButton}
                              >
                                <Ionicons name="trash-outline" size={18} color="#FF4444" />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>

                        {/* Comment Content */}
                        {editingCommentId === comment._id ? (
                          <View style={styles.editCommentContainer}>
                            <TextInput
                              style={styles.editCommentInput}
                              value={editingCommentText}
                              onChangeText={setEditingCommentText}
                              multiline
                              placeholder={t('comments.editCommentPlaceholder')}
                              placeholderTextColor="#666"
                            />
                            <View style={styles.editCommentActions}>
                              <TouchableOpacity
                                onPress={() => {
                                  setEditingCommentId(null);
                                  setEditingCommentText('');
                                }}
                                style={styles.cancelEditButton}
                              >
                                <TextBasic style={styles.cancelEditText}>{t('comments.cancel')}</TextBasic>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleEditComment(comment._id)}
                                style={styles.saveEditButton}
                              >
                                <TextBasic style={styles.saveEditText}>{t('comments.save')}</TextBasic>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <TextBasic style={styles.commentContent}>
                            {comment.content}
                          </TextBasic>
                        )}

                        {/* Comment Images */}
                        {comment.imageUrls && comment.imageUrls.length > 0 && (
                          <View style={styles.commentImages}>
                            {comment.imageUrls.map((imageUrl, index) => (
                              <Image
                                key={index}
                                source={{ uri: imageUrl }}
                                style={styles.commentImage}
                              />
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {/* Add Comment Form */}
                {user && (
                  <View style={styles.addCommentContainer}>
                    <TextBasic style={styles.addCommentTitle} weight="semibold">
                      {t('comments.addCommentTitle')}
                    </TextBasic>
                    <View style={styles.addCommentForm}>
                      <TextInput
                        style={styles.commentInput}
                        value={newComment}
                        onChangeText={setNewComment}
                        placeholder={t('comments.writeComment')}
                        placeholderTextColor="#666"
                        multiline
                        maxLength={1000}
                      />
                      <TouchableOpacity
                        style={[
                          styles.submitCommentButton,
                          (!newComment.trim() || isSubmittingComment) && styles.submitCommentButtonDisabled,
                        ]}
                        onPress={handleSubmitComment}
                        disabled={!newComment.trim() || isSubmittingComment}
                      >
                        {isSubmittingComment ? (
                          <ActivityIndicator size="small" color="#000" />
                        ) : (
                          <Ionicons name="send" size={20} color="#000" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Contact Button */}
          <View style={styles.buttonContainer}>
            <ButtonBasic
              title={pet.incidentType === 'adoption' ? t('petDetail.contactForAdoption') : t('petDetail.contactOwner')}
              onPress={handleContact}
              variant="primary"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  imageContainer: {
    width: '100%',
    height: width * 1.2,
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusBadgeContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#FFF',
    textTransform: 'uppercase',
  },
  infoContainer: {
    backgroundColor: '#000',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  petName: {
    fontSize: 28,
    marginBottom: 12,
  },
  contactContainer: {
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 24,
  },
  tab: {
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#C8E64D',
  },
  tabText: {
    fontSize: 16,
    color: '#AAA',
  },
  tabTextActive: {
    color: '#C8E64D',
  },
  tabContent: {
    minHeight: 200,
  },
  descriptionContainer: {
    gap: 20,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#CCC',
  },
  additionalInfo: {
    gap: 12,
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#AAA',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFF',
  },
  locationContainer: {
    gap: 16,
  },
  mapContainer: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#C8E64D',
  },
  map: {
    flex: 1,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#FFF',
  },
  noLocationText: {
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 40,
  },
  buttonContainer: {
    marginTop: 32,
  },
  imageNavigation: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  imageDotActive: {
    backgroundColor: '#C8E64D',
    width: 24,
  },
  petTypeContainer: {
    marginBottom: 8,
  },
  petTypeText: {
    fontSize: 16,
  },
  distanceText: {
    fontSize: 14,
    textAlign: 'center',
  },
  // Comments styles
  commentsContainer: {
    gap: 20,
  },
  loadingCommentsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10,
  },
  loadingCommentsText: {
    fontSize: 14,
    color: '#AAA',
  },
  emptyCommentsContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyCommentsText: {
    fontSize: 16,
    marginTop: 12,
  },
  emptyCommentsSubtext: {
    fontSize: 14,
  },
  commentsList: {
    gap: 16,
  },
  commentCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    padding: 16,
    gap: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  commentUserInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentUserDetails: {
    flex: 1,
    gap: 4,
  },
  commentUserName: {
    fontSize: 14,
  },
  commentDate: {
    fontSize: 12,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  commentActionButton: {
    padding: 4,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#DDD',
  },
  commentImages: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  commentImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  editCommentContainer: {
    gap: 12,
  },
  editCommentInput: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#FFF',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editCommentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelEditButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  cancelEditText: {
    fontSize: 14,
    color: '#AAA',
  },
  saveEditButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#C8E64D',
  },
  saveEditText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  addCommentContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 12,
  },
  addCommentTitle: {
    fontSize: 16,
  },
  addCommentForm: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#FFF',
    minHeight: 60,
    maxHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#333',
  },
  submitCommentButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#C8E64D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitCommentButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
});
