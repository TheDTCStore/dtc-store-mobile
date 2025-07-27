import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen({ onClose }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除缓存吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            // 模拟清除缓存
            Alert.alert('成功', '缓存已清除');
          } 
        },
      ]
    );
  };

  const renderSettingItem = (icon, title, value, onValueChange) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color="#666" style={styles.settingIcon} />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#ccc', true: '#ffcdd2' }}
        thumbColor={value ? '#e91e63' : '#f4f3f4'}
      />
    </View>
  );

  const renderLinkItem = (icon, title, onPress) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color="#666" style={styles.settingIcon} />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通用设置</Text>
          {renderSettingItem(
            'notifications-outline',
            '消息通知',
            notificationsEnabled,
            setNotificationsEnabled
          )}
          {renderSettingItem(
            'moon-outline',
            '深色模式',
            darkModeEnabled,
            setDarkModeEnabled
          )}
          {renderSettingItem(
            'location-outline',
            '位置服务',
            locationEnabled,
            setLocationEnabled
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于</Text>
          {renderLinkItem('shield-checkmark-outline', '隐私政策', () => {})}
          {renderLinkItem('document-text-outline', '用户协议', () => {})}
          {renderLinkItem('information-circle-outline', '关于我们', () => {})}
          {renderLinkItem('help-circle-outline', '帮助中心', () => {})}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>其他</Text>
          {renderLinkItem('code-outline', '版本信息', () => {})}
          {renderLinkItem('trash-outline', '清除缓存', handleClearCache)}
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
  section: {
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 15,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 10,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
}); 