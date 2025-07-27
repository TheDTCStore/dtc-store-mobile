import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogisticsScreen from './LogisticsScreen';

// 模拟订单数据
const orderData = [
  {
    id: '1001',
    date: '2023-11-20',
    status: 'pending',
    statusText: '待付款',
    totalPrice: '¥1299',
    items: [
      {
        id: '1',
        name: '法国波尔多红酒 2015年份 干红葡萄酒 750ml',
        price: '¥1299',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      },
    ],
  },
  {
    id: '1002',
    date: '2023-11-18',
    status: 'shipping',
    statusText: '待收货',
    totalPrice: '¥3998',
    items: [
      {
        id: '2',
        name: '茅台飞天53度 500ml',
        price: '¥2899',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1566754436893-98224ee05be3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      },
      {
        id: '3',
        name: '麦卡伦12年单一麦芽威士忌',
        price: '¥1099',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      },
    ],
  },
  {
    id: '1003',
    date: '2023-11-15',
    status: 'review',
    statusText: '待评价',
    totalPrice: '¥799',
    items: [
      {
        id: '4',
        name: '法国巴黎之花香槟',
        price: '¥799',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1594372366237-4b0314bd3227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      },
    ],
  },
  {
    id: '1004',
    date: '2023-11-10',
    status: 'refund',
    statusText: '退款中',
    totalPrice: '¥399',
    items: [
      {
        id: '5',
        name: '智利魔爵珍藏赤霞珠红酒',
        price: '¥399',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      },
    ],
  },
  {
    id: '1005',
    date: '2023-11-05',
    status: 'completed',
    statusText: '已完成',
    totalPrice: '¥1099',
    items: [
      {
        id: '6',
        name: '五粮液52度 500ml',
        price: '¥1099',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1566754436893-98224ee05be3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      },
    ],
  },
];

export default function OrdersScreen({ onClose, initialTab = 'all' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showLogistics, setShowLogistics] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const tabs = [
    { id: 'all', name: '全部' },
    { id: 'pending', name: '待付款' },
    { id: 'shipping', name: '待收货' },
    { id: 'review', name: '待评价' },
    { id: 'refund', name: '退款/售后' },
  ];

  const getFilteredOrders = () => {
    if (activeTab === 'all') {
      return orderData;
    }
    return orderData.filter((order) => order.status === activeTab);
  };

  const filteredOrders = getFilteredOrders();

  const handlePayOrder = (orderId) => {
    Alert.alert(
      '确认支付',
      '是否确认支付此订单？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确认', onPress: () => Alert.alert('提示', '支付成功！') },
      ]
    );
  };

  const handleCancelOrder = (orderId) => {
    Alert.alert(
      '取消订单',
      '是否确认取消此订单？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确认', onPress: () => Alert.alert('提示', '订单已取消！') },
      ]
    );
  };

  const handleConfirmReceipt = (orderId) => {
    Alert.alert(
      '确认收货',
      '是否确认收到商品？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确认', onPress: () => Alert.alert('提示', '已确认收货！') },
      ]
    );
  };

  const handleReviewOrder = (orderId) => {
    Alert.alert('提示', '评价功能开发中...');
  };

  const handleViewLogistics = (orderId) => {
    setSelectedOrderId(orderId);
    setShowLogistics(true);
  };

  const handleApplyRefund = (orderId) => {
    Alert.alert('提示', '退款申请已提交！');
  };

  const handleDeleteOrder = (orderId) => {
    Alert.alert(
      '删除订单',
      '是否确认删除此订单？删除后不可恢复。',
      [
        { text: '取消', style: 'cancel' },
        { text: '确认', onPress: () => Alert.alert('提示', '订单已删除！') },
      ]
    );
  };

  const renderOrderActions = (order) => {
    switch (order.status) {
      case 'pending':
        return (
          <View style={styles.orderActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => handleCancelOrder(order.id)}
            >
              <Text style={styles.secondaryButtonText}>取消订单</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handlePayOrder(order.id)}
            >
              <Text style={styles.primaryButtonText}>立即付款</Text>
            </TouchableOpacity>
          </View>
        );
      case 'shipping':
        return (
          <View style={styles.orderActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => handleViewLogistics(order.id)}
            >
              <Text style={styles.secondaryButtonText}>查看物流</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleConfirmReceipt(order.id)}
            >
              <Text style={styles.primaryButtonText}>确认收货</Text>
            </TouchableOpacity>
          </View>
        );
      case 'review':
        return (
          <View style={styles.orderActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => handleDeleteOrder(order.id)}
            >
              <Text style={styles.secondaryButtonText}>删除订单</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleReviewOrder(order.id)}
            >
              <Text style={styles.primaryButtonText}>评价订单</Text>
            </TouchableOpacity>
          </View>
        );
      case 'refund':
        return (
          <View style={styles.orderActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => handleViewLogistics(order.id)}
            >
              <Text style={styles.secondaryButtonText}>查看进度</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleApplyRefund(order.id)}
            >
              <Text style={styles.primaryButtonText}>修改申请</Text>
            </TouchableOpacity>
          </View>
        );
      case 'completed':
        return (
          <View style={styles.orderActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => handleDeleteOrder(order.id)}
            >
              <Text style={styles.secondaryButtonText}>删除订单</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleReviewOrder(order.id)}
            >
              <Text style={styles.primaryButtonText}>再次购买</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>订单号: {item.id}</Text>
        <Text style={styles.orderStatus}>{item.statusText}</Text>
      </View>

      <View style={styles.orderProducts}>
        {item.items.map((product) => (
          <View key={product.id} style={styles.productItem}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={styles.productPrice}>
                {product.price} x {product.quantity}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.orderDate}>{item.date}</Text>
        <Text style={styles.orderTotal}>
          共{item.items.length}件商品 合计: {item.totalPrice}
        </Text>
      </View>

      {renderOrderActions(item)}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的订单</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                activeTab === tab.id && styles.activeTabItem,
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText,
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.orderList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>暂无相关订单</Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={showLogistics}
        onRequestClose={() => setShowLogistics(false)}
      >
        <LogisticsScreen 
          onClose={() => setShowLogistics(false)}
          orderId={selectedOrderId}
        />
      </Modal>
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
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  activeTabItem: {
    backgroundColor: '#ffebee',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#e91e63',
    fontWeight: '500',
  },
  orderList: {
    padding: 10,
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderId: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    fontSize: 14,
    color: '#e91e63',
    fontWeight: '500',
  },
  orderProducts: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 4,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderDate: {
    fontSize: 14,
    color: '#999',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 12,
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  primaryButton: {
    backgroundColor: '#e91e63',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
}); 