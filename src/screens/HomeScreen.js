import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductDetailScreen from './ProductDetailScreen';
import CartScreen from './CartScreen';
import FavoritesScreen from './FavoritesScreen';
import ShopScreen from './ShopScreen';

const { width } = Dimensions.get('window');

export default function HomeScreen({ activeTab, onTabPress }) {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const bannerRef = useRef(null);

  // 图片资源
  const imageAssets = [
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1560148218-1a83060f7b32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1567072379583-0beb5bda7e30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  ];

  // 商品分类
  const categories = [
    { id: '1', name: '红酒', icon: 'wine' },
    { id: '2', name: '白酒', icon: 'wine-outline' },
    { id: '3', name: '洋酒', icon: 'beer' },
    { id: '4', name: '香槟', icon: 'wine' },
    { id: '5', name: '啤酒', icon: 'beer-outline' },
    { id: '6', name: '果酒', icon: 'nutrition-outline' },
    { id: '7', name: '清酒', icon: 'water-outline' },
    { id: '8', name: '更多', icon: 'grid-outline' },
  ];

  // 精选名酒数据
  const featuredProducts = [
    {
      id: '1',
      name: '法国波尔多红酒 2015年份 干红葡萄酒 750ml',
      price: '¥1299',
      originalPrice: '¥1499',
      discount: '8.7折',
      image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    },
    {
      id: '2',
      name: '茅台飞天53度 500ml',
      price: '¥2899',
      originalPrice: '¥3099',
      discount: '9.4折',
      image: 'https://images.unsplash.com/photo-1566754436893-98224ee05be3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    },
    {
      id: '3',
      name: '麦卡伦12年单一麦芽威士忌',
      price: '¥899',
      originalPrice: '¥999',
      discount: '9折',
      image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    },
    {
      id: '4',
      name: '法国巴黎之花香槟',
      price: '¥799',
      originalPrice: '¥899',
      discount: '8.9折',
      image: 'https://images.unsplash.com/photo-1594372366237-4b0314bd3227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    },
  ];

  // 新品上架数据
  const newArrivals = [
    {
      id: '5',
      name: '智利魔爵珍藏赤霞珠红酒',
      price: '¥399',
      originalPrice: '¥499',
      discount: '8折',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    },
    {
      id: '6',
      name: '五粮液52度 500ml',
      price: '¥1099',
      originalPrice: '¥1299',
      discount: '8.5折',
      image: 'https://images.unsplash.com/photo-1566754436893-98224ee05be3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    },
    {
      id: '7',
      name: '轩尼诗XO干邑白兰地',
      price: '¥1599',
      originalPrice: '¥1799',
      discount: '8.9折',
      image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    },
    {
      id: '8',
      name: '意大利普洛赛克起泡酒',
      price: '¥299',
      originalPrice: '¥399',
      discount: '7.5折',
      image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    },
  ];

  // 优惠券数据
  const coupons = [
    {
      id: '1',
      title: '新人专享',
      value: '¥50',
      condition: '满100元可用',
      expiry: '7天内有效',
      color: '#e91e63',
    },
    {
      id: '2',
      title: '会员专享',
      value: '¥100',
      condition: '满500元可用',
      expiry: '30天内有效',
      color: '#2196f3',
    },
    {
      id: '3',
      title: '限时折扣',
      value: '85折',
      condition: '无门槛',
      expiry: '3天内有效',
      color: '#ff9800',
    },
  ];

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleViewShop = (categoryId) => {
    setShowShop(true);
  };

  const handleViewCart = () => {
    setShowProductDetail(false);
    setShowCart(true);
  };

  const handleViewFavorites = () => {
    setShowProductDetail(false);
    setShowFavorites(true);
  };

  const handleBannerScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentBanner(currentIndex);
  };

  const renderBanner = () => (
    <View style={styles.bannerContainer}>
      <FlatList
        ref={bannerRef}
        data={imageAssets}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleBannerScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.bannerImage} />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      <View style={styles.paginationContainer}>
        {imageAssets.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentBanner === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <Text style={styles.sectionTitle}>酒品分类</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleViewShop(category.id)}
          >
            <View style={styles.categoryIconContainer}>
              <Ionicons name={category.icon} size={24} color="#e91e63" />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleViewProduct(item)}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
        {item.discount && (
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>{item.price}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>{item.originalPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedSection = () => (
    <View style={styles.featuredContainer}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => handleViewShop()}>
        <Text style={styles.sectionTitle}>精选名酒</Text>
        <View style={styles.viewMoreContainer}>
          <Text style={styles.viewMoreText}>查看更多</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </View>
      </TouchableOpacity>
      <FlatList
        data={featuredProducts}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
      />
    </View>
  );

  const renderNewArrivals = () => (
    <View style={styles.newArrivalsContainer}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => handleViewShop()}>
        <Text style={styles.sectionTitle}>新品上架</Text>
        <View style={styles.viewMoreContainer}>
          <Text style={styles.viewMoreText}>查看更多</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </View>
      </TouchableOpacity>
      <FlatList
        data={newArrivals}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.productList}
      />
    </View>
  );

  const renderCoupons = () => (
    <View style={styles.couponsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>优惠券</Text>
        <TouchableOpacity style={styles.viewMoreContainer}>
          <Text style={styles.viewMoreText}>全部</Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.couponsScroll}>
        {coupons.map((coupon) => (
          <View 
            key={coupon.id} 
            style={[styles.couponCard, { borderColor: coupon.color }]}
          >
            <View style={[styles.couponLeft, { backgroundColor: coupon.color }]}>
              <Text style={styles.couponValue}>{coupon.value}</Text>
            </View>
            <View style={styles.couponRight}>
              <Text style={styles.couponTitle}>{coupon.title}</Text>
              <Text style={styles.couponCondition}>{coupon.condition}</Text>
              <Text style={styles.couponExpiry}>{coupon.expiry}</Text>
              <TouchableOpacity 
                style={[styles.couponButton, { backgroundColor: coupon.color }]}
              >
                <Text style={styles.couponButtonText}>立即领取</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderBanner()}
        {renderCategories()}
        {renderCoupons()}
        {renderFeaturedSection()}
        {renderNewArrivals()}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showProductDetail}
        onRequestClose={() => setShowProductDetail(false)}
      >
        <ProductDetailScreen
          product={selectedProduct}
          onClose={() => setShowProductDetail(false)}
          onViewCart={handleViewCart}
          onViewFavorites={handleViewFavorites}
        />
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showShop}
        onRequestClose={() => setShowShop(false)}
      >
        <ShopScreen onClose={() => setShowShop(false)} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showCart}
        onRequestClose={() => setShowCart(false)}
      >
        <CartScreen onClose={() => setShowCart(false)} />
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showFavorites}
        onRequestClose={() => setShowFavorites(false)}
      >
        <FavoritesScreen onClose={() => setShowFavorites(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  bannerContainer: {
    height: 200,
    position: 'relative',
  },
  bannerImage: {
    width: width,
    height: 200,
    resizeMode: 'cover',
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 12,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  categoryItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
  },
  featuredContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginBottom: 10,
  },
  newArrivalsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 12,
    color: '#999',
  },
  productList: {
    paddingLeft: 15,
    paddingRight: 5,
  },
  productCard: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  discountTag: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#e91e63',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 12,
    marginBottom: 5,
    height: 36,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e91e63',
    marginRight: 5,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  couponsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginBottom: 10,
  },
  couponsScroll: {
    paddingLeft: 15,
  },
  couponCard: {
    width: 280,
    height: 90,
    flexDirection: 'row',
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  couponLeft: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  couponRight: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  couponCondition: {
    fontSize: 12,
    color: '#666',
  },
  couponExpiry: {
    fontSize: 12,
    color: '#999',
  },
  couponButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  couponButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
}); 