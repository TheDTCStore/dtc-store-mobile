import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen({ onClose, items, totalPrice }) {
  const [selectedAddress, setSelectedAddress] = useState({
    id: '1',
    name: '张三',
    phone: '13812345678',
    address: '北京市朝阳区建国路88号',
    isDefault: true,
  });

  const [paymentMethod, setPaymentMethod] = useState('alipay');
  const [note, setNote] = useState('');

  const handlePlaceOrder = () => {
    // 这里是下单逻辑
    Alert.alert(
      '下单成功',
      '您的订单已提交，我们会尽快为您发货！',
      [
        { text: '确定', onPress: onClose }
      ]
    );
  };

  const renderAddressSection = () => (
    <TouchableOpacity style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="location-outline" size={20} color="#666" />
        <Text style={styles.sectionTitle}>收货地址</Text>
      </View>
      <View style={styles.addressContent}>
        <View style={styles.addressInfo}>
          <Text style={styles.addressName}>
            {selectedAddress.name} {selectedAddress.phone}
          </Text>
          <Text style={styles.addressDetail}>{selectedAddress.address}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  const renderOrderItems = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="wine-outline" size={20} color="#666" />
        <Text style={styles.sectionTitle}>商品信息</Text>
      </View>
      {items.map((item) => (
        <View key={item.cartItemId} style={styles.orderItem}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.itemOptions}>
              {item.options.option && (
                <Text style={styles.optionText}>容量: {item.options.option}</Text>
              )}
              {item.options.vintage && (
                <Text style={styles.optionText}>年份: {item.options.vintage}</Text>
              )}
            </View>
            <View style={styles.itemPriceRow}>
              <Text style={styles.itemPrice}>{item.price}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderPaymentSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="wallet-outline" size={20} color="#666" />
        <Text style={styles.sectionTitle}>支付方式</Text>
      </View>
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'alipay' && styles.selectedPayment
          ]}
          onPress={() => setPaymentMethod('alipay')}
        >
          <Ionicons name="checkmark-circle" size={20} color={paymentMethod === 'alipay' ? "#e91e63" : "#ccc"} />
          <Text style={styles.paymentText}>支付宝</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'wechat' && styles.selectedPayment
          ]}
          onPress={() => setPaymentMethod('wechat')}
        >
          <Ionicons name="checkmark-circle" size={20} color={paymentMethod === 'wechat' ? "#e91e63" : "#ccc"} />
          <Text style={styles.paymentText}>微信支付</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNoteSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="create-outline" size={20} color="#666" />
        <Text style={styles.sectionTitle}>订单备注</Text>
      </View>
      <TextInput
        style={styles.noteInput}
        placeholder="请输入备注信息（选填）"
        value={note}
        onChangeText={setNote}
        multiline
      />
    </View>
  );

  const renderPriceDetails = () => (
    <View style={styles.section}>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>商品金额</Text>
        <Text style={styles.priceValue}>¥{totalPrice.toFixed(2)}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>运费</Text>
        <Text style={styles.priceValue}>¥0.00</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>实付金额</Text>
        <Text style={styles.totalValue}>¥{totalPrice.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>确认订单</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {renderAddressSection()}
        {renderOrderItems()}
        {renderPaymentSection()}
        {renderNoteSection()}
        {renderPriceDetails()}
        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>合计：</Text>
          <Text style={styles.footerTotalValue}>¥{totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>提交订单</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
  },
  addressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    marginBottom: 5,
  },
  addressDetail: {
    fontSize: 14,
    color: '#666',
  },
  orderItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 4,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    marginBottom: 5,
  },
  itemOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  paymentOptions: {
    flexDirection: 'row',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
  },
  selectedPayment: {
    borderColor: '#e91e63',
    backgroundColor: '#ffebee',
  },
  paymentText: {
    marginLeft: 5,
    fontSize: 14,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    padding: 10,
    height: 80,
    textAlignVertical: 'top',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerTotal: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerTotalLabel: {
    fontSize: 14,
  },
  footerTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  placeOrderButton: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
}); 