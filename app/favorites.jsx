import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import ProductCard from '../components/ui/ProductCard';

// 模拟收藏的商品数据
const mockFavorites = [
  {
    id: 1,
    name: '茅台酒',
    category: '白酒',
    price: 2899,
    originalPrice: 3299,
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
    description: '贵州茅台，国酒典范',
    rating: 4.9,
    reviews: 2456,
    stock: 100,
    tags: ['热销', '精选'],
    specifications: [
      { name: '容量', options: ['500ml', '1000ml'] },
      { name: '包装', options: ['单瓶装', '礼盒装'] }
    ],
    addedTime: '2024-11-28 15:30'
  },
  {
    id: 2,
    name: '拉菲红酒',
    category: '红酒',
    price: 1899,
    originalPrice: 2199,
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400',
    description: '法国进口红酒，口感醇厚',
    rating: 4.8,
    reviews: 1823,
    stock: 50,
    tags: ['进口', '限量'],
    specifications: [
      { name: '容量', options: ['750ml'] },
      { name: '年份', options: ['2018', '2019', '2020'] }
    ],
    addedTime: '2024-11-25 09:15'
  },
  {
    id: 5,
    name: '威士忌',
    category: '洋酒',
    price: 899,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400',
    description: '苏格兰威士忌，单一麦芽',
    rating: 4.7,
    reviews: 892,
    stock: 30,
    tags: ['进口'],
    specifications: [
      { name: '容量', options: ['700ml'] },
      { name: '年份', options: ['12年', '18年'] }
    ],
    addedTime: '2024-11-20 16:45'
  }
];

export default function FavoritesPage() {
  const insets = useSafeAreaInsets();
  const [favorites, setFavorites] = useState(mockFavorites);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/profile');
    }
  };

  const handleProductPress = (product) => {
    if (isEditMode) {
      toggleSelectItem(product.id);
    } else {
      router.push(`/product/${product.id}`);
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === favorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(favorites.map(item => item.id));
    }
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) {
      Alert.alert('提示', '请选择要删除的商品');
      return;
    }

    Alert.alert(
      '确认删除',
      `确定要删除选中的 ${selectedItems.length} 个商品吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            setFavorites(prev => prev.filter(item => !selectedItems.includes(item.id)));
            setSelectedItems([]);
            setIsEditMode(false);
            Alert.alert('提示', '已删除选中的商品');
          }
        }
      ]
    );
  };

  const handleAddToCart = (product) => {
    Alert.alert('添加购物车', `已将 ${product.name} 添加到购物车`);
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedItems([]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 头部 */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的收藏</Text>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={handleToggleEditMode}
        >
          <Text style={styles.editButtonText}>{isEditMode ? '完成' : '编辑'}</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* 商品统计 */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>共收藏 {favorites.length} 件商品</Text>
        {isEditMode && (
          <TouchableOpacity onPress={toggleSelectAll}>
            <Text style={styles.selectAllText}>
              {selectedItems.length === favorites.length ? '取消全选' : '全选'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 商品列表 */}
      <ScrollView 
        style={styles.productList}
        contentContainerStyle={{ paddingBottom: insets.bottom + (isEditMode ? 80 : 20) }}
        showsVerticalScrollIndicator={false}
      >
        {favorites.length > 0 ? (
          <View style={styles.productsGrid}>
            {favorites.map((product) => (
              <View key={product.id} style={styles.productWrapper}>
                {isEditMode && (
                  <TouchableOpacity 
                    style={styles.selectButton}
                    onPress={() => toggleSelectItem(product.id)}
                  >
                    <View style={[
                      styles.selectCircle,
                      selectedItems.includes(product.id) && styles.selectCircleActive
                    ]}>
                      {selectedItems.includes(product.id) && (
                        <Text style={styles.selectIcon}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                
                <ProductCard
                  product={product}
                  onPress={handleProductPress}
                  layoutType="grid"
                  showAddToCart={!isEditMode}
                  onAddToCart={() => handleAddToCart(product)}
                />
                
                {!isEditMode && (
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.addedTime}>收藏于 {product.addedTime}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💝</Text>
            <Text style={styles.emptyText}>暂无收藏商品</Text>
            <Text style={styles.emptySubtext}>去发现更多心仪的商品吧</Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => router.push('/(tabs)/shop')}
            >
              <LinearGradient
                colors={['#ff6600', '#ff8f33']}
                style={styles.shopButtonGradient}
              >
                <Text style={styles.shopButtonText}>去购物</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 编辑模式底部操作栏 */}
      {isEditMode && (
        <SafeAreaView style={styles.bottomActions} edges={['bottom']}>
          <View style={styles.actionInfo}>
            <Text style={styles.selectedText}>已选择 {selectedItems.length} 件</Text>
          </View>
          <TouchableOpacity 
            style={[styles.deleteButton, selectedItems.length === 0 && styles.deleteButtonDisabled]}
            onPress={handleRemoveSelected}
            disabled={selectedItems.length === 0}
          >
            <Text style={[styles.deleteButtonText, selectedItems.length === 0 && styles.deleteButtonTextDisabled]}>
              删除
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
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
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: '#ff6600',
    fontWeight: '500',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  selectAllText: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: '500',
  },
  productList: {
    flex: 1,
    padding: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productWrapper: {
    width: '48%',
    marginBottom: 16,
    position: 'relative',
  },
  selectButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
  },
  selectCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectCircleActive: {
    backgroundColor: '#ff6600',
    borderColor: '#ff6600',
  },
  selectIcon: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  favoriteInfo: {
    marginTop: 8,
    paddingHorizontal: 12,
  },
  addedTime: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
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
  shopButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  shopButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  shopButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionInfo: {
    flex: 1,
  },
  selectedText: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  deleteButtonTextDisabled: {
    color: '#ccc',
  },
}); 