// screens/CafeReviewsScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

const BACK_ICON = require("../../assets/icons/back.png");

export default function CafeReviewsScreen({navigation}) {
  const [sortVisible, setSortVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const ratingBreakdown = [
    { rating: 'Amazing', count: 100, percentage: 0.67 },
    { rating: 'Very good', count: 24, percentage: 0.16 },
    { rating: 'Good', count: 8, percentage: 0.053 },
    { rating: 'Poor', count: 6, percentage: 0.04 },
    { rating: 'Terrible', count: 12, percentage: 0.08 },
  ];

  const reviews = [
    {
      id: 1,
      name: 'Sandy Kane',
      location: 'Accra, Ghana',
      date: 'Written 18/07/24',
      rating: 4.5,
      title: 'Best spot ever',
      visitTime: 'Visited Morning',
      review: 'This is not my first time in Cafe One and I will always come here for their amazing coffee and croissant with great atmospheric condition. We thank the team for putting this up, it is like a...',
      image: require('./../../assets/feed/user1.png'), // You'll need to add this image
      helpful: 2400,
    },
    {
      id: 2,
      name: 'Mary James',
      location: 'Lagos, Nigeria',
      date: 'Written 19/07/24',
      rating: 4.5,
      title: 'Cool spot',
      visitTime: 'Visited Afternoon',
      review: 'This is not my first time in Cafe One and I will always come here for their amazing coffee and croissant with great atmospheric condition. We thank the team for putting this up, it is like a...',
      helpful: 2400,
      initials: 'MJ',
    },
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('★');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars.map((star, index) => (
      <Text key={index} style={[styles.star, star === '★' ? styles.filledStar : styles.emptyStar]}>
        {star}
      </Text>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
               <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image source={BACK_ICON} style={styles.backIcon} />
        </TouchableOpacity>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cafe One</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Reviews Header */}
        <View style={styles.reviewsHeader}>
          <Text style={styles.reviewsTitle}>Reviews</Text>
          
          <View style={styles.ratingOverview}>
            <Text style={styles.overallRating}>4.5</Text>
            <View style={styles.starsContainer}>
              {renderStars(4.5)}
            </View>
            <Text style={styles.reviewCount}>150 reviews</Text>
          </View>

          {/* Rating Breakdown */}
          <View style={styles.ratingBreakdown}>
            {ratingBreakdown.map((item, index) => (
              <View key={index} style={styles.ratingRow}>
                <Text style={styles.ratingLabel}>{item.rating}</Text>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[styles.progressBar, { width: `${item.percentage * 100}%` }]} 
                    />
                  </View>
                </View>
                <Text style={styles.ratingCount}>{item.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Filter Controls */}
        <View style={styles.filterControls}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setSortVisible(!sortVisible)}
          >
            <Text style={styles.filterIcon}>⚏</Text>
            <Text style={styles.filterText}>Sort</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterVisible(!filterVisible)}
          >
            <Text style={styles.filterIcon}>⚙</Text>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsList}>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.avatarContainer}>
                    {review.initials ? (
                      <View style={styles.initialsAvatar}>
                        <Text style={styles.initialsText}>{review.initials}</Text>
                      </View>
                    ) : (
                      <View style={styles.avatar} />
                    )}
                  </View>
                  <View style={styles.reviewerDetails}>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                    <Text style={styles.reviewerLocation}>{review.location}</Text>
                  </View>
                </View>
                <View style={styles.reviewMeta}>
                  <View style={styles.starsContainer}>
                    {renderStars(review.rating)}
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              </View>

              <View style={styles.reviewContent}>
                <Text style={styles.reviewTitle}>{review.title}</Text>
                <Text style={styles.visitTime}>{review.visitTime}</Text>
                <Text style={styles.reviewText}>{review.review}</Text>
                <TouchableOpacity>
                  <Text style={styles.readMore}>Read more</Text>
                </TouchableOpacity>
              </View>

              {review.image && (
                <View style={styles.reviewImageContainer}>
                  <View style={styles.reviewImagePlaceholder}>
                    <Text style={styles.imageText}>Cafe Image</Text>
                  </View>
                </View>
              )}

              <View style={styles.reviewActions}>
                <TouchableOpacity style={styles.helpfulButton}>
                  <Text style={styles.helpfulIcon}>👍</Text>
                  <Text style={styles.helpfulText}>Helpful ({review.helpful.toLocaleString()})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreButton}>
                  <Text style={styles.moreIcon}>⋯</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 20,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
    marginRight: 36,
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  reviewsHeader: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 16,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
   backIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  ratingOverview: {
    alignItems: 'center',
    marginBottom: 24,
  },
  overallRating: {
    fontSize: 48,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  star: {
    fontSize: 20,
    marginHorizontal: 1,
  },
  filledStar: {
    color: '#FFD700',
  },
  emptyStar: {
    color: '#E0E0E0',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666666',
  },
  ratingBreakdown: {
    gap: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#666666',
    width: 60,
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  ratingCount: {
    fontSize: 14,
    color: '#666666',
    width: 30,
    textAlign: 'right',
  },
  filterControls: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
  },
  filterIcon: {
    fontSize: 14,
    color: '#666666',
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
  },
  reviewsList: {
    gap: 24,
    marginBottom: 40,
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  initialsAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#666666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  reviewerLocation: {
    fontSize: 14,
    color: '#666666',
  },
  reviewMeta: {
    alignItems: 'flex-end',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  reviewContent: {
    marginBottom: 12,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  visitTime: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  reviewImageContainer: {
    marginBottom: 12,
  },
  reviewImagePlaceholder: {
    width: 120,
    height: 80,
    backgroundColor: '#8B4513',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpfulIcon: {
    fontSize: 16,
  },
  helpfulText: {
    fontSize: 14,
    color: '#666666',
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 20,
    color: '#CCCCCC',
  },
});