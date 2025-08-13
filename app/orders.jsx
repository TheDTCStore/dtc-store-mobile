import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// 模拟订单数据
const mockOrders = [
  {
    id: 'ORD20241201001',
    status: 'pending',
    statusText: '待付款',
    statusColor: '#ff6600',
    createTime: '2024-12-01 14:30',
    totalAmount: 5798,
    items: [
      {
        id: 1,
        name: '茅台酒 500ml礼盒装',
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
        price: 2899,
        quantity: 2,
        specs: '500ml • 礼盒装'
      }
    ]
  },
  {
    id: 'ORD20241130002',
    status: 'shipping',
    statusText: '待收货',
    statusColor: '#4CAF50',
    createTime: '2024-11-30 16:45',
    totalAmount: 1899,
    expressNo: 'SF1234567890',
    items: [
      {
        id: 2,
        name: '拉菲红酒 750ml',
        image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400',
        price: 1899,
        quantity: 1,
        specs: '750ml • 单瓶装'
      }
    ]
  },
  {
    id: 'ORD20241128003',
    status: 'received',
    statusText: '待评价',
    statusColor: '#2196F3',
    createTime: '2024-11-28 10:20',
    totalAmount: 948,
    items: [
      {
        id: 4,
        name: '青岛啤酒 330ml*6瓶',
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
        price: 158,
        quantity: 6,
        specs: '330ml • 6瓶装'
      }
    ]
  },
  {
    id: 'ORD20241125004',
    status: 'completed',
    statusText: '已完成',
    statusColor: '#666',
    createTime: '2024-11-25 09:15',
    totalAmount: 3299,
    items: [
      {
        id: 3,
        name: '五粮液 52度 500ml',
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
        price: 1649,
        quantity: 2,
        specs: '500ml • 单瓶装'
      }
    ]
  }
];

const tabs = [
  { id: 'all', title: '全部', count: 0 },
  { id: 'pending', title: '待付款', count: 1 },
  { id: 'shipping', title: '待收货', count: 1 },
  { id: 'received', title: '待评价', count: 1 },
  { id: 'completed', title: '已完成', count: 1 }
];

export default function OrdersPage() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState(mockOrders);

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/profile');
    }
  };

  const handleOrderAction = (orderId, action) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    switch (action) {
      case 'pay':
        Alert.alert('付款', `订单 ${orderId} 付款功能`);
        break;
      case 'cancel':
        Alert.alert(
          '取消订单',
          '确定要取消这个订单吗？',
          [
            { text: '取消', style: 'cancel' },
            { 
              text: '确定', 
              onPress: () => {
                setOrders(prev => prev.filter(o => o.id !== orderId));
                Alert.alert('提示', '订单已取消');
              }
            }
          ]
        );
        break;
      case 'track':
        Alert.alert('物流跟踪', `快递单号：${order.expressNo}\n正在配送中...`);
        break;
      case 'confirm':
        Alert.alert(
          '确认收货',
          '确定已收到商品吗？',
          [
            { text: '取消', style: 'cancel' },
            { 
              text: '确认', 
              onPress: () => {
                setOrders(prev => prev.map(o => 
                  o.id === orderId 
                    ? { ...o, status: 'received', statusText: '待评价', statusColor: '#2196F3' }
                    : o
                ));
                Alert.alert('提示', '已确认收货');
              }
            }
          ]
        );
        break;
      case 'review':
        Alert.alert('评价商品', `为订单 ${orderId} 的商品评价`);
        break;
      case 'rebuy':
        Alert.alert('再次购买', `将订单 ${orderId} 的商品加入购物车`);
        break;
      default:
        break;
    }
  };

  const renderOrderActions = (order) => {
    switch (order.status) {
      case 'pending':
        return (
          <View style={styles.orderActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => handleOrderAction(order.id, 'cancel')}
            >
              <Text style={styles.secondaryButtonText}>取消订单</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleOrderAction(order.id, 'pay')}
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
              onPress={() => handleOrderAction(order.id, 'track')}
            >
              <Text style={styles.secondaryButtonText}>查看物流</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleOrderAction(order.id, 'confirm')}
            >
              <Text style={styles.primaryButtonText}>确认收货</Text>
            </TouchableOpacity>
          </View>
        );
      case 'received':
        return (
          <View style={styles.orderActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleOrderAction(order.id, 'review')}
            >
              <Text style={styles.primaryButtonText}>评价商品</Text>
            </TouchableOpacity>
          </View>
        );
      case 'completed':
        return (
          <View style={styles.orderActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => handleOrderAction(order.id, 'rebuy')}
            >
              <Text style={styles.secondaryButtonText}>再次购买</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 头部 */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的订单</Text>
        <View style={styles.headerRight} />
      </SafeAreaView>

      {/* 标签栏 */}
      <View style={styles.tabBar}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.title}
              </Text>
              {tab.count > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{tab.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 订单列表 */}
      <ScrollView 
        style={styles.orderList}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              {/* 订单头部 */}
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderId}>订单号：{order.id}</Text>
                  <Text style={styles.orderTime}>{order.createTime}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: order.statusColor }]}>
                  <Text style={styles.statusText}>{order.statusText}</Text>
                </View>
              </View>

              {/* 商品列表 */}
              {order.items.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.itemSpecs}>{item.specs}</Text>
                    <View style={styles.itemBottom}>
                      <Text style={styles.itemPrice}>¥{item.price}</Text>
                      <Text style={styles.itemQuantity}>×{item.quantity}</Text>
                    </View>
                  </View>
                </View>
              ))}

              {/* 订单总价 */}
              <View style={styles.orderTotal}>
                <Text style={styles.totalText}>
                  共{order.items.reduce((sum, item) => sum + item.quantity, 0)}件商品 
                  合计：<Text style={styles.totalPrice}>¥{order.totalAmount}</Text>
                </Text>
              </View>

              {/* 操作按钮 */}
              {renderOrderActions(order)}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>暂无订单</Text>
            <Text style={styles.emptySubtext}>快去选购心仪的商品吧</Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => router.push('/(tabs)/shop')}
            >
              <LinearGradient
                colors={['#ff6600', '#ff8f33']}
                style={styles.shopButtonGradient}
              >
                <Text style={styles.shopButtonText}>去购物</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  tabBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#ff6600',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ff6600',
    fontWeight: '600',
  },
  tabBadge: {
    backgroundColor: '#ff6600',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  tabBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  orderList: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  itemSpecs: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    color: '#ff6600',
    fontWeight: '600',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  totalPrice: {
    fontSize: 16,
    color: '#ff6600',
    fontWeight: '600',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#ff6600',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  primaryButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 32,
  },
  shopButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  shopButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  shopButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
}); 