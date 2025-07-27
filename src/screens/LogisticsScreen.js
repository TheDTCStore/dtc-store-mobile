import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// 模拟物流数据
const logisticsData = {
  orderId: '1002',
  company: '顺丰速运',
  trackingNumber: 'SF1234567890',
  status: '运输中',
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
  recipient: {
    name: '张三',
    phone: '138****1234',
    address: '广东省广州市天河区珠江新城88号高德置地广场A座2501',
  },
  tracking: [
    { 
      time: '2023-11-21 14:30', 
      status: '运输中', 
      desc: '【广州市】快递员正在派送途中，请保持电话畅通' 
    },
    { 
      time: '2023-11-21 09:15', 
      status: '运输中', 
      desc: '【广州市】已到达广州白云区配送中心' 
    },
    { 
      time: '2023-11-20 20:30', 
      status: '运输中', 
      desc: '【上海市】已发出，下一站广州转运中心' 
    },
    { 
      time: '2023-11-20 18:50', 
      status: '已揽收', 
      desc: '【上海市】顺丰速运已揽收' 
    },
    { 
      time: '2023-11-20 15:30', 
      status: '已发货', 
      desc: '卖家已发货' 
    },
    { 
      time: '2023-11-20 14:20', 
      status: '已付款', 
      desc: '买家已付款' 
    },
  ]
};

export default function LogisticsScreen({ onClose, orderId = '1002' }) {
  // 在实际应用中，应该根据orderId获取物流信息
  // 这里使用模拟数据

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>物流详情</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons name="cube-outline" size={24} color="#e91e63" />
            <Text style={styles.statusText}>{logisticsData.status}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyText}>
              {logisticsData.company} | {logisticsData.trackingNumber}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>包裹信息</Text>
          {logisticsData.items.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.productPrice}>
                  {item.price} x {item.quantity}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>收货信息</Text>
          <View style={styles.recipientInfo}>
            <View style={styles.recipientRow}>
              <Ionicons name="person-outline" size={18} color="#666" style={styles.recipientIcon} />
              <Text style={styles.recipientText}>{logisticsData.recipient.name}</Text>
            </View>
            <View style={styles.recipientRow}>
              <Ionicons name="call-outline" size={18} color="#666" style={styles.recipientIcon} />
              <Text style={styles.recipientText}>{logisticsData.recipient.phone}</Text>
            </View>
            <View style={styles.recipientRow}>
              <Ionicons name="location-outline" size={18} color="#666" style={styles.recipientIcon} />
              <Text style={styles.recipientText}>{logisticsData.recipient.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>物流跟踪</Text>
          <View style={styles.trackingTimeline}>
            {logisticsData.tracking.map((track, index) => (
              <View key={index} style={styles.trackingItem}>
                <View style={styles.trackingPoint}>
                  <View 
                    style={[
                      styles.trackingDot,
                      index === 0 && styles.trackingActiveDot
                    ]} 
                  />
                  {index !== logisticsData.tracking.length - 1 && (
                    <View style={styles.trackingLine} />
                  )}
                </View>
                <View style={styles.trackingContent}>
                  <Text style={styles.trackingTime}>{track.time}</Text>
                  <Text style={[
                    styles.trackingDesc,
                    index === 0 && styles.trackingActiveDesc
                  ]}>
                    {track.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.contactSection}>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="call" size={20} color="#e91e63" />
            <Text style={styles.contactButtonText}>联系快递员</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#e91e63" />
            <Text style={styles.contactButtonText}>联系客服</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  statusCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e91e63',
    marginLeft: 10,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 4,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
  recipientInfo: {
    paddingVertical: 5,
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  recipientIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  recipientText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  trackingTimeline: {
    paddingLeft: 5,
  },
  trackingItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  trackingPoint: {
    width: 20,
    alignItems: 'center',
  },
  trackingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  trackingActiveDot: {
    backgroundColor: '#e91e63',
  },
  trackingLine: {
    width: 2,
    height: 50,
    backgroundColor: '#eee',
    marginTop: 5,
    alignSelf: 'center',
  },
  trackingContent: {
    flex: 1,
    marginLeft: 10,
  },
  trackingTime: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  trackingDesc: {
    fontSize: 14,
    color: '#333',
  },
  trackingActiveDesc: {
    color: '#e91e63',
    fontWeight: '500',
  },
  contactSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  contactButtonText: {
    fontSize: 14,
    color: '#e91e63',
    marginLeft: 5,
  },
}); 