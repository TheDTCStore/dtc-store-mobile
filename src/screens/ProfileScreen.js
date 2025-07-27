import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsScreen from './SettingsScreen';
import ProfileEditScreen from './ProfileEditScreen';
import CartScreen from './CartScreen';
import CheckoutScreen from './CheckoutScreen';
import OrdersScreen from './OrdersScreen';
import FavoritesScreen from './FavoritesScreen';
import CustomerServiceScreen from './CustomerServiceScreen';
import AddressScreen from './AddressScreen';
import CouponsScreen from './CouponsScreen';
import MembershipScreen from './MembershipScreen';

export default function ProfileScreen({ activeTab, onTabPress }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [initialOrderTab, setInitialOrderTab] = useState('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCustomerService, setShowCustomerService] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [showMembership, setShowMembership] = useState(false);

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleOpenProfileEdit = () => {
    setShowProfileEdit(true);
  };

  const handleOpenCart = () => {
    setShowCart(true);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleOpenOrders = (tab = 'all') => {
    setInitialOrderTab(tab);
    setShowOrders(true);
  };

  const handleOpenFavorites = () => {
    setShowFavorites(true);
  };

  const handleOpenCustomerService = () => {
    setShowCustomerService(true);
  };

  const handleOpenAddress = () => {
    setShowAddress(true);
  };

  const handleOpenCoupons = () => {
    setShowCoupons(true);
  };

  const handleOpenMembership = () => {
    setShowMembership(true);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>个人中心</Text>
          <TouchableOpacity style={styles.settingsButton} onPress={handleOpenSettings}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.profileCard} onPress={handleOpenProfileEdit}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>张三</Text>
            <View style={styles.membershipContainer}>
              <TouchableOpacity style={styles.membershipBadge} onPress={handleOpenMembership}>
                <Text style={styles.membershipText}>品鉴家会员</Text>
                <Ionicons name="chevron-forward" size={16} color="#e91e63" />
              </TouchableOpacity>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem} onPress={handleOpenFavorites}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>收藏</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={handleOpenCoupons}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>优惠券</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={handleOpenMembership}>
            <Text style={styles.statValue}>520</Text>
            <Text style={styles.statLabel}>酒币</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ordersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的订单</Text>
            <TouchableOpacity style={styles.viewAllButton} onPress={() => handleOpenOrders('all')}>
              <Text style={styles.viewAllText}>全部订单</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
          </View>
          <View style={styles.orderStatusContainer}>
            <TouchableOpacity
              style={styles.orderStatusItem}
              onPress={() => handleOpenOrders('pending')}
            >
              <Ionicons name="wallet-outline" size={24} color="#e91e63" />
              <Text style={styles.orderStatusText}>待付款</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderStatusItem}
              onPress={() => handleOpenOrders('shipping')}
            >
              <Ionicons name="cube-outline" size={24} color="#e91e63" />
              <Text style={styles.orderStatusText}>待发货</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderStatusItem}
              onPress={() => handleOpenOrders('shipping')}
            >
              <Ionicons name="car-outline" size={24} color="#e91e63" />
              <Text style={styles.orderStatusText}>待收货</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderStatusItem}
              onPress={() => handleOpenOrders('review')}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#e91e63" />
              <Text style={styles.orderStatusText}>待评价</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderStatusItem}
              onPress={() => handleOpenOrders('refund')}
            >
              <Ionicons name="refresh-outline" size={24} color="#e91e63" />
              <Text style={styles.orderStatusText}>退款/售后</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的服务</Text>
          </View>
          <View style={styles.menuGrid}>
            <TouchableOpacity style={styles.menuItem} onPress={handleOpenCart}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="cart-outline" size={24} color="#e91e63" />
              </View>
              <Text style={styles.menuText}>购物车</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleOpenFavorites}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="heart-outline" size={24} color="#e91e63" />
              </View>
              <Text style={styles.menuText}>我的收藏</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleOpenCoupons}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="ticket-outline" size={24} color="#e91e63" />
              </View>
              <Text style={styles.menuText}>优惠券</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleOpenAddress}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="location-outline" size={24} color="#e91e63" />
              </View>
              <Text style={styles.menuText}>收货地址</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleOpenCustomerService}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="headset-outline" size={24} color="#e91e63" />
              </View>
              <Text style={styles.menuText}>客服中心</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleOpenMembership}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="wine-outline" size={24} color="#e91e63" />
              </View>
              <Text style={styles.menuText}>品鉴记录</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleOpenMembership}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="star-outline" size={24} color="#e91e63" />
              </View>
              <Text style={styles.menuText}>会员特权</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleOpenOrders}>
              <View style={styles.menuIconContainer}>
                <Ionicons name="document-text-outline" size={24} color="#e91e63" />
              </View>
              <Text style={styles.menuText}>全部订单</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showSettings}
        onRequestClose={() => setShowSettings(false)}
      >
        <SettingsScreen onClose={() => setShowSettings(false)} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showProfileEdit}
        onRequestClose={() => setShowProfileEdit(false)}
      >
        <ProfileEditScreen onClose={() => setShowProfileEdit(false)} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showCart}
        onRequestClose={() => setShowCart(false)}
      >
        <CartScreen onClose={() => setShowCart(false)} onCheckout={handleCheckout} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showCheckout}
        onRequestClose={() => setShowCheckout(false)}
      >
        <CheckoutScreen onClose={() => setShowCheckout(false)} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showOrders}
        onRequestClose={() => setShowOrders(false)}
      >
        <OrdersScreen onClose={() => setShowOrders(false)} initialTab={initialOrderTab} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showFavorites}
        onRequestClose={() => setShowFavorites(false)}
      >
        <FavoritesScreen onClose={() => setShowFavorites(false)} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showCustomerService}
        onRequestClose={() => setShowCustomerService(false)}
      >
        <CustomerServiceScreen onClose={() => setShowCustomerService(false)} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showAddress}
        onRequestClose={() => setShowAddress(false)}
      >
        <AddressScreen onClose={() => setShowAddress(false)} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showCoupons}
        onRequestClose={() => setShowCoupons(false)}
      >
        <CouponsScreen onClose={() => setShowCoupons(false)} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showMembership}
        onRequestClose={() => setShowMembership(false)}
      >
        <MembershipScreen onClose={() => setShowMembership(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  membershipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  membershipText: {
    fontSize: 12,
    color: '#e91e63',
    marginRight: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingVertical: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e91e63',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  ordersSection: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#999',
    marginRight: 5,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  orderStatusItem: {
    alignItems: 'center',
  },
  orderStatusText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  menuSection: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingVertical: 15,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  menuItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuText: {
    fontSize: 12,
    color: '#666',
  },
}); 