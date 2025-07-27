import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileEditScreen({ onClose }) {
  const [username, setUsername] = useState('用户名');
  const [nickname, setNickname] = useState('昵称');
  const [gender, setGender] = useState('男');
  const [phone, setPhone] = useState('138****1234');
  const [email, setEmail] = useState('');
  const [showGenderModal, setShowGenderModal] = useState(false);

  const handleSave = () => {
    // 这里应该有保存逻辑
    Alert.alert('成功', '个人资料已更新');
    onClose();
  };

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    setShowGenderModal(false);
  };

  const renderGenderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showGenderModal}
      onRequestClose={() => setShowGenderModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>选择性别</Text>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => handleGenderSelect('男')}
          >
            <Text style={styles.modalOptionText}>男</Text>
            {gender === '男' && (
              <Ionicons name="checkmark" size={20} color="#e91e63" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => handleGenderSelect('女')}
          >
            <Text style={styles.modalOptionText}>女</Text>
            {gender === '女' && (
              <Ionicons name="checkmark" size={20} color="#e91e63" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={() => handleGenderSelect('保密')}
          >
            <Text style={styles.modalOptionText}>保密</Text>
            {gender === '保密' && (
              <Ionicons name="checkmark" size={20} color="#e91e63" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowGenderModal(false)}
          >
            <Text style={styles.modalButtonText}>取消</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>编辑资料</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{username.charAt(0)}</Text>
            </View>
            <View style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.changeAvatarText}>点击更换头像</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>用户名</Text>
            <TextInput
              style={styles.formInput}
              value={username}
              onChangeText={setUsername}
              placeholder="请输入用户名"
            />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>昵称</Text>
            <TextInput
              style={styles.formInput}
              value={nickname}
              onChangeText={setNickname}
              placeholder="请输入昵称"
            />
          </View>
          <TouchableOpacity
            style={styles.formItem}
            onPress={() => setShowGenderModal(true)}
          >
            <Text style={styles.formLabel}>性别</Text>
            <View style={styles.formRight}>
              <Text style={styles.formValue}>{gender}</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>手机号</Text>
            <Text style={styles.formValue}>{phone}</Text>
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formLabel}>邮箱</Text>
            <TextInput
              style={styles.formInput}
              value={email}
              onChangeText={setEmail}
              placeholder="请输入邮箱"
              keyboardType="email-address"
            />
          </View>
        </View>
      </ScrollView>

      {renderGenderModal()}
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
  saveButton: {
    padding: 5,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#e91e63',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#e91e63',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  changeAvatarText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  formSection: {
    backgroundColor: '#fff',
    marginTop: 15,
  },
  formItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  formLabel: {
    fontSize: 16,
    color: '#333',
    width: 80,
  },
  formInput: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    color: '#333',
  },
  formRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formValue: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#e91e63',
    fontWeight: 'bold',
  },
}); 