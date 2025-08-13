import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FloatingCustomerService from '../../components/ui/FloatingCustomerService';
import FloatingCartButton from '../../components/ui/FloatingCartButton';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#ff6600',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 0,
            height: 60 + insets.bottom, // 添加底部安全边距
            paddingBottom: insets.bottom + 8,
            paddingTop: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 2,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: '首页',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ 
                  color, 
                  fontSize: focused ? 24 : 22,
                  transform: [{ scale: focused ? 1.1 : 1 }]
                }}>
                  🏠
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: '商城',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ 
                  color, 
                  fontSize: focused ? 24 : 22,
                  transform: [{ scale: focused ? 1.1 : 1 }]
                }}>
                  🛒
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '我的',
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ 
                  color, 
                  fontSize: focused ? 24 : 22,
                  transform: [{ scale: focused ? 1.1 : 1 }]
                }}>
                  👤
                </Text>
              </View>
            ),
          }}
        />
      </Tabs>

      {/* 悬浮购物车按钮 */}
      <FloatingCartButton cartCount={3} />

      {/* 浮动客服按钮 */}
      <FloatingCustomerService />
    </View>
  );
} 