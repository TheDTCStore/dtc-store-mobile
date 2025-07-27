import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// 模拟收藏数据
const favoriteData = [
  {
    id: '1',
    name: '法国波尔多红酒 2015年份 干红葡萄酒 750ml',
    price: '¥1299',
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    date: '2023-11-20',
  },
  {
    id: '2',
    name: '茅台飞天53度 500ml',
    price: '¥2899',
    image: 'https://images.unsplash.com/photo-1566754436893-98224ee05be3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    date: '2023-11-18',
  },
  {
    id: '3',
    name: '麦卡伦12年单一麦芽威士忌',
    price: '¥899',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    date: '2023-11-15',
  },
  {
    id: '4',
    name: '法国巴黎之花香槟',
    price: '¥799',
    image: 'https://images.unsplash.com/photo-1594372366237-4b0314bd3227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    date: '2023-11-10',
  },
];

export default function FavoritesScreen({ onClose, onProductPress }) {
  const [favorites, setFavorites] = useState(favoriteData);

  const handleRemoveFavorite = (id) => {
    Alert.alert(
      '移除收藏',
      '确定要移除此商品吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            setFavorites(favorites.filter(item => item.id !== id));
          }
        },
      ]
    );
  };

  const handleProductPress = (product) => {
    if (onProductPress) {
      onProductPress(product);
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <TouchableOpacity 
        style={styles.productContainer}
        onPress={() => handleProductPress(item)}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
          <Text style={styles.favoriteDate}>收藏于 {item.date}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的收藏</Text>
        <View style={{ width: 24 }} />
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.favoriteList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>暂无收藏商品</Text>
          <TouchableOpacity style={styles.shopButton} onPress={onClose}>
            <Text style={styles.shopButtonText}>去逛逛</Text>
          </TouchableOpacity>
        </View>
      )}
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
  favoriteList: {
    padding: 10,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 5,
  },
  favoriteDate: {
    fontSize: 12,
    color: '#999',
  },
  removeButton: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 20,
    marginBottom: 30,
  },
  shopButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#e91e63',
    borderRadius: 20,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
  },
}); 