import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductDetailScreen from './ProductDetailScreen';
import CartScreen from './CartScreen';
import FavoritesScreen from './FavoritesScreen';

const { width } = Dimensions.get('window');

// 模拟数据
const categories = [
  { id: '1', name: '全部' },
  { id: '2', name: '红酒' },
  { id: '3', name: '白酒' },
  { id: '4', name: '洋酒' },
  { id: '5', name: '香槟' },
  { id: '6', name: '啤酒' },
  { id: '7', name: '果酒' },
];

// 商品列表标签
const tabs = [
  { id: 'popular', name: '热门' },
  { id: 'new', name: '新品' },
  { id: 'sale', name: '促销' },
  { id: 'price', name: '价格' },
];

// 静态图片资源
const productImages = {
  redWine1: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  redWine2: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  whiteWine1: 'https://images.unsplash.com/photo-1566754436893-98224ee05be3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  whiteWine2: 'https://images.unsplash.com/photo-1594372366237-4b0314bd3227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  whiskey1: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  whiskey2: 'https://images.unsplash.com/photo-1514218869824-3b3d42c6a485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
  champagne1: 'https://images.unsplash.com/photo-1594372366237-4b0314bd3227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  beer1: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  fruitWine1: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
};

const products = [
  {
    id: '1',
    name: '法国波尔多红酒 2015年份',
    price: '¥1299',
    image: productImages.redWine1,
    sales: '销量 2342',
    category: '2',
  },
  {
    id: '2',
    name: '茅台飞天53度 500ml',
    price: '¥2899',
    image: productImages.whiteWine1,
    sales: '销量 1253',
    category: '3',
  },
  {
    id: '3',
    name: '麦卡伦12年单一麦芽威士忌',
    price: '¥899',
    image: productImages.whiskey1,
    sales: '销量 5678',
    category: '4',
  },
  {
    id: '4',
    name: '法国巴黎之花香槟',
    price: '¥799',
    image: productImages.champagne1,
    sales: '销量 3421',
    category: '5',
  },
  {
    id: '5',
    name: '比利时修道院精酿啤酒礼盒',
    price: '¥399',
    image: productImages.beer1,
    sales: '销量 876',
    category: '6',
  },
  {
    id: '6',
    name: '日本梅酒 青梅果酒 720ml',
    price: '¥199',
    image: productImages.fruitWine1,
    sales: '销量 4532',
    category: '7',
  },
  {
    id: '7',
    name: '智利魔爵珍藏赤霞珠红酒',
    price: '¥399',
    image: productImages.redWine2,
    sales: '销量 2198',
    category: '2',
  },
  {
    id: '8',
    name: '五粮液52度 500ml',
    price: '¥1099',
    image: productImages.whiteWine2,
    sales: '销量 3267',
    category: '3',
  },
  {
    id: '9',
    name: '尊尼获加蓝牌威士忌',
    price: '¥299',
    image: productImages.whiskey2,
    sales: '销量 1876',
    category: '4',
  },
  {
    id: '10',
    name: '意大利普洛赛克起泡酒',
    price: '¥199',
    image: productImages.champagne1,
    sales: '销量 987',
    category: '5',
  },
];

export default function ShopScreen() {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [selectedTab, setSelectedTab] = useState('popular');
  const [searchText, setSearchText] = useState('');
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priceSort, setPriceSort] = useState('desc'); // 'asc' 或 'desc'

  // 根据分类和标签筛选商品
  const getFilteredProducts = () => {
    // 先根据搜索文本筛选
    let filtered = products;
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(lowerSearchText)
      );
    }
    
    // 再根据分类筛选
    if (selectedCategory !== '1') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // 最后根据标签排序
    switch (selectedTab) {
      case 'popular':
        return [...filtered].sort((a, b) => {
          const salesA = parseInt(a.sales.replace(/[^0-9]/g, ''));
          const salesB = parseInt(b.sales.replace(/[^0-9]/g, ''));
          return salesB - salesA;
        });
      case 'new':
        // 模拟新品排序，实际应该根据上架时间
        return [...filtered].sort((a, b) => parseInt(b.id) - parseInt(a.id));
      case 'sale':
        // 模拟促销排序，这里简单按价格从低到高
        return [...filtered].sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        });
      case 'price':
        // 价格排序，根据当前排序方向
        return [...filtered].sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
        });
      default:
        return filtered;
    }
  };

  const filteredProducts = getFilteredProducts();

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleCloseProductDetail = () => {
    setShowProductDetail(false);
  };

  const handleTabPress = (tabId) => {
    if (tabId === 'price' && selectedTab === 'price') {
      // 如果已经选中价格标签，则切换排序方向
      setPriceSort(priceSort === 'asc' ? 'desc' : 'asc');
    } else {
      setSelectedTab(tabId);
    }
  };

  const handleViewCart = () => {
    setShowProductDetail(false);
    setShowCart(true);
  };

  const handleViewFavorites = () => {
    setShowProductDetail(false);
    setShowFavorites(true);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategoryItem,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderTabItem = (tab) => (
    <TouchableOpacity
      key={tab.id}
      style={[
        styles.tabItem,
        selectedTab === tab.id && styles.selectedTabItem,
      ]}
      onPress={() => handleTabPress(tab.id)}
    >
      <View style={styles.tabTextContainer}>
        <Text
          style={[
            styles.tabText,
            selectedTab === tab.id && styles.selectedTabText,
          ]}
        >
          {tab.name}
        </Text>
        {tab.id === 'price' && (
          <View style={styles.priceIconContainer}>
            <Ionicons 
              name="caret-up" 
              size={12} 
              color={selectedTab === 'price' && priceSort === 'asc' ? "#e91e63" : "#ccc"} 
              style={styles.priceIcon}
            />
            <Ionicons 
              name="caret-down" 
              size={12} 
              color={selectedTab === 'price' && priceSort === 'desc' ? "#e91e63" : "#ccc"} 
              style={styles.priceIcon}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productItem}
      onPress={() => handleProductPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.productSales}>{item.sales}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索酒品"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map(renderTabItem)}
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={showProductDetail}
        onRequestClose={handleCloseProductDetail}
      >
        <ProductDetailScreen 
          onClose={handleCloseProductDetail}
          onViewCart={handleViewCart}
          onViewFavorites={handleViewFavorites}
        />
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
  searchContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginBottom: 5,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  selectedCategoryItem: {
    backgroundColor: '#e91e63',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  selectedTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#e91e63',
  },
  tabTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTabText: {
    color: '#e91e63',
    fontWeight: '500',
  },
  priceIconContainer: {
    flexDirection: 'column',
    marginLeft: 2,
    height: 20,
    justifyContent: 'center',
  },
  priceIcon: {
    height: 10,
    lineHeight: 10,
  },
  productList: {
    padding: 5,
  },
  productItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
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
  productSales: {
    fontSize: 12,
    color: '#999',
  },
}); 