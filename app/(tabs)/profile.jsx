import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../lib/contexts/AuthContext';

export default function ProfilePage() {
  const { isLoggedIn, user, logout } = useAuth();

  const [stats, setStats] = useState({
    orders: 12,
    favorites: 8,
    reviews: 5,
    coupons: 3,
  });

  // 我的订单快捷入口
  const orderItems = [
    { id: 'pending', title: '待付款', icon: '💰', count: 2 },
    { id: 'shipping', title: '待收货', icon: '📦', count: 1 },
    { id: 'received', title: '待评价', icon: '⭐', count: 3 },
    { id: 'return', title: '退换货', icon: '🔄', count: 0 },
  ];

  // 我的服务
  const serviceItems = [
    [
      { id: 'favorites', title: '我的收藏', icon: '❤️', color: '#ff6b6b' },
      { id: 'coupons', title: '优惠券', icon: '🎫', color: '#ff6600' },
      { id: 'points', title: '积分商城', icon: '💎', color: '#42a5f5' },
      { id: 'vip', title: '会员中心', icon: '👑', color: '#ffa726' },
    ],
    [
      { id: 'address', title: '收货地址', icon: '📍', color: '#66bb6a' },
      { id: 'service', title: '客服中心', icon: '🎧', color: '#42a5f5' },
      { id: 'feedback', title: '意见反馈', icon: '📝', color: '#ff7043' },
      { id: 'settings', title: '设置', icon: '⚙️', color: '#78909c' },
    ]
  ];

  const handleMenuPress = (menuId) => {
    const needLoginMenus = ['orders', 'pending', 'shipping', 'received', 'return', 'favorites', 'coupons', 'points', 'vip', 'address'];
    
    if (needLoginMenus.includes(menuId) && !isLoggedIn) {
      Alert.alert(
        '请先登录',
        '该功能需要登录后使用',
        [
          { text: '取消', style: 'cancel' },
          { text: '去登录', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }

    const menuTitles = {
      pending: '待付款', shipping: '待收货', received: '待评价', return: '退换货',
      favorites: '我的收藏', coupons: '优惠券', points: '积分商城', vip: '会员中心',
      address: '收货地址', service: '客服中心', feedback: '意见反馈', settings: '设置',
    };

    // 实际页面跳转
    switch (menuId) {
      case 'service':
        router.push('/customer-service');
        break;
      case 'orders':
      case 'pending':
      case 'shipping':
      case 'received':
      case 'return':
        router.push('/orders');
        break;
      case 'favorites':
        router.push('/favorites');
        break;
      case 'address':
        router.push('/address');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'feedback':
        router.push('/feedback');
        break;
      case 'coupons':
      case 'points':
      case 'vip':
        Alert.alert('功能跳转', `即将进入：${menuTitles[menuId]}`);
        break;
      default:
        Alert.alert('功能跳转', `即将进入：${menuTitles[menuId]}`);
        break;
    }
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleEditProfile = () => {
    if (!isLoggedIn) {
      handleLogin();
      return;
    }
    Alert.alert('编辑资料', '打开个人资料编辑页面');
  };

  const handleAllOrders = () => {
    if (!isLoggedIn) {
      handleLogin();
      return;
    }
    Alert.alert('我的订单', '查看全部订单');
  };

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '退出', 
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              Alert.alert('提示', '已退出登录');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff6600" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 用户信息区域 */}
        <LinearGradient
          colors={['#ff6600', '#ff8f33']}
          style={styles.userSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.userContent}>
              {isLoggedIn ? (
                <View style={styles.userInfo}>
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={styles.userMeta}>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{user.level}</Text>
                      </View>
                      <Text style={styles.userPhone}>{user.phone}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                    <Text style={styles.editIcon}>✏️</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.loginPrompt} onPress={handleLogin}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarIcon}>👤</Text>
                  </View>
                  <View style={styles.loginPromptContent}>
                    <Text style={styles.loginPromptTitle}>点击登录</Text>
                    <Text style={styles.loginPromptSubtitle}>登录后享受更多服务</Text>
                  </View>
                  <Text style={styles.loginArrow}>›</Text>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* 积分钱包区域 */}
        <View style={styles.walletSection}>
          <TouchableOpacity 
            style={styles.walletItem}
            onPress={() => handleMenuPress('points')}
          >
            <Text style={styles.walletValue}>{isLoggedIn ? user.points : '—'}</Text>
            <Text style={styles.walletLabel}>积分</Text>
          </TouchableOpacity>
          <View style={styles.walletDivider} />
          <TouchableOpacity 
            style={styles.walletItem}
            onPress={() => handleMenuPress('coupons')}
          >
            <Text style={styles.walletValue}>{isLoggedIn ? stats.coupons : '—'}</Text>
            <Text style={styles.walletLabel}>优惠券</Text>
          </TouchableOpacity>
          <View style={styles.walletDivider} />
          <TouchableOpacity 
            style={styles.walletItem}
            onPress={() => handleMenuPress('favorites')}
          >
            <Text style={styles.walletValue}>{isLoggedIn ? stats.favorites : '—'}</Text>
            <Text style={styles.walletLabel}>收藏</Text>
          </TouchableOpacity>
        </View>

        {/* 我的订单 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的订单</Text>
            <TouchableOpacity onPress={handleAllOrders}>
              <Text style={styles.sectionMore}>查看全部 ›</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.orderGrid}>
            {orderItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.orderItem}
                onPress={() => handleMenuPress(item.id)}
              >
                <View style={styles.orderIconContainer}>
                  <Text style={styles.orderIcon}>{item.icon}</Text>
                  {item.count > 0 && isLoggedIn && (
                    <View style={styles.orderBadge}>
                      <Text style={styles.orderBadgeText}>{item.count}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.orderTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 我的服务 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的服务</Text>
          </View>
          {serviceItems.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.serviceRow}>
              {row.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.serviceItem}
                  onPress={() => handleMenuPress(item.id)}
                >
                  <View style={[styles.serviceIconContainer, { backgroundColor: item.color + '20' }]}>
                    <Text style={styles.serviceIcon}>{item.icon}</Text>
                  </View>
                  <Text style={styles.serviceTitle}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        {/* 退出登录 */}
        {isLoggedIn && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>退出登录</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* 底部安全区域 */}
      <SafeAreaView edges={['bottom']} style={styles.bottomSafeArea} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  userSection: {
    paddingBottom: 28,
  },
  userContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarIcon: {
    fontSize: 28,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  levelText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  userPhone: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editIcon: {
    fontSize: 14,
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginPromptContent: {
    flex: 1,
    marginLeft: 16,
  },
  loginPromptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  loginPromptSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  loginArrow: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '300',
  },
  walletSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: -12,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  walletItem: {
    flex: 1,
    alignItems: 'center',
  },
  walletDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#f0f0f0',
  },
  walletValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  walletLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  sectionMore: {
    fontSize: 12,
    color: '#ff6600',
    fontWeight: '500',
  },
  orderGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  orderItem: {
    flex: 1,
    alignItems: 'center',
  },
  orderIconContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  orderIcon: {
    fontSize: 26,
  },
  orderBadge: {
    position: 'absolute',
    top: -3,
    right: -6,
    backgroundColor: '#ff6600',
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  orderBadgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: 'bold',
  },
  orderTitle: {
    fontSize: 12,
    color: '#666',
  },
  serviceRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceIcon: {
    fontSize: 22,
  },
  serviceTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 15,
    color: '#ff6600',
    fontWeight: '600',
  },
  bottomSafeArea: {
    backgroundColor: '#f8f9fa',
  },
}); 