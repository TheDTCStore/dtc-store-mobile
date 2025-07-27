import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// 模拟优惠券数据
const couponData = [
  {
    id: '1',
    code: 'WINE100',
    type: 'fixed',
    value: 100,
    minAmount: 500,
    expireDate: '2023-12-31',
    isUsed: false,
    description: '满500减100',
    applicable: '全场通用',
    backgroundColor: '#ffebee',
    borderColor: '#e91e63',
    textColor: '#e91e63',
  },
  {
    id: '2',
    code: 'WINE15OFF',
    type: 'percentage',
    value: 15,
    minAmount: 200,
    expireDate: '2023-12-15',
    isUsed: false,
    description: '85折优惠',
    applicable: '指定红酒品类',
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
    textColor: '#4caf50',
  },
  {
    id: '3',
    code: 'NEWUSER50',
    type: 'fixed',
    value: 50,
    minAmount: 100,
    expireDate: '2023-12-10',
    isUsed: false,
    description: '新人专享券',
    applicable: '首单可用',
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    textColor: '#2196f3',
  },
  {
    id: '4',
    code: 'MEMBER20',
    type: 'percentage',
    value: 20,
    minAmount: 300,
    expireDate: '2023-12-20',
    isUsed: false,
    description: '会员专享8折',
    applicable: '会员等级≥2',
    backgroundColor: '#fff8e1',
    borderColor: '#ffc107',
    textColor: '#ffc107',
  },
  {
    id: '5',
    code: 'EXPIRED200',
    type: 'fixed',
    value: 200,
    minAmount: 1000,
    expireDate: '2023-11-01',
    isUsed: false,
    description: '满1000减200',
    applicable: '全场通用',
    backgroundColor: '#f5f5f5',
    borderColor: '#9e9e9e',
    textColor: '#9e9e9e',
    isExpired: true,
  },
];

export default function CouponsScreen({ onClose }) {
  const [activeTab, setActiveTab] = useState('available');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const getFilteredCoupons = () => {
    switch (activeTab) {
      case 'available':
        return couponData.filter(coupon => !coupon.isUsed && !coupon.isExpired);
      case 'used':
        return couponData.filter(coupon => coupon.isUsed);
      case 'expired':
        return couponData.filter(coupon => coupon.isExpired);
      default:
        return couponData;
    }
  };

  const handleViewDetails = (coupon) => {
    setSelectedCoupon(coupon);
    setShowDetails(true);
  };

  const renderCouponItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.couponItem,
        { backgroundColor: item.backgroundColor, borderColor: item.borderColor }
      ]}
      onPress={() => handleViewDetails(item)}
    >
      <View style={styles.couponLeft}>
        <View style={styles.couponValue}>
          {item.type === 'fixed' ? (
            <Text style={[styles.valueText, { color: item.textColor }]}>
              ¥<Text style={styles.valueLarge}>{item.value}</Text>
            </Text>
          ) : (
            <Text style={[styles.valueText, { color: item.textColor }]}>
              <Text style={styles.valueLarge}>{item.value}</Text>折
            </Text>
          )}
          <Text style={[styles.minAmount, { color: item.textColor }]}>
            满{item.minAmount}元可用
          </Text>
        </View>
      </View>
      <View style={[styles.couponDivider, { backgroundColor: item.borderColor }]}>
        {Array.from({ length: 8 }).map((_, index) => (
          <View
            key={index}
            style={[styles.dividerDot, { backgroundColor: '#f5f5f5' }]}
          />
        ))}
      </View>
      <View style={styles.couponRight}>
        <Text style={[styles.couponDesc, { color: item.textColor }]}>
          {item.description}
        </Text>
        <Text style={styles.couponApplicable}>{item.applicable}</Text>
        <Text style={styles.couponExpire}>
          有效期至: {item.expireDate}
        </Text>
        <TouchableOpacity
          style={[styles.useButton, { borderColor: item.textColor }]}
          disabled={item.isUsed || item.isExpired}
        >
          <Text style={[styles.useButtonText, { color: item.textColor }]}>
            {item.isUsed ? '已使用' : item.isExpired ? '已过期' : '去使用'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCouponDetails = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showDetails}
      onRequestClose={() => setShowDetails(false)}
    >
      <View style={styles.detailsContainer}>
        <View style={styles.detailsContent}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>优惠券详情</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDetails(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {selectedCoupon && (
            <View style={styles.detailsBody}>
              <View
                style={[
                  styles.detailsCoupon,
                  {
                    backgroundColor: selectedCoupon.backgroundColor,
                    borderColor: selectedCoupon.borderColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.detailsValue,
                    { color: selectedCoupon.textColor },
                  ]}
                >
                  {selectedCoupon.type === 'fixed'
                    ? `¥${selectedCoupon.value}`
                    : `${selectedCoupon.value}折`}
                </Text>
                <Text
                  style={[
                    styles.detailsDesc,
                    { color: selectedCoupon.textColor },
                  ]}
                >
                  {selectedCoupon.description}
                </Text>
              </View>

              <View style={styles.detailsInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>优惠券码</Text>
                  <Text style={styles.infoValue}>{selectedCoupon.code}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>使用条件</Text>
                  <Text style={styles.infoValue}>
                    满{selectedCoupon.minAmount}元可用
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>适用范围</Text>
                  <Text style={styles.infoValue}>{selectedCoupon.applicable}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>有效期至</Text>
                  <Text style={styles.infoValue}>{selectedCoupon.expireDate}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>使用状态</Text>
                  <Text style={styles.infoValue}>
                    {selectedCoupon.isUsed
                      ? '已使用'
                      : selectedCoupon.isExpired
                      ? '已过期'
                      : '未使用'}
                  </Text>
                </View>
              </View>

              {!selectedCoupon.isUsed && !selectedCoupon.isExpired && (
                <TouchableOpacity
                  style={[
                    styles.detailsButton,
                    { backgroundColor: selectedCoupon.textColor },
                  ]}
                  onPress={() => {
                    setShowDetails(false);
                    onClose();
                  }}
                >
                  <Text style={styles.detailsButtonText}>去使用</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的优惠券</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'available' && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab('available')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'available' && styles.activeTabText,
            ]}
          >
            可使用
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'used' && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab('used')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'used' && styles.activeTabText,
            ]}
          >
            已使用
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'expired' && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab('expired')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'expired' && styles.activeTabText,
            ]}
          >
            已过期
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getFilteredCoupons()}
        renderItem={renderCouponItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.couponList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="ticket-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>暂无优惠券</Text>
          </View>
        }
      />

      {renderCouponDetails()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#e91e63',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#e91e63',
    fontWeight: '500',
  },
  couponList: {
    padding: 15,
  },
  couponItem: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    overflow: 'hidden',
    height: 120,
  },
  couponLeft: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  couponValue: {
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
  },
  valueLarge: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  minAmount: {
    fontSize: 12,
    marginTop: 5,
  },
  couponDivider: {
    width: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dividerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -3,
  },
  couponRight: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  couponDesc: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  couponApplicable: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  couponExpire: {
    fontSize: 12,
    color: '#999',
  },
  useButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
  },
  useButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailsContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  detailsBody: {
    padding: 20,
  },
  detailsCoupon: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  detailsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsDesc: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailsInfo: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  detailsButton: {
    backgroundColor: '#e91e63',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 