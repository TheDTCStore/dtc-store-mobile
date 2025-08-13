import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function FloatingCustomerService() {
  const handlePress = () => {
    router.push('/customer-service');
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>🎧</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 200, // 调整位置，在购物车按钮上方
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2196F3', // 改为蓝色
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 999,
  },
  icon: {
    fontSize: 20,
    color: '#fff',
  },
}); 