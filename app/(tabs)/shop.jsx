import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, RefreshControl, StatusBar, TouchableOpacity, Animated, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import ProductCard from '../../components/ui/ProductCard';
import { api } from '../../lib/api';

export default function ShopPage() {
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [layoutType, setLayoutType] = useState('grid'); // 'grid' 或 'list'
  const [fadeAnim] = useState(new Animated.Value(1));
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const loadData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
      ]);

      if (categoriesRes.success) setCategories(categoriesRes.data || []);
      if (productsRes.success) setProducts(productsRes.data || []);
    } catch (error) {
      Alert.alert('加载失败', '请检查网络连接后重试');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 下拉刷新
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // 处理分类点击
  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // 处理商品点击
  const handleProductPress = (product) => {
    router.push(`/product/${product.id}`);
  };

  // 处理搜索
  const handleSearch = (text) => {
    setSearchText(text);
  };

  // 切换布局类型
  const toggleLayout = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setLayoutType(prev => prev === 'grid' ? 'list' : 'grid');
  };

  // 过滤商品
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => {
        if (!categories || categories.length === 0) return false;
        const category = categories.find(cat => cat.id === selectedCategory);
        return category ? product.category === category.name : false;
      });

  // 根据搜索文本进一步过滤
  const searchFilteredProducts = searchText 
    ? filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.category.toLowerCase().includes(searchText.toLowerCase())
      )
    : filteredProducts;

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>正在加载...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* 顶部搜索区域 */}
        <View style={styles.headerSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="搜索酒类商品..."
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton} 
                  onPress={() => setSearchText('')}
                >
                  <Text style={styles.clearText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* 分类标签区域 */}
        <View style={styles.categoryTabsSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryTabsContainer}
          >
            <TouchableOpacity
              style={[
                styles.categoryTab,
                selectedCategory === 'all' && styles.categoryTabActive
              ]}
              onPress={() => handleCategoryPress('all')}
            >
              <Text style={[
                styles.categoryTabText,
                selectedCategory === 'all' && styles.categoryTabTextActive
              ]}>
                全部
              </Text>
            </TouchableOpacity>
            
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryTab,
                  selectedCategory === category.id && styles.categoryTabActive
                ]}
                onPress={() => handleCategoryPress(category.id)}
              >
                <Text style={[
                  styles.categoryTabText,
                  selectedCategory === category.id && styles.categoryTabTextActive
                ]}>
                  {category.icon} {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* 商品列表 */}
      <ScrollView 
        style={styles.productsContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.productsScrollContent,
          { paddingBottom: 100 + insets.bottom }
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 商品信息和布局切换 */}
        <View style={styles.productsHeader}>
          <View style={styles.productsInfo}>
            <Text style={styles.productsTitle}>商品列表</Text>
            <Text style={styles.productsCount}>共{searchFilteredProducts.length}款</Text>
          </View>
          <TouchableOpacity style={styles.layoutToggle} onPress={toggleLayout}>
            <Text style={styles.layoutIcon}>
              {layoutType === 'grid' ? '☰' : '⊞'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 商品网格/列表 */}
        <Animated.View 
          style={[
            layoutType === 'grid' ? styles.productsGrid : styles.productsList,
            { opacity: fadeAnim }
          ]}
        >
          {searchFilteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={handleProductPress}
              layoutType={layoutType}
              style={layoutType === 'grid' ? styles.gridItem : styles.listItem}
            />
          ))}
        </Animated.View>

        {searchFilteredProducts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>没有找到相关商品</Text>
            <Text style={styles.emptySubtext}>试试其他关键词或分类吧</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  safeArea: {
    backgroundColor: '#fff',
  },
  headerSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  searchContainer: {
    // 搜索框样式
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  clearText: {
    fontSize: 16,
    color: '#999',
  },
  categoryTabsSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryTabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryTabActive: {
    backgroundColor: '#ff6600',
    borderColor: '#ff6600',
  },

  categoryTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTabTextActive: {
    color: '#fff',
  },
  productsContent: {
    flex: 1,
  },
  productsScrollContent: {
    // paddingBottom 将在组件中动态设置
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  productsInfo: {
    flex: 1,
  },
  productsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  productsCount: {
    fontSize: 12,
    color: '#999',
  },
  layoutToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginLeft: 12,
  },
  layoutIcon: {
    fontSize: 18,
    color: '#666',
  },
  productsGrid: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  productsList: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  gridItem: {
    marginBottom: 16,
  },
  listItem: {
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: '#fff',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
}); 