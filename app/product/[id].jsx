import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

import { FEATURED_PRODUCTS } from '../../lib/api';

const { width: screenWidth } = Dimensions.get('window');

export default function ProductDetailPage() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSpec, setSelectedSpec] = useState({}); // 选中的规格

  useEffect(() => {
    // 根据ID查找商品
    const foundProduct = FEATURED_PRODUCTS.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct({
        ...foundProduct,
        images: [foundProduct.image, foundProduct.image, foundProduct.image],
        specifications: {
          '酒精度': '53%vol',
          '净含量': '500ml',
          '香型': foundProduct.category === '白酒' ? '酱香型' : '干型',
          '产地': foundProduct.category === '白酒' ? '中国贵州' : '法国',
          '保质期': '长期',
          '储存条件': '阴凉干燥处',
        },
        // 添加规格选项
        specs: {
          '容量规格': [
            { name: '500ml', price: foundProduct.price, stock: 50 },
            { name: '750ml', price: foundProduct.price + 500, stock: 30 },
            { name: '1L', price: foundProduct.price + 800, stock: 20 }
          ],
          '包装规格': [
            { name: '单瓶装', price: 0, stock: 100 },
            { name: '礼盒装', price: 200, stock: 25 },
            { name: '双瓶装', price: 300, stock: 15 }
          ]
        },
        details: '这是一款精选的优质酒类产品，采用传统工艺酿造，口感醇厚，香气浓郁。适合商务宴请、朋友聚会等各种场合。\n\n【产品特色】\n• 传统工艺酿造，品质上乘\n• 口感醇厚，回味悠长\n• 包装精美，送礼佳品\n• 适合多种场合饮用\n\n【品鉴建议】\n• 适饮温度：15-18°C\n• 醒酒时间：30-60分钟\n• 配餐建议：适合搭配红肉、奶酪等',
        reviews: [
          { user: '酒友001', rating: 5, comment: '口感很棒，包装也很精美！', date: '2024-01-15' },
          { user: '品酒师', rating: 4, comment: '品质不错，性价比很高。', date: '2024-01-10' },
          { user: '老客户', rating: 5, comment: '一直在这里买，质量有保证。', date: '2024-01-05' }
        ]
      });

      // 初始化默认规格选择
      setSelectedSpec({
        '容量规格': '500ml',
        '包装规格': '单瓶装'
      });
    }
  }, [id]);

  // 计算当前选择的总价格
  const getCurrentPrice = () => {
    if (!product || !product.specs) return product?.price || 0;

    let totalPrice = product.price;
    Object.entries(selectedSpec).forEach(([specType, specValue]) => {
      const spec = product.specs[specType]?.find(s => s.name === specValue);
      if (spec) totalPrice += spec.price;
    });
    return totalPrice;
  };

  // 获取当前规格的库存
  const getCurrentStock = () => {
    if (!product || !product.specs) return 99;

    let minStock = 999;
    Object.entries(selectedSpec).forEach(([specType, specValue]) => {
      const spec = product.specs[specType]?.find(s => s.name === specValue);
      if (spec && spec.stock < minStock) minStock = spec.stock;
    });
    return minStock;
  };

  const handleQuantityChange = (delta) => {
    const maxQuantity = Math.min(99, getCurrentStock());
    const newQuantity = Math.max(1, Math.min(maxQuantity, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleSpecSelection = (specType, specValue) => {
    setSelectedSpec(prev => ({
      ...prev,
      [specType]: specValue
    }));
  };

  const handleAddToCart = () => {
    const currentStock = getCurrentStock();
    if (quantity > currentStock) {
      Alert.alert('库存不足', `当前规格库存仅剩 ${currentStock} 件`);
      return;
    }

    const specText = Object.entries(selectedSpec)
      .map(([type, value]) => `${type}: ${value}`)
      .join('，');

    Alert.alert(
      '添加成功',
      `已将 ${quantity} 瓶 ${product.name}（${specText}）添加到购物车`,
      [
        { text: '继续购物', style: 'cancel' },
        { text: '查看购物车', onPress: () => router.push('/cart') }
      ]
    );
  };

  const handleBuyNow = () => {
    const currentStock = getCurrentStock();
    if (quantity > currentStock) {
      Alert.alert('库存不足', `当前规格库存仅剩 ${currentStock} 件`);
      return;
    }

    const specText = Object.entries(selectedSpec)
      .map(([type, value]) => `${type}: ${value}`)
      .join('，');

    Alert.alert('立即购买', `确认购买 ${quantity} 瓶 ${product.name}（${specText}）？\n总价：¥${getCurrentPrice() * quantity}`);
  };

  const handleContact = () => {
    router.push('/customer-service');
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>商品加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentPrice = getCurrentPrice();
  const currentStock = getCurrentStock();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 商品图片轮播 */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setSelectedImage(index);
            }}
          >
            {product.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.productImage}
              />
            ))}
          </ScrollView>

          {/* 图片指示器 */}
          <View style={styles.imageIndicator}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  index === selectedImage && styles.indicatorDotActive
                ]}
              />
            ))}
          </View>

          {/* 热销标签 */}
          {product.isHot && (
            <View style={styles.hotBadge}>
              <Text style={styles.hotText}>🔥 热销</Text>
            </View>
          )}
        </View>

        {/* 商品信息 */}
        <View style={styles.productInfo}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{product.category}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {product.rating}</Text>
            </View>
          </View>

          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>¥{currentPrice}</Text>
            {product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>¥{product.originalPrice}</Text>
            )}
            <View style={styles.stockInfo}>
              <Text style={styles.stockText}>库存: {currentStock}件</Text>
            </View>
          </View>
        </View>

        {/* 规格选择 */}
        <View style={styles.specsContainer}>
          <Text style={styles.sectionTitle}>选择规格</Text>
          {Object.entries(product.specs).map(([specType, specOptions]) => (
            <View key={specType} style={styles.specSection}>
              <Text style={styles.specTitle}>{specType}</Text>
              <View style={styles.specOptions}>
                {specOptions.map((option) => (
                  <TouchableOpacity
                    key={option.name}
                    style={[
                      styles.specOption,
                      selectedSpec[specType] === option.name && styles.specOptionSelected,
                      option.stock === 0 && styles.specOptionDisabled
                    ]}
                    onPress={() => handleSpecSelection(specType, option.name)}
                    disabled={option.stock === 0}
                  >
                    <Text style={[
                      styles.specOptionText,
                      selectedSpec[specType] === option.name && styles.specOptionTextSelected,
                      option.stock === 0 && styles.specOptionTextDisabled
                    ]}>
                      {option.name}
                      {option.price > 0 && ` +¥${option.price}`}
                    </Text>
                    {option.stock === 0 && (
                      <Text style={styles.stockOutText}>缺货</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* 规格参数 */}
        <View style={styles.specificationsContainer}>
          <Text style={styles.sectionTitle}>商品规格</Text>
          {Object.entries(product.specifications).map(([key, value]) => (
            <View key={key} style={styles.specRow}>
              <Text style={styles.specKey}>{key}</Text>
              <Text style={styles.specValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* 商品详情 */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>商品详情</Text>
          <Text style={styles.detailsText}>{product.details}</Text>
        </View>

        {/* 用户评价 */}
        <View style={styles.reviewsContainer}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>用户评价</Text>
            <Text style={styles.reviewsCount}>({product.reviews.length}条)</Text>
          </View>
          {product.reviews.map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <Text style={styles.reviewRating}>{'⭐'.repeat(review.rating)}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Text style={styles.contactIcon}>💬</Text>
          <Text style={styles.contactText}>客服</Text>
        </TouchableOpacity>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>数量</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(-1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>加入购物车</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>立即购买</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  productImage: {
    width: screenWidth,
    height: 300,
    resizeMode: 'cover',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 3,
  },
  indicatorDotActive: {
    backgroundColor: '#fff',
    width: 16,
  },
  hotBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hotText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#f9fafb',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#7c2d12',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  stockInfo: {
    marginLeft: 'auto',
  },
  stockText: {
    fontSize: 12,
    color: '#6b7280',
  },
  specsContainer: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#f9fafb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  specSection: {
    marginBottom: 20,
  },
  specTitle: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 12,
  },
  specOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    position: 'relative',
  },
  specOptionSelected: {
    borderColor: '#7c2d12',
    backgroundColor: '#7c2d12',
  },
  specOptionDisabled: {
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  specOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  specOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  specOptionTextDisabled: {
    color: '#9ca3af',
  },
  stockOutText: {
    position: 'absolute',
    top: -6,
    right: -6,
    fontSize: 10,
    color: '#dc2626',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  specificationsContainer: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#f9fafb',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  specKey: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  detailsContainer: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#f9fafb',
  },
  detailsText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  reviewsContainer: {
    padding: 16,
    marginBottom: 100,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewsCount: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  reviewItem: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  reviewRating: {
    fontSize: 12,
    marginRight: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  reviewComment: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  contactButton: {
    alignItems: 'center',
    marginRight: 16,
  },
  contactIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  contactText: {
    fontSize: 10,
    color: '#6b7280',
  },
  quantityContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  quantityLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 4,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 14,
    color: '#1f2937',
    paddingHorizontal: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  addToCartText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buyNowText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
}); 