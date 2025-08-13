import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  Dimensions,
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import ProductCard from '../../components/ui/ProductCard';
import { api } from '../../lib/api';

const { width: screenWidth } = Dimensions.get('window');

// 分类主题配置
const CATEGORY_THEMES = {
  1: { // 红酒
    name: '红酒世界',
    subtitle: '品味法式浪漫 · 感受醇香优雅',
    backgroundImage: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800',
    colors: ['#e53e3e', '#c53030'],
    description: '精选世界各地优质红酒，从法国波尔多的经典佳酿到新世界的创新风味，每一瓶都承载着酿酒师的匠心工艺。',
    features: ['🍇 精选葡萄园', '🏺 传统工艺', '💎 珍藏佳酿', '🌟 专业品鉴']
  },
  2: { // 白酒
    name: '白酒天地',
    subtitle: '传承千年工艺 · 尽享国粹精华',
    backgroundImage: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
    colors: ['#d69e2e', '#b7791f'],
    description: '中华白酒文化的传承与创新，从茅台的酱香到五粮液的浓香，每一滴都蕴含着深厚的文化底蕴。',
    features: ['🌾 优质粮食', '🏛️ 传统酿造', '🎋 窖藏陈香', '🎯 品质保证']
  },
  3: { // 啤酒
    name: '啤酒花园',
    subtitle: '清爽畅饮时光 · 释放青春活力',
    backgroundImage: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800',
    colors: ['#f6ad55', '#ed8936'],
    description: '从德式精酿到清爽拉格，从经典皮尔森到创新IPA，为您带来多样化的啤酒体验。',
    features: ['🌾 精选麦芽', '🌿 优质啤酒花', '❄️ 冰爽口感', '🍻 畅饮时光']
  },
  4: { // 洋酒
    name: '洋酒典藏',
    subtitle: '世界烈酒精选 · 品鉴国际风味',
    backgroundImage: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800',
    colors: ['#38b2ac', '#319795'],
    description: '汇聚全球顶级烈酒，威士忌的醇厚、白兰地的优雅、伏特加的纯净，感受世界酒文化的魅力。',
    features: ['🥃 经典威士忌', '🍸 精致白兰地', '💎 纯净伏特加', '🌍 全球精选']
  },
  5: { // 威士忌
    name: '威士忌殿堂',
    subtitle: '苏格兰的琥珀之魂 · 时光酿造的艺术',
    backgroundImage: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800',
    colors: ['#805ad5', '#6b46c1'],
    description: '从苏格兰高地的单一麦芽到美国波本的浓郁香甜，探索威士忌的无限魅力。',
    features: ['🏔️ 苏格兰高地', '🥃 单一麦芽', '🔥 橡木桶陈', '⏰ 时光淬炼']
  },
  6: { // 香槟
    name: '香槟盛宴',
    subtitle: '法式奢华体验 · 庆祝每个美好时刻',
    backgroundImage: 'https://images.unsplash.com/photo-1549479579-1c28c1ab6919?w=800',
    colors: ['#ed8936', '#dd6b20'],
    description: '来自法国香槟区的珍贵气泡酒，每一瓶都是庆祝和仪式感的完美诠释。',
    features: ['🍾 法国香槟区', '✨ 精致气泡', '🎉 庆祝首选', '👑 奢华体验']
  },
  7: { // 清酒
    name: '清酒之道',
    subtitle: '日式匠心工艺 · 纯净雅致之美',
    backgroundImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    colors: ['#4299e1', '#3182ce'],
    description: '传统日式清酒的纯净与雅致，每一口都是对日本匠人精神的致敬。',
    features: ['🌸 日本匠心', '💧 纯净甘美', '🍶 传统工艺', '🎋 禅意雅致']
  },
  8: { // 果酒
    name: '果酒花园',
    subtitle: '天然果香甜美 · 健康生活新选择',
    backgroundImage: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=800',
    colors: ['#48bb78', '#38a169'],
    description: '精选优质水果酿造，保持天然果香与营养，为您带来健康美味的饮酒体验。',
    features: ['🍎 新鲜水果', '🌿 天然健康', '🍯 甜美口感', '💚 低度微醺']
  }
};

export default function CategoryPage() {
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categoryId = parseInt(category);
  const theme = CATEGORY_THEMES[categoryId];

  useEffect(() => {
    loadData();
  }, [category]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 同时加载分类信息和商品数据
      const [categoriesResult, productsResult] = await Promise.all([
        api.getCategories(),
        api.getProductsByCategory(categoryId)
      ]);
      
      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
      }
      
      if (productsResult.success) {
        setProducts(productsResult.data);
      } else {
        Alert.alert('提示', '该分类暂无商品');
      }
    } catch (error) {
      Alert.alert('加载失败', '请检查网络连接后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    router.push(`/product/${product.id}`);
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)');
    }
  };

  // 获取当前分类信息
  const categoryInfo = categories.find(cat => cat.id === categoryId);

  if (!theme && !loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#333" />
        <SafeAreaView style={styles.errorContainer} edges={['top']}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>分类不存在</Text>
            <TouchableOpacity style={styles.errorButton} onPress={handleGoBack}>
              <Text style={styles.errorButtonText}>返回首页</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const currentTheme = theme || {
    name: categoryInfo?.name || '商品分类',
    subtitle: `精选${categoryInfo?.name || '商品'}`,
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    colors: ['#ff6600', '#ff8f33'],
    description: `为您精心挑选的${categoryInfo?.name || '商品'}，品质保证，值得信赖。`,
    features: ['🎯 精选商品', '✨ 品质保证', '🚚 快速配送', '💝 贴心服务']
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* 扉页头部 */}
        <View style={styles.heroContainer}>
          <ImageBackground source={{ uri: currentTheme.backgroundImage }} style={styles.heroBackground}>
            <LinearGradient
              colors={[...currentTheme.colors, 'rgba(0,0,0,0.8)']}
              style={styles.heroOverlay}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <SafeAreaView style={styles.heroSafeArea} edges={['top']}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                  <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
              </SafeAreaView>
              
              <View style={styles.heroContent}>
                <Text style={styles.categoryIcon}>{categoryInfo?.icon || '🍷'}</Text>
                <Text style={styles.heroTitle}>{currentTheme.name}</Text>
                <Text style={styles.heroSubtitle}>{currentTheme.subtitle}</Text>
                <View style={styles.divider} />
                <Text style={styles.heroDescription}>{currentTheme.description}</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* 特色介绍 */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>品类特色</Text>
          <View style={styles.featuresGrid}>
            {currentTheme.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 商品展示 */}
        <View style={styles.productsContainer}>
          <View style={styles.productsHeader}>
            <Text style={styles.sectionTitle}>精选商品</Text>
            <Text style={styles.productCount}>
              {loading ? '加载中...' : `${products.length} 款商品`}
            </Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>正在加载商品...</Text>
            </View>
          ) : products.length > 0 ? (
            <View style={styles.productsList}>
              {products.map((product) => (
                <View key={product.id} style={styles.productCardWrapper}>
                  <ProductCard
                    product={product}
                    onPress={handleProductPress}
                    layoutType="grid"
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyText}>暂无{currentTheme.name}商品</Text>
              <Text style={styles.emptySubtext}>敬请期待更多精品</Text>
            </View>
          )}
        </View>

        {/* 品牌故事 */}
        <View style={styles.storyContainer}>
          <Text style={styles.sectionTitle}>品牌理念</Text>
          <View style={[styles.storyContent, { borderLeftColor: currentTheme.colors[0] }]}>
            <Text style={styles.storyText}>
              每一滴{currentTheme.name}都承载着深厚的文化底蕴和精湛的工艺传承。我们精心甄选每一款产品，
              确保为您带来最纯正的品味体验。无论是商务宴请还是私人收藏，这里都有您的理想之选。
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 底部行动按钮 */}
      <SafeAreaView style={styles.bottomActions} edges={['bottom']}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: currentTheme.colors[0] }]}
          onPress={() => Alert.alert('收藏分类', `已收藏${currentTheme.name}分类`)}
        >
          <Text style={styles.actionButtonText}>💖 收藏分类</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => router.push('/(tabs)/shop')}
        >
          <Text style={styles.secondaryButtonText}>🛒 浏览全部</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#333',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 8,
  },
  backIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: '#ff6600',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  heroContainer: {
    height: 400,
    position: 'relative',
  },
  heroBackground: {
    flex: 1,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroSafeArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  categoryIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#fbbf24',
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    backgroundColor: '#fff',
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  productsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 24,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productCount: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  productsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  storyContainer: {
    backgroundColor: '#fff',
    padding: 24,
  },
  storyContent: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  storyText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
  bottomActions: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '700',
  },
}); 