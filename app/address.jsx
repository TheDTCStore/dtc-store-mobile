import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// 模拟地址数据
const mockAddresses = [
  {
    id: 1,
    name: '张三',
    phone: '138****8888',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '三里屯街道工体北路8号院',
    isDefault: true,
  },
  {
    id: 2,
    name: '李四',
    phone: '139****9999',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '陆家嘴环路1000号',
    isDefault: false,
  }
];

export default function AddressPage() {
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState(mockAddresses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  });

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/profile');
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false
    });
    setShowAddModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowAddModal(true);
  };

  const handleDeleteAddress = (id) => {
    const address = addresses.find(addr => addr.id === id);
    Alert.alert(
      '删除地址',
      `确定要删除 ${address.name} 的收货地址吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            setAddresses(prev => prev.filter(addr => addr.id !== id));
            Alert.alert('提示', '地址已删除');
          }
        }
      ]
    );
  };

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    Alert.alert('提示', '已设为默认地址');
  };

  const handleSaveAddress = () => {
    if (!formData.name.trim()) {
      Alert.alert('提示', '请输入收货人姓名');
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert('提示', '请输入手机号');
      return;
    }
    if (!formData.detail.trim()) {
      Alert.alert('提示', '请输入详细地址');
      return;
    }

    if (editingAddress) {
      // 编辑地址
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id ? { ...formData, id: editingAddress.id } : addr
      ));
      Alert.alert('提示', '地址已更新');
    } else {
      // 新增地址
      const newAddress = {
        ...formData,
        id: Date.now(),
        isDefault: addresses.length === 0 || formData.isDefault
      };
      
      if (newAddress.isDefault) {
        // 如果设为默认，取消其他地址的默认状态
        setAddresses(prev => [
          ...prev.map(addr => ({ ...addr, isDefault: false })),
          newAddress
        ]);
      } else {
        setAddresses(prev => [...prev, newAddress]);
      }
      Alert.alert('提示', '地址已添加');
    }

    setShowAddModal(false);
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
        <Text style={styles.headerTitle}>收货地址</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
          <Text style={styles.addButtonText}>新增</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* 地址列表 */}
      <ScrollView 
        style={styles.addressList}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{address.name}</Text>
                  <Text style={styles.userPhone}>{address.phone}</Text>
                </View>
                {address.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>默认</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.addressText}>
                {formatAddress(address)}
              </Text>
              
              <View style={styles.addressActions}>
                {!address.isDefault && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleSetDefault(address.id)}
                  >
                    <Text style={styles.actionButtonText}>设为默认</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditAddress(address)}
                >
                  <Text style={styles.actionButtonText}>编辑</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteAction]}
                  onPress={() => handleDeleteAddress(address.id)}
                >
                  <Text style={[styles.actionButtonText, styles.deleteActionText]}>删除</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📍</Text>
            <Text style={styles.emptyText}>暂无收货地址</Text>
            <Text style={styles.emptySubtext}>添加收货地址，享受便捷配送</Text>
            <TouchableOpacity 
              style={styles.addEmptyButton}
              onPress={handleAddAddress}
            >
              <LinearGradient
                colors={['#ff6600', '#ff8f33']}
                style={styles.addEmptyButtonGradient}
              >
                <Text style={styles.addEmptyButtonText}>添加地址</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 添加/编辑地址弹窗 */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalHeader} edges={['top']}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.modalCancelText}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingAddress ? '编辑地址' : '新增地址'}
            </Text>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={handleSaveAddress}
            >
              <Text style={styles.modalSaveText}>保存</Text>
            </TouchableOpacity>
          </SafeAreaView>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>收货人</Text>
              <TextInput
                style={styles.formInput}
                placeholder="请输入收货人姓名"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>手机号</Text>
              <TextInput
                style={styles.formInput}
                placeholder="请输入手机号"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>所在地区</Text>
              <TouchableOpacity style={styles.regionPicker}>
                <Text style={[styles.regionText, !formData.province && styles.regionPlaceholder]}>
                  {formData.province ? `${formData.province} ${formData.city} ${formData.district}` : '请选择省市区'}
                </Text>
                <Text style={styles.regionArrow}>›</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>详细地址</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="请输入详细地址（街道、门牌号等）"
                multiline
                numberOfLines={3}
                value={formData.detail}
                onChangeText={(text) => setFormData(prev => ({ ...prev, detail: text }))}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.defaultOption}
              onPress={() => setFormData(prev => ({ ...prev, isDefault: !prev.isDefault }))}
            >
              <View style={[styles.checkbox, formData.isDefault && styles.checkboxActive]}>
                {formData.isDefault && <Text style={styles.checkboxIcon}>✓</Text>}
              </View>
              <Text style={styles.defaultOptionText}>设为默认地址</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: '#ff6600',
    fontWeight: '500',
  },
  addressList: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginRight: 12,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  defaultBadge: {
    backgroundColor: '#ff6600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  deleteAction: {},
  deleteActionText: {
    color: '#ff4757',
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
  addEmptyButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  addEmptyButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  addEmptyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalSaveButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  modalSaveText: {
    fontSize: 16,
    color: '#ff6600',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  regionPicker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionText: {
    fontSize: 16,
    color: '#333',
  },
  regionPlaceholder: {
    color: '#999',
  },
  regionArrow: {
    fontSize: 16,
    color: '#999',
  },
  defaultOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxActive: {
    backgroundColor: '#ff6600',
    borderColor: '#ff6600',
  },
  checkboxIcon: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  defaultOptionText: {
    fontSize: 16,
    color: '#333',
  },
}); 