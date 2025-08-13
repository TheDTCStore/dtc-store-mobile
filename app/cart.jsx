import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  TextInput,
  StatusBar
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

// 模拟购物车数据
const initialCartItems = [
  {
    id: 1,
    name: '茅台酒',
    category: '白酒',
    price: 2899,
    originalPrice: 3299,
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
    quantity: 2,
    selected: true,
    specs: '500ml • 礼盒装',
    tags: ['热销', '精选']
  },
  {
    id: 2,
    name: '拉菲红酒',
    category: '红酒',
    price: 1899,
    originalPrice: 2199,
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400',
    quantity: 1,
    selected: true,
    specs: '750ml • 单瓶装',
    tags: ['进口', '限量']
  },
  {
    id: 4,
    name: '青岛啤酒',
    category: '啤酒',
    price: 158,
    originalPrice: 188,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
    quantity: 6,
    selected: false,
    specs: '330ml • 单瓶装',
    tags: ['经典']
  }
];

export default function CartPage() {
  const insets = useSafeAreaInsets();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [couponCode, setCouponCode] = useState('');

  // 计算选中商品总价
  const selectedItems = cartItems.filter(item => item.selected);
  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalAmount = selectedItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const savings = originalAmount - totalAmount;

  // 修改商品数量
  const updateQuantity = (id, delta) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, Math.min(99, item.quantity + delta));
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // 切换商品选中状态
  const toggleSelection = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    const allSelected = cartItems.every(item => item.selected);
    setCartItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: !allSelected }))
    );
  };

  // 删除商品
  const removeItem = (id) => {
    Alert.alert(
      '删除商品',
      '确定要从购物车中删除这件商品吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            setCartItems(prevItems => prevItems.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  // 应用优惠券
  const applyCoupon = () => {
    if (!couponCode.trim()) {
      Alert.alert('提示', '请输入优惠券代码');
      return;
    }
    Alert.alert('优惠券', `优惠券 "${couponCode}" 使用成功！`);
    setCouponCode('');
  };

  // 去结算
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert('提示', '请选择要结算的商品');
      return;
    }
    // 跳转到结算页面
    router.push('/checkout');
  };

  const renderCartItem = (item) => (
    <View key={item.id} style={styles.cartItem}>
      <TouchableOpacity 
        style={styles.checkbox}
        onPress={() => toggleSelection(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={[styles.checkboxInner, item.selected && styles.checkboxSelected]}>
          {item.selected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        {item.tags && item.tags.includes('热销') && (
          <View style={styles.hotBadge}>
            <Text style={styles.hotBadgeText}>🔥</Text>
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => removeItem(item.id)}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.productSpecs}>{item.specs}</Text>
        
        {item.tags && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>{tag}</Text>
            ))}
          </View>
        )}
        
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>¥{item.price}</Text>
            {item.originalPrice > item.price && (
              <Text style={styles.originalPrice}>¥{item.originalPrice}</Text>
            )}
            {item.originalPrice > item.price && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  省¥{item.originalPrice - item.price}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
              onPress={() => updateQuantity(item.id, -1)}
              disabled={item.quantity <= 1}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.quantityButtonText, item.quantity <= 1 && styles.quantityButtonTextDisabled]}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, 1)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        
        <SafeAreaView style={styles.header} edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>购物车</Text>
            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>
        
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <View style={styles.emptyIconDecoration} />
          </View>
          <Text style={styles.emptyTitle}>购物车是空的</Text>
          <Text style={styles.emptySubtext}>快去选购心仪的美酒吧！</Text>
          <TouchableOpacity 
            style={styles.goShoppingButton}
            onPress={() => router.push('/(tabs)/shop')}
          >
            <LinearGradient
              colors={['#ff6600', '#ff8f33']}
              style={styles.goShoppingGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.goShoppingText}>去逛逛</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 头部导航 */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>购物车</Text>
          <View style={styles.itemCountBadge}>
            <Text style={styles.itemCount}>{cartItems.length}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* 全选操作 */}
      <View style={styles.selectAllContainer}>
        <TouchableOpacity 
          style={styles.selectAllButton} 
          onPress={toggleSelectAll}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={[styles.checkboxInner, cartItems.every(item => item.selected) && styles.checkboxSelected]}>
            {cartItems.every(item => item.selected) && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.selectAllText}>全选</Text>
        </TouchableOpacity>
        <Text style={styles.selectedCount}>已选 {selectedItems.length} 件</Text>
      </View>

      {/* 商品列表 */}
      <ScrollView 
        style={styles.cartList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.cartListContent,
          { paddingBottom: 20 + insets.bottom }
        ]}
      >
        {cartItems.map(renderCartItem)}

        {/* 优惠券 */}
        <View style={styles.couponContainer}>
          <LinearGradient
            colors={['#fff5f0', '#fff']}
            style={styles.couponGradient}
          >
            <View style={styles.couponHeader}>
              <Text style={styles.couponIcon}>🎫</Text>
              <Text style={styles.couponTitle}>优惠券</Text>
              <Text style={styles.couponSubtitle}>享受更多优惠</Text>
            </View>
            <View style={styles.couponInput}>
              <TextInput
                style={styles.couponTextInput}
                placeholder="输入优惠券代码"
                placeholderTextColor="#999"
                value={couponCode}
                onChangeText={setCouponCode}
              />
              <TouchableOpacity 
                style={[styles.couponButton, couponCode.trim() ? styles.couponButtonActive : null]} 
                onPress={applyCoupon}
                disabled={!couponCode.trim()}
              >
                <Text style={[styles.couponButtonText, couponCode.trim() ? styles.couponButtonTextActive : null]}>
                  使用
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* 底部结算栏 */}
      <SafeAreaView style={styles.checkoutContainer} edges={['bottom']}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', '#fff']}
          style={styles.checkoutGradient}
        >
          <View style={styles.priceInfo}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>商品金额：</Text>
              <Text style={styles.priceValue}>¥{originalAmount}</Text>
            </View>
            {savings > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>优惠金额：</Text>
                <Text style={styles.savingsValue}>-¥{savings}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.checkoutActions}>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>实付：</Text>
              <Text style={styles.totalValue}>¥{totalAmount}</Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.checkoutButton, 
                selectedItems.length === 0 && styles.checkoutButtonDisabled
              ]}
              onPress={handleCheckout}
              disabled={selectedItems.length === 0}
            >
              <LinearGradient
                colors={selectedItems.length > 0 ? ['#ff6600', '#ff8f33'] : ['#ccc', '#ccc']}
                style={styles.checkoutButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.checkoutButtonText}>
                  结算({selectedItems.length})
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#f8f9fa',
  },
  backIcon: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  headerRight: {
    width: 44,
  },
  itemCountBadge: {
    backgroundColor: '#ff6600',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 44,
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  selectAllContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#ff6600',
    borderColor: '#ff6600',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectAllText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  selectedCount: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: '500',
  },
  cartList: {
    flex: 1,
  },
  cartListContent: {
    paddingTop: 8,
  },
  cartItem: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  checkbox: {
    paddingTop: 6,
    paddingRight: 12,
  },
  productImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  hotBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotBadgeText: {
    fontSize: 10,
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  deleteButtonText: {
    fontSize: 16,
    opacity: 0.6,
  },
  productSpecs: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tag: {
    fontSize: 10,
    color: '#ff6600',
    backgroundColor: '#fff5f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 6,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff6600',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#ff6600',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  discountText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  quantityButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  quantityButtonTextDisabled: {
    color: '#ccc',
  },
  quantity: {
    fontSize: 15,
    color: '#333',
    paddingHorizontal: 16,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  couponContainer: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  couponGradient: {
    padding: 16,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  couponIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  couponSubtitle: {
    fontSize: 12,
    color: '#ff6600',
    fontWeight: '500',
  },
  couponInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponTextInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    marginRight: 12,
  },
  couponButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
  },
  couponButtonActive: {
    backgroundColor: '#ff6600',
  },
  couponButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  couponButtonTextActive: {
    color: '#fff',
  },
  checkoutContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  checkoutGradient: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  priceInfo: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  savingsValue: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: '600',
  },
  checkoutActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ff6600',
    marginLeft: 6,
  },
  checkoutButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  checkoutButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 80,
    opacity: 0.3,
  },
  emptyIconDecoration: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff6600',
    opacity: 0.2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  goShoppingButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#ff6600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  goShoppingGradient: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    alignItems: 'center',
  },
  goShoppingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
}); 