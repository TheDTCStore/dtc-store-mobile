import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Switch
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function SettingsPage() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState({
    notifications: true,
    orderUpdates: true,
    promotions: false,
    darkMode: false,
    autoLogin: true,
    fingerprint: false,
  });

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/profile');
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleClearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除应用缓存吗？这将删除临时文件，不会影响您的个人数据。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            Alert.alert('提示', '缓存已清除');
          }
        }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      '关于应用',
      '精品酒类商城 v1.0.0\n\n为您提供优质的酒类购物体验\n\n© 2024 酒类商城. All rights reserved.'
    );
  };

  const handlePrivacy = () => {
    Alert.alert('隐私政策', '隐私政策详情页面');
  };

  const handleTerms = () => {
    Alert.alert('服务条款', '服务条款详情页面');
  };

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出当前账号吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '退出',
          style: 'destructive',
          onPress: () => {
            Alert.alert('提示', '已退出登录', [
              {
                text: '确定',
                onPress: () => router.push('/auth/login')
              }
            ]);
          }
        }
      ]
    );
  };

  const settingsSections = [
    {
      title: '消息通知',
      items: [
        {
          id: 'notifications',
          title: '推送通知',
          subtitle: '接收应用推送消息',
          type: 'switch',
          value: settings.notifications
        },
        {
          id: 'orderUpdates',
          title: '订单通知',
          subtitle: '订单状态变更提醒',
          type: 'switch',
          value: settings.orderUpdates
        },
        {
          id: 'promotions',
          title: '优惠推广',
          subtitle: '接收促销活动信息',
          type: 'switch',
          value: settings.promotions
        }
      ]
    },
    {
      title: '安全设置',
      items: [
        {
          id: 'autoLogin',
          title: '自动登录',
          subtitle: '下次启动时自动登录',
          type: 'switch',
          value: settings.autoLogin
        },
        {
          id: 'fingerprint',
          title: '指纹解锁',
          subtitle: '使用指纹快速登录',
          type: 'switch',
          value: settings.fingerprint
        }
      ]
    },
    {
      title: '应用设置',
      items: [
        {
          id: 'darkMode',
          title: '深色模式',
          subtitle: '开启深色主题',
          type: 'switch',
          value: settings.darkMode
        },
        {
          id: 'clearCache',
          title: '清除缓存',
          subtitle: '清理应用临时文件',
          type: 'action',
          action: handleClearCache
        }
      ]
    },
    {
      title: '其他',
      items: [
        {
          id: 'about',
          title: '关于我们',
          subtitle: '应用版本和信息',
          type: 'action',
          action: handleAbout
        },
        {
          id: 'privacy',
          title: '隐私政策',
          subtitle: '查看隐私保护条款',
          type: 'action',
          action: handlePrivacy
        },
        {
          id: 'terms',
          title: '服务条款',
          subtitle: '查看使用协议',
          type: 'action',
          action: handleTerms
        }
      ]
    }
  ];

  const renderSettingItem = (item) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.type === 'action' ? item.action : () => toggleSetting(item.id)}
        disabled={item.type === 'switch'}
      >
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
        <View style={styles.settingControl}>
          {item.type === 'switch' ? (
            <Switch
              value={item.value}
              onValueChange={() => toggleSetting(item.id)}
              trackColor={{ false: '#e0e0e0', true: '#ff6600' }}
              thumbColor={item.value ? '#fff' : '#f4f3f4'}
            />
          ) : (
            <Text style={styles.settingArrow}>›</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 头部 */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>设置</Text>
        <View style={styles.headerRight} />
      </SafeAreaView>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item) => renderSettingItem(item))}
            </View>
          </View>
        ))}

        {/* 退出登录按钮 */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>退出登录</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  settingControl: {
    marginLeft: 16,
  },
  settingArrow: {
    fontSize: 18,
    color: '#999',
  },
  logoutSection: {
    marginTop: 32,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#ff4757',
    fontWeight: '600',
  },
}); 