import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, RefreshControl, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import BannerCarousel from '../../components/ui/BannerCarousel';
import CategoryGrid from '../../components/ui/CategoryGrid';
import ProductCard from '../../components/ui/ProductCard';
import { api } from '../../lib/api';

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 加载数据
  const loadData = async () => {
    try {
      const [bannersRes, categoriesRes, productsRes] = await Promise.all([
        api.getBanners(),
        api.getCategories(),
        api.getFeaturedProducts(),
      ]);

      if (bannersRes.success) setBanners(bannersRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (productsRes.success) setFeaturedProducts(productsRes.data);
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

  // 处理Banner点击
  const handleBannerPress = (banner) => {
    if (!banner.link) {
      Alert.alert('提示', `${banner.title}\n${banner.subtitle}`);
      return;
    }

    // 根据链接类型进行跳转
    switch (banner.link.type) {
      case 'category':
        router.push(`/category/${banner.link.id}`);
        break;
      case 'product':
        router.push(`/product/${banner.link.id}`);
        break;
      case 'search':
        router.push(`/search?q=${banner.link.keyword}`);
        break;
      case 'external':
        Alert.alert('外部链接', `即将打开：${banner.link.url}`);
        break;
      default:
        Alert.alert('活动详情', `${banner.title}\n${banner.subtitle}`);
        break;
    }
  };

  // 处理分类点击 - 跳转到分类扉页
  const handleCategoryPress = (category) => {
    router.push(`/category/${category.id}`);
  };

  // 处理商品点击
  const handleProductPress = (product) => {
    router.push(`/product/${product.id}`);
  };

  // 处理搜索
  const handleSearchPress = () => {
    router.push('/search');
  };

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
          <TouchableOpacity style={styles.searchBox} onPress={handleSearchPress}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>搜索商品、品牌、商家</Text>
            <View style={styles.scanButton}>
              <Text style={styles.scanIcon}>📷</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Banner轮播 */}
        {banners.length > 0 && (
          <View style={styles.bannerSection}>
            <BannerCarousel 
              banners={banners} 
              onBannerPress={handleBannerPress} 
            />
          </View>
        )}

        {/* 快捷功能区 */}
        <View style={styles.quickSection}>
          <View style={styles.quickGrid}>
            <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/(tabs)/shop')}>
              <View style={[styles.quickIcon, { backgroundColor: '#ff6600' }]}>
                <Text style={styles.quickEmoji}>🛒</Text>
              </View>
              <Text style={styles.quickText}>酒类商城</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickItem} onPress={() => Alert.alert('限时特惠', '查看限时特惠商品')}>
              <View style={[styles.quickIcon, { backgroundColor: '#ff4757' }]}>
                <Text style={styles.quickEmoji}>⚡</Text>
              </View>
              <Text style={styles.quickText}>限时特惠</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickItem} onPress={() => Alert.alert('会员专区', '查看会员专享商品')}>
              <View style={[styles.quickIcon, { backgroundColor: '#ffa726' }]}>
                <Text style={styles.quickEmoji}>👑</Text>
              </View>
              <Text style={styles.quickText}>会员专区</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/customer-service')}>
              <View style={[styles.quickIcon, { backgroundColor: '#42a5f5' }]}>
                <Text style={styles.quickEmoji}>🎧</Text>
              </View>
              <Text style={styles.quickText}>客服中心</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 分类网格 */}
        {categories.length > 0 && (
          <View style={styles.categorySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>精选分类</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
                <Text style={styles.moreText}>查看更多 ›</Text>
              </TouchableOpacity>
            </View>
            <CategoryGrid 
              categories={categories.slice(0, 8)} 
              onCategoryPress={handleCategoryPress} 
            />
          </View>
        )}

        {/* 今日推荐 */}
        <View style={styles.recommendSection}>
          <View style={styles.recommendHeader}>
            <View style={styles.recommendTitleRow}>
              <Text style={styles.recommendIcon}>🔥</Text>
              <Text style={styles.recommendTitle}>今日推荐</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/shop')}>
              <Text style={styles.moreText}>查看更多 ›</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.recommendSubtitle}>精选好酒，品质保证</Text>
          
          <View style={styles.productsContainer}>
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={handleProductPress}
              />
            ))}
          </View>
          
          {featuredProducts.length > 4 && (
            <TouchableOpacity 
              style={styles.viewMoreButton} 
              onPress={() => router.push('/(tabs)/shop')}
            >
              <Text style={styles.viewMoreText}>查看更多商品</Text>
            </TouchableOpacity>
          )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  scanButton: {
    padding: 4,
  },
  scanIcon: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // 增加底部间距，避免被悬浮按钮遮挡
  },
  bannerSection: {
    marginBottom: 4,
  },
  quickSection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 4,
  },
  quickGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickEmoji: {
    fontSize: 24,
  },
  quickText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  categorySection: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  moreText: {
    fontSize: 13,
    color: '#ff6600',
    fontWeight: '500',
  },
  recommendSection: {
    backgroundColor: '#fff',
    paddingTop: 20,
    marginBottom: 4,
  },
  recommendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  recommendTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  recommendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recommendSubtitle: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  productsContainer: {
    paddingHorizontal: 16,
  },
  viewMoreButton: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  viewMoreText: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: '500',
  },
}); 