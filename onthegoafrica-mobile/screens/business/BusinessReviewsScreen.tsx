// screens/business/BusinessReviewsScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function BusinessReviewsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Reviews</Text>
          <Text style={styles.subtitle}>Manage customer feedback</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.ratingSection}>
            <Text style={styles.overallRating}>4.8</Text>
            <Text style={styles.ratingLabel}>Overall Rating</Text>
            <Text style={styles.reviewCount}>Based on 156 reviews</Text>
          </View>
          
          <View style={styles.ratingBreakdown}>
            <View style={styles.ratingRow}>
              <Text style={styles.starCount}>5 ⭐</Text>
              <View style={styles.ratingBar}>
                <View style={[styles.ratingFill, { width: '85%' }]} />
              </View>
              <Text style={styles.ratingPercent}>85%</Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.starCount}>4 ⭐</Text>
              <View style={styles.ratingBar}>
                <View style={[styles.ratingFill, { width: '10%' }]} />
              </View>
              <Text style={styles.ratingPercent}>10%</Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.starCount}>3 ⭐</Text>
              <View style={styles.ratingBar}>
                <View style={[styles.ratingFill, { width: '3%' }]} />
              </View>
              <Text style={styles.ratingPercent}>3%</Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.starCount}>2 ⭐</Text>
              <View style={styles.ratingBar}>
                <View style={[styles.ratingFill, { width: '1%' }]} />
              </View>
              <Text style={styles.ratingPercent}>1%</Text>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.starCount}>1 ⭐</Text>
              <View style={styles.ratingBar}>
                <View style={[styles.ratingFill, { width: '1%' }]} />
              </View>
              <Text style={styles.ratingPercent}>1%</Text>
            </View>
          </View>
        </View>

        <View style={styles.filterSection}>
          <TouchableOpacity style={[styles.filterChip, styles.activeChip]}>
            <Text style={[styles.filterText, styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Recent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Unread</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reviewsList}>
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View>
                <Text style={styles.reviewerName}>Sarah Johnson</Text>
                <Text style={styles.reviewDate}>2 days ago</Text>
              </View>
              <Text style={styles.reviewRating}>5 ⭐</Text>
            </View>
            <Text style={styles.reviewText}>
              Amazing service and great food! The staff was incredibly friendly and the atmosphere was perfect for a date night. Will definitely be coming back.
            </Text>
            <TouchableOpacity style={styles.replyButton}>
              <Text style={styles.replyText}>Reply</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View>
                <Text style={styles.reviewerName}>Mike Chen</Text>
                <Text style={styles.reviewDate}>5 days ago</Text>
              </View>
              <Text style={styles.reviewRating}>4 ⭐</Text>
            </View>
            <Text style={styles.reviewText}>
              Good food but the wait time was a bit long. The quality made up for it though. Would recommend making a reservation.
            </Text>
            <TouchableOpacity style={styles.replyButton}>
              <Text style={styles.replyText}>Reply</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View>
                <Text style={styles.reviewerName}>Emma Davis</Text>
                <Text style={styles.reviewDate}>1 week ago</Text>
              </View>
              <Text style={styles.reviewRating}>5 ⭐</Text>
            </View>
            <Text style={styles.reviewText}>
              Best restaurant in town! Everything was perfect from start to finish. The dessert was absolutely divine.
            </Text>
            <View style={styles.ownerReply}>
              <Text style={styles.ownerReplyLabel}>Your reply:</Text>
              <Text style={styles.ownerReplyText}>
                Thank you so much Emma! We're thrilled you enjoyed your experience. Can't wait to see you again!
              </Text>
            </View>
          </View>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'RCB-Bold',
    color: '#0A1220',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'RCB-Regular',
    color: '#6C7A92',
  },
  summaryCard: {
    backgroundColor: '#F5F8FE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8EEF7',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  overallRating: {
    fontSize: 48,
    fontFamily: 'RCB-Bold',
    color: '#0145FE',
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'RCB-SemiBold',
    color: '#0A1220',
    marginTop: 4,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'RCB-Regular',
    color: '#6C7A92',
    marginTop: 4,
  },
  ratingBreakdown: {
    gap: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  starCount: {
    fontSize: 14,
    fontFamily: 'RCB-SemiBold',
    color: '#0A1220',
    minWidth: 40,
  },
  ratingBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E8EEF7',
    borderRadius: 4,
  },
  ratingFill: {
    height: '100%',
    backgroundColor: '#0145FE',
    borderRadius: 4,
  },
  ratingPercent: {
    fontSize: 12,
    fontFamily: 'RCB-SemiBold',
    color: '#6C7A92',
    minWidth: 30,
  },
  filterSection: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EEF2F8',
    borderWidth: 1,
    borderColor: '#E8EEF7',
  },
  activeChip: {
    backgroundColor: '#0145FE',
    borderColor: '#0145FE',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'RCB-SemiBold',
    color: '#6C7A92',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  reviewsList: {
    gap: 16,
  },
  reviewCard: {
    backgroundColor: '#F5F8FE',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EEF7',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: 'RCB-SemiBold',
    color: '#0A1220',
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'RCB-Regular',
    color: '#6C7A92',
    marginTop: 2,
  },
  reviewRating: {
    fontSize: 14,
    fontFamily: 'RCB-SemiBold',
    color: '#0A1220',
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'RCB-Regular',
    color: '#0A1220',
    lineHeight: 20,
    marginBottom: 12,
  },
  replyButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0145FE',
    borderRadius: 20,
  },
  replyText: {
    fontSize: 12,
    fontFamily: 'RCB-SemiBold',
    color: '#FFFFFF',
  },
  ownerReply: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#16A34A',
  },
  ownerReplyLabel: {
    fontSize: 12,
    fontFamily: 'RCB-SemiBold',
    color: '#16A34A',
    marginBottom: 4,
  },
  ownerReplyText: {
    fontSize: 12,
    fontFamily: 'RCB-Regular',
    color: '#0A1220',
    lineHeight: 16,
  },
});