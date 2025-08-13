import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  TextInput
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function CheckoutPage() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
  // 模拟从购物车传来的商品数据
  const [orderItems] = useState([
    {
      id: 1,
      name: '茅台酒',
      category: '白酒',
      price: 2899,
      originalPrice: 3299,
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
      quantity: 2,
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
      specs: '750ml • 单瓶装',
      tags: ['进口', '限量']
    }
  ]);

  const [selectedAddress] = useState({
    id: 1,
    name: '张三',
    phone: '138****8888',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '三里屯街道工体北路8号院',
    isDefault: true,
  });

  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('wechat');
  const [remark, setRemark] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // 计算价格
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = orderItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const savings = originalTotal - subtotal;
  const deliveryFee = deliveryOption === 'express' ? 15 : 0;
  const finalTotal = subtotal + deliveryFee - discount;

  const deliveryOptions = [
    { id: 'standard', name: '标准配送', desc: '预计3-5天送达', fee: 0 },
    { id: 'express', name: '快速配送', desc: '预计1-2天送达', fee: 15 }
  ];

  const paymentMethods = [
    { id: 'wechat', name: '微信支付', icon: '💬', color: '#1aad19' },
    { id: 'alipay', name: '支付宝', icon: '💳', color: '#1678ff' },
    { id: 'card', name: '银行卡', icon: '💰', color: '#ff6600' }
  ];

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/cart');
    }
  };

  const handleChangeAddress = () => {
    router.push('/address');
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      Alert.alert('提示', '请输入优惠券代码');
      return;
    }

    // 模拟优惠券验证
    if (couponCode === 'SAVE100') {
      setDiscount(100);
      Alert.alert('优惠券已使用', '已减免 ¥100');
    } else {
      Alert.alert('优惠券无效', '请检查优惠券代码是否正确');
    }
  };

  const handleSubmitOrder = () => {
    Alert.alert(
      '确认支付',
      `支付金额：¥${finalTotal}\n支付方式：${paymentMethods.find(p => p.id === paymentMethod)?.name}`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认支付',
          onPress: () => {
            // 模拟支付成功
            Alert.alert(
              '支付成功',
              '订单已提交，请耐心等待配送',
              [
                {
                  text: '查看订单',
                  onPress: () => router.push('/orders')
                }
              ]
            );
          }
        }
      ]
    );
  };

  const formatAddress = (address) => {
    return `${address.province}${address.city}${address.district}${address.detail}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 头部 */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>确认订单</Text>
        <View style={styles.headerRight} />
      </SafeAreaView>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 收货地址 */}
        <TouchableOpacity style={styles.addressCard} onPress={handleChangeAddress}>
          <View style={styles.addressHeader}>
            <Text style={styles.addressIcon}>📍</Text>
            <Text style={styles.addressTitle}>收货地址</Text>
            <Text style={styles.addressArrow}>›</Text>
          </View>
          <View style={styles.addressContent}>
            <View style={styles.addressInfo}>
              <Text style={styles.addressName}>{selectedAddress.name}</Text>
              <Text style={styles.addressPhone}>{selectedAddress.phone}</Text>
            </View>
            <Text style={styles.addressDetail}>
              {formatAddress(selectedAddress)}
            </Text>
          </View>
        </TouchableOpacity>

        {/* 商品列表 */}
        <View style={styles.itemsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>商品清单</Text>
            <Text style={styles.itemCount}>共{orderItems.length}件</Text>
          </View>
          {orderItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemSpecs}>{item.specs}</Text>
                <View style={styles.itemTags}>
                  {item.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.itemBottom}>
                  <Text style={styles.itemPrice}>¥{item.price}</Text>
                  <Text style={styles.itemQuantity}>×{item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 配送方式 */}
        <View style={styles.deliveryCard}>
          <Text style={styles.cardTitle}>配送方式</Text>
          {deliveryOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.deliveryOption, deliveryOption === option.id && styles.deliveryOptionActive]}
              onPress={() => setDeliveryOption(option.id)}
            >
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryName}>{option.name}</Text>
                <Text style={styles.deliveryDesc}>{option.desc}</Text>
              </View>
              <View style={styles.deliveryRight}>
                <Text style={styles.deliveryFee}>
                  {option.fee > 0 ? `¥${option.fee}` : '免费'}
                </Text>
                <View style={[styles.radio, deliveryOption === option.id && styles.radioActive]}>
                  {deliveryOption === option.id && <View style={styles.radioDot} />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 支付方式 */}
        <View style={styles.paymentCard}>
          <Text style={styles.cardTitle}>支付方式</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.paymentOption, paymentMethod === method.id && styles.paymentOptionActive]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <View style={styles.paymentInfo}>
                <View style={[styles.paymentIcon, { backgroundColor: method.color }]}>
                  <Text style={styles.paymentIconText}>{method.icon}</Text>
                </View>
                <Text style={styles.paymentName}>{method.name}</Text>
              </View>
              <View style={[styles.radio, paymentMethod === method.id && styles.radioActive]}>
                {paymentMethod === method.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 优惠券 */}
        <View style={styles.couponCard}>
          <Text style={styles.cardTitle}>优惠券</Text>
          <View style={styles.couponInput}>
            <TextInput
              style={styles.couponTextInput}
              placeholder="请输入优惠券代码"
              value={couponCode}
              onChangeText={setCouponCode}
            />
            <TouchableOpacity style={styles.couponButton} onPress={handleApplyCoupon}>
              <Text style={styles.couponButtonText}>使用</Text>
            </TouchableOpacity>
          </View>
          {discount > 0 && (
            <Text style={styles.couponSuccess}>已减免 ¥{discount}</Text>
          )}
        </View>

        {/* 订单备注 */}
        <View style={styles.remarkCard}>
          <Text style={styles.cardTitle}>订单备注</Text>
          <TextInput
            style={styles.remarkInput}
            placeholder="选填，请输入备注信息"
            multiline
            numberOfLines={3}
            value={remark}
            onChangeText={setRemark}
          />
        </View>

        {/* 价格明细 */}
        <View style={styles.priceCard}>
          <Text style={styles.cardTitle}>价格明细</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>商品小计</Text>
            <Text style={styles.priceValue}>¥{subtotal}</Text>
          </View>
          {savings > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>商品优惠</Text>
              <Text style={[styles.priceValue, styles.savingsText]}>-¥{savings}</Text>
            </View>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>配送费</Text>
            <Text style={styles.priceValue}>
              {deliveryFee > 0 ? `¥${deliveryFee}` : '免费'}
            </Text>
          </View>
          {discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>优惠券</Text>
              <Text style={[styles.priceValue, styles.savingsText]}>-¥{discount}</Text>
            </View>
          )}
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>实付款</Text>
            <Text style={styles.totalValue}>¥{finalTotal}</Text>
          </View>
        </View>
      </ScrollView>

      {/* 底部提交栏 */}
      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        <View style={styles.priceInfo}>
          <Text style={styles.totalText}>实付：</Text>
          <Text style={styles.totalPrice}>¥{finalTotal}</Text>
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitOrder}>
          <LinearGradient
            colors={['#ff6600', '#ff8f33']}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>提交订单</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 16,
  },
  addressCard: {
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
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  addressArrow: {
    fontSize: 16,
    color: '#999',
  },
  addressContent: {},
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginRight: 12,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
  },
  addressDetail: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  itemsCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 16,
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
    marginBottom: 4,
  },
  itemTags: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#fff5f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  tagText: {
    fontSize: 10,
    color: '#ff6600',
    fontWeight: '500',
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
  deliveryCard: {
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
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deliveryOptionActive: {
    backgroundColor: '#fff5f0',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  deliveryDesc: {
    fontSize: 12,
    color: '#666',
  },
  deliveryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryFee: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: '600',
    marginRight: 12,
  },
  paymentCard: {
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
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentOptionActive: {
    backgroundColor: '#fff5f0',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  paymentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentIconText: {
    fontSize: 16,
  },
  paymentName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#ff6600',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff6600',
  },
  couponCard: {
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
  couponInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  couponTextInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    marginRight: 12,
  },
  couponButton: {
    backgroundColor: '#ff6600',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  couponButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  couponSuccess: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 8,
  },
  remarkCard: {
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
  remarkInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    marginTop: 12,
    height: 80,
    textAlignVertical: 'top',
  },
  priceCard: {
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
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
  },
  savingsText: {
    color: '#4CAF50',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    color: '#ff6600',
    fontWeight: '700',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 14,
    color: '#666',
  },
  totalPrice: {
    fontSize: 18,
    color: '#ff6600',
    fontWeight: '700',
  },
  submitButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
}); 