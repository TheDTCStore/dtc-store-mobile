import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabBar({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');

  const tabs = [
    { key: 'Home', title: '首页', icon: 'home' },
    { key: 'Shop', title: '商城', icon: 'cart' },
    { key: 'Profile', title: '我的', icon: 'person' },
  ];

  const handleTabPress = (tabKey) => {
    setActiveTab(tabKey);
    navigation(tabKey);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabButton,
            activeTab === tab.key && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress(tab.key)}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={activeTab === tab.key ? '#e91e63' : '#888'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabButton: {
    borderTopWidth: 2,
    borderTopColor: '#e91e63',
  },
  tabText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  activeTabText: {
    color: '#e91e63',
    fontWeight: 'bold',
  },
}); 