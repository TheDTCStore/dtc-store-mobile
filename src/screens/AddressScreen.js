import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// 模拟地址数据
const initialAddresses = [
  {
    id: '1',
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '广州市',
    district: '天河区',
    address: '珠江新城88号高德置地广场A座2501',
    isDefault: true,
  },
  {
    id: '2',
    name: '李四',
    phone: '13900139000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    address: '建国路88号现代城5号楼1单元801',
    isDefault: false,
  },
];

export default function AddressScreen({ onClose, onSelect, isSelecting = false }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    isDefault: false,
  });

  const handleAddAddress = () => {
    setFormData({
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      address: '',
      isDefault: false,
    });
    setShowAddModal(true);
  };

  const handleEditAddress = (address) => {
    setCurrentAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      province: address.province,
      city: address.city,
      district: address.district,
      address: address.address,
      isDefault: address.isDefault,
    });
    setShowEditModal(true);
  };

  const handleDeleteAddress = (id) => {
    Alert.alert(
      '删除地址',
      '确定要删除此地址吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            setAddresses(addresses.filter((address) => address.id !== id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((address) => ({
        ...address,
        isDefault: address.id === id,
      }))
    );
  };

  const handleSubmitAddress = (isEdit) => {
    // 简单验证
    if (!formData.name || !formData.phone || !formData.address) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    if (!/^1\d{10}$/.test(formData.phone)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    if (isEdit && currentAddress) {
      // 编辑现有地址
      setAddresses(
        addresses.map((address) => {
          if (address.id === currentAddress.id) {
            return {
              ...address,
              ...formData,
            };
          }
          // 如果当前地址设为默认，其他地址改为非默认
          if (formData.isDefault && address.isDefault) {
            return {
              ...address,
              isDefault: false,
            };
          }
          return address;
        })
      );
      setShowEditModal(false);
    } else {
      // 添加新地址
      const newAddress = {
        id: Date.now().toString(),
        ...formData,
      };

      // 如果设为默认地址，需要将其他地址改为非默认
      if (formData.isDefault) {
        setAddresses([
          newAddress,
          ...addresses.map((address) => ({
            ...address,
            isDefault: false,
          })),
        ]);
      } else {
        setAddresses([newAddress, ...addresses]);
      }
      setShowAddModal(false);
    }
  };

  const handleSelectAddress = (address) => {
    if (onSelect) {
      onSelect(address);
      onClose();
    }
  };

  const renderAddressItem = ({ item }) => (
    <View style={styles.addressItem}>
      <TouchableOpacity
        style={styles.addressContent}
        onPress={() => isSelecting && handleSelectAddress(item)}
      >
        <View style={styles.addressHeader}>
          <View style={styles.namePhoneContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
          {item.isDefault && (
            <View style={styles.defaultTag}>
              <Text style={styles.defaultTagText}>默认</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressText}>
          {item.province} {item.city} {item.district} {item.address}
        </Text>
      </TouchableOpacity>

      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleSetDefault(item.id)}
        >
          <View style={styles.radioButton}>
            {item.isDefault && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.actionText}>默认地址</Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.actionIconButton}
            onPress={() => handleEditAddress(item)}
          >
            <Ionicons name="create-outline" size={18} color="#666" />
            <Text style={styles.actionIconText}>编辑</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionIconButton}
            onPress={() => handleDeleteAddress(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#666" />
            <Text style={styles.actionIconText}>删除</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderAddressForm = (isEdit) => {
    return (
      <ScrollView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>收货人</Text>
          <TextInput
            style={styles.formInput}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="请输入收货人姓名"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>手机号码</Text>
          <TextInput
            style={styles.formInput}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="请输入手机号码"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>所在地区</Text>
          <View style={styles.regionContainer}>
            <TextInput
              style={[styles.formInput, styles.regionInput]}
              value={formData.province}
              onChangeText={(text) => setFormData({ ...formData, province: text })}
              placeholder="省"
            />
            <TextInput
              style={[styles.formInput, styles.regionInput]}
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder="市"
            />
            <TextInput
              style={[styles.formInput, styles.regionInput]}
              value={formData.district}
              onChangeText={(text) => setFormData({ ...formData, district: text })}
              placeholder="区"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>详细地址</Text>
          <TextInput
            style={[styles.formInput, styles.addressInput]}
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder="请输入详细地址"
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <TouchableOpacity
            style={styles.defaultCheckbox}
            onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
          >
            <View style={styles.checkbox}>
              {formData.isDefault && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>设为默认地址</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleSubmitAddress(isEdit)}
        >
          <Text style={styles.submitButtonText}>保存</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>收货地址</Text>
        <View style={{ width: 24 }} />
      </View>

      {addresses.length > 0 ? (
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.addressList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="location-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>暂无收货地址</Text>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
        <Text style={styles.addButtonText}>新增收货地址</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowAddModal(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>新增收货地址</Text>
            <View style={{ width: 24 }} />
          </View>
          {renderAddressForm(false)}
        </SafeAreaView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
      >
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowEditModal(false)}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>编辑收货地址</Text>
            <View style={{ width: 24 }} />
          </View>
          {renderAddressForm(true)}
        </SafeAreaView>
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
  addressList: {
    padding: 15,
  },
  addressItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addressContent: {
    padding: 15,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  namePhoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  defaultTag: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultTagText: {
    fontSize: 12,
    color: '#e91e63',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e91e63',
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  actionDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  actionIconText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  addButton: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#e91e63',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  formContainer: {
    flex: 1,
    padding: 15,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  formInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  regionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  regionInput: {
    flex: 1,
    marginRight: 10,
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  defaultCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e91e63',
    backgroundColor: formData => formData.isDefault ? '#e91e63' : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#e91e63',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
}); 