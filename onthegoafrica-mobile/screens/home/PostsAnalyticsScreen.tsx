// screens/PostsAnalyticsScreen.tsx
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
import Svg, { Path } from 'react-native-svg';

const BACK_ICON = require("../../assets/icons/back.png");

export default function PostsAnalyticsScreen({navigation}) {
  const [selectedPeriod, setSelectedPeriod] = useState('This week');

  // Sample data for the line charts
  const chartData = {
    green: [10, 12, 11, 15, 13, 16, 14, 18, 16, 20, 18, 22, 20, 25],
    red: [8, 9, 8, 10, 9, 11, 10, 12, 11, 13, 12, 14, 13, 15],
    blue: [5, 6, 7, 8, 6, 9, 7, 10, 8, 11, 9, 12, 10, 13],
  };

  const posts = [
    {
      id: 1,
      thumbnail: null,
      views: 200,
      likes: '1.2k',
      comments: 100,
    },
    {
      id: 2,
      thumbnail: null,
      views: 200,
      likes: '1.2k',
      comments: 100,
    },
    {
      id: 3,
      thumbnail: null,
      views: 200,
      likes: '1.2k',
      comments: 100,
    },
    {
      id: 4,
      thumbnail: null,
      views: 200,
      likes: '1.2k',
      comments: 100,
    },
  ];

  const generateSVGPath = (data, width, height, color) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    let path = '';
    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  };

  const LineChart = () => {
    const chartWidth = 320;
    const chartHeight = 120;

    return (
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight} style={styles.chartSvg}>
          <Path
            d={generateSVGPath(chartData.green, chartWidth, chartHeight)}
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={generateSVGPath(chartData.red, chartWidth, chartHeight)}
            stroke="#EF4444"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={generateSVGPath(chartData.blue, chartWidth, chartHeight)}
            stroke="#3B82F6"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        
        {/* Days labels */}
        <View style={styles.daysContainer}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <Text key={day} style={styles.dayLabel}>{day}</Text>
          ))}
        </View>
      </View>
    );
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
        <Text style={styles.headerTitle}>Posts analytics</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['This week', 'This month', 'Custom'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
                period === 'Custom' && styles.customButton,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              {period === 'Custom' && <Text style={styles.calendarIcon}>📅</Text>}
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                  period === 'Custom' && styles.customButtonText,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Line Chart */}
        <LineChart />

        {/* Posts Section */}
        <View style={styles.postsSection}>
          <View style={styles.postsSectionHeader}>
            <Text style={styles.sectionTitle}>Posts</Text>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortIcon}>↕</Text>
            </TouchableOpacity>
          </View>

          {posts.map((post) => (
            <View key={post.id} style={styles.postItem}>
              <View style={styles.postThumbnail}>
                <View style={styles.thumbnailPlaceholder}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              </View>
              
              <View style={styles.postStats}>
                <View style={styles.statGroup}>
                  <Text style={styles.statLabel}>No of views</Text>
                  <Text style={styles.statValue}>{post.views}</Text>
                </View>
                
                <View style={styles.statGroup}>
                  <Text style={styles.statLabel}>Likes</Text>
                  <Text style={styles.statValue}>{post.likes}</Text>
                </View>
                
                <View style={styles.statGroup}>
                  <Text style={styles.statLabel}>Comments</Text>
                  <Text style={styles.statValue}>{post.comments}</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.chevronButton}>
                <Text style={styles.chevronIcon}>›</Text>
              </TouchableOpacity>
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
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  customButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  customButtonText: {
    color: '#666666',
  },
  calendarIcon: {
    fontSize: 14,
  },
  chartContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    minHeight: 180,
  },
  chartSvg: {
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666666',
  },
  postsSection: {
    marginBottom: 40,
  },
  postsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
   backIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  sortButton: {
    padding: 8,
  },
  sortIcon: {
    fontSize: 16,
    color: '#666666',
  },
  postItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  postThumbnail: {
    marginRight: 16,
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  postStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statGroup: {
    alignItems: 'flex-start',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  chevronButton: {
    padding: 8,
    marginLeft: 8,
  },
  chevronIcon: {
    fontSize: 18,
    color: '#CCCCCC',
  },
});