// screens/VouchersScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const BACK_ICON = require("../../assets/icons/back.png");

export default function VouchersScreen({navigation}) {
  const [activeTab, setActiveTab] = useState('Unused');

  const voucherHolders = [
    { id: 1, name: 'Jane Doe', location: 'Ikeja, Lagos', discount: '15%', time: '2 mins ago' },
    { id: 2, name: 'Tommy Gbese', location: 'Ikeja, Lagos', discount: '5%', time: '2 mins ago' },
    { id: 3, name: 'Dan Nithingale', location: 'Ikeja, Lagos', discount: '10%', time: '2 mins ago' },
    { id: 4, name: 'Mariam Bolade', location: 'Ikeja, Lagos', discount: '15%', time: '2 mins ago' },
    { id: 5, name: 'Adeola Bukola', location: 'Ikeja, Lagos', discount: '15%', time: '2 mins ago' },
    { id: 6, name: 'Susan Obinna', location: 'Ikeja, Lagos', discount: '10%', time: '2 mins ago' },
    { id: 7, name: 'Ada Sike', location: 'Ikeja, Lagos', discount: '15%', time: '2 mins ago' },
  ];

  const PieChart = () => {
    const size = 180;
    const strokeWidth = 20;
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    
    // 79 used, 21 unused (total 100)
    const usedPercentage = 0.79;
    const unusedPercentage = 0.21;
    
    const usedStrokeDasharray = `${circumference * usedPercentage} ${circumference}`;
    const unusedStrokeDasharray = `${circumference * unusedPercentage} ${circumference}`;

    return (
      <View style={styles.pieContainer}>
        <Svg width={size} height={size} style={styles.pieSvg}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="transparent"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Used portion - darker blue */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#1E40AF"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={usedStrokeDasharray}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
          
          {/* Unused portion - lighter blue */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#A5C4FF"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={unusedStrokeDasharray}
            strokeDashoffset={-circumference * usedPercentage}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>
        
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#1E40AF' }]} />
            <Text style={styles.legendLabel}>Used</Text>
            <Text style={styles.legendValue}>79</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#A5C4FF' }]} />
            <Text style={styles.legendLabel}>Unused</Text>
            <Text style={styles.legendValue}>21</Text>
          </View>
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
        <Text style={styles.headerTitle}>Vouchers</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pie Chart */}
        <PieChart />

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Unused' && styles.activeTab]}
            onPress={() => setActiveTab('Unused')}
          >
            <Text style={[styles.tabText, activeTab === 'Unused' && styles.activeTabText]}>
              Unused
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Used' && styles.activeTab]}
            onPress={() => setActiveTab('Used')}
          >
            <Text style={[styles.tabText, activeTab === 'Used' && styles.activeTabText]}>
              Used
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Unused vouchers</Text>

        {/* Voucher Holders List */}
        <View style={styles.vouchersList}>
          {voucherHolders.map((holder) => (
            <View key={holder.id} style={styles.voucherItem}>
              <View style={styles.voucherInfo}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{holder.discount}</Text>
                  <Text style={styles.offText}>OFF</Text>
                </View>
                <View style={styles.holderDetails}>
                  <Text style={styles.holderName}>{holder.name}</Text>
                  <Text style={styles.holderLocation}>{holder.location}</Text>
                </View>
              </View>
              <View style={styles.voucherActions}>
                <Text style={styles.timeText}>{holder.time}</Text>
                <TouchableOpacity style={styles.messageButton}>
                  <Text style={styles.messageButtonText}>Message</Text>
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
  pieContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  pieSvg: {
    marginBottom: 20,
  },
  legend: {
    flexDirection: 'row',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 4,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
   backIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  vouchersList: {
    marginBottom: 40,
  },
  voucherItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  voucherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  discountBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  discountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
  },
  offText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF6B35',
  },
  holderDetails: {
    flex: 1,
  },
  holderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  holderLocation: {
    fontSize: 14,
    color: '#666666',
  },
  voucherActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#999999',
  },
  messageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 4,
  },
  messageButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});