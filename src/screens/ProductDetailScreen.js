import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

// 模拟数据
const product = {
  id: '1',
  name: '法国波尔多红酒 2015年份 干红葡萄酒 750ml',
  price: '¥1299',
  originalPrice: '¥1599',
  discount: '8.1折',
  sales: '月销 3420件',
  stock: '库存 9999件',
  images: [
    'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    'https://images.unsplash.com/photo-1566754436893-98224ee05be3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    'https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  ],
  options: ['750ml', '1500ml', '3000ml'],
  vintages: ['2015年份', '2016年份', '2018年份'],
  description: '这款波尔多红酒采用优质葡萄酿造，口感醇厚，单宁柔和，带有黑醋栗和黑莓的香气，尾韵悠长。适合搭配红肉、奶酪等食物。',
  specifications: [
    { key: '品牌', value: 'Château Margaux' },
    { key: '产地', value: '法国波尔多' },
    { key: '年份', value: '2015年' },
    { key: '容量', value: '750ml' },
    { key: '酒精度', value: '13.5%vol' },
    { key: '葡萄品种', value: '赤霞珠、梅洛' },
    { key: '适饮温度', value: '16-18℃' },
  ],
  comments: [
    { 
      id: '1', 
      user: '品酒达人', 
      avatar: 'https://via.placeholder.com/50',
      rating: 5,
      content: '这款酒非常棒，酒体饱满，单宁柔顺，余味悠长，非常值得收藏！', 
      date: '2023-10-15',
      images: ['https://via.placeholder.com/100?text=Review+1', 'https://via.placeholder.com/100?text=Review+2']
    },
    { 
      id: '2', 
      user: '葡萄酒爱好者', 
      avatar: 'https://via.placeholder.com/50',
      rating: 4,
      content: '整体不错，香气很浓郁，但价格稍贵，性价比一般。', 
      date: '2023-10-10',
      images: []
    },
  ]
};

export default function ProductDetailScreen({ onClose, onViewCart, onViewFavorites }) {
  const { addToCart } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedVintage, setSelectedVintage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollY = new Animated.Value(0);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this wine: ${product.name}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = () => {
    // 创建商品选项对象
    const options = {
      option: product.options[selectedOption],
      vintage: product.vintages[selectedVintage],
    };

    // 添加到购物车
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      },
      quantity,
      options
    );

    // 显示成功提示
    Alert.alert('成功', '已添加到购物车');
  };

  const handleBuyNow = () => {
    // 创建商品选项对象
    const options = {
      option: product.options[selectedOption],
      vintage: product.vintages[selectedVintage],
    };

    // 添加到购物车
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      },
      quantity,
      options
    );

    // 显示成功提示并跳转到结账页面
    Alert.alert(
      '购买提示',
      '商品已加入购物车，是否立即结算？',
      [
        {
          text: '继续购物',
          style: 'cancel',
        },
        {
          text: '立即结算',
          onPress: () => {
            // 关闭当前页面并跳转到购物车
            onClose();
            if (onViewCart) {
              onViewCart();
            }
          },
        },
      ]
    );
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      Alert.alert('收藏成功', '可在"我的收藏"中查看');
    }
  };

  const handleViewCart = () => {
    onClose();
    if (onViewCart) {
      onViewCart();
    }
  };

  const handleViewFavorites = () => {
    onClose();
    if (onViewFavorites) {
      onViewFavorites();
    }
  };

  const renderHeader = () => (
    <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {product.name}
      </Text>
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Ionicons name="share-social-outline" size={24} color="#333" />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderImageGallery = () => (
    <View style={styles.imageGallery}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const slideIndex = Math.round(
            e.nativeEvent.contentOffset.x / width
          );
          setCurrentImage(slideIndex);
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
      <View style={styles.pagination}>
        {product.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentImage === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderProductInfo = () => (
    <View style={styles.productInfo}>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{product.price}</Text>
        <Text style={styles.originalPrice}>{product.originalPrice}</Text>
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>{product.discount}</Text>
        </View>
      </View>
      <Text style={styles.productName}>{product.name}</Text>
      <View style={styles.salesRow}>
        <Text style={styles.salesText}>{product.sales}</Text>
        <Text style={styles.stockText}>{product.stock}</Text>
      </View>
    </View>
  );

  const renderOptions = () => (
    <View style={styles.optionsContainer}>
      <Text style={styles.optionTitle}>容量</Text>
      <View style={styles.optionsList}>
        {product.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionItem,
              selectedOption === index && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(index)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === index && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.optionTitle}>年份</Text>
      <View style={styles.optionsList}>
        {product.vintages.map((vintage, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionItem,
              selectedVintage === index && styles.selectedOption,
            ]}
            onPress={() => setSelectedVintage(index)}
          >
            <Text
              style={[
                styles.optionText,
                selectedVintage === index && styles.selectedOptionText,
              ]}
            >
              {vintage}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quantityContainer}>
        <Text style={styles.optionTitle}>数量</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderDescription = () => (
    <View style={styles.descriptionContainer}>
      <Text style={styles.sectionTitle}>商品描述</Text>
      <Text style={styles.descriptionText} numberOfLines={showFullDescription ? undefined : 3}>
        {product.description}
      </Text>
      {!showFullDescription && (
        <TouchableOpacity onPress={() => setShowFullDescription(true)}>
          <Text style={styles.showMoreText}>查看更多</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSpecifications = () => (
    <View style={styles.specificationsContainer}>
      <Text style={styles.sectionTitle}>规格参数</Text>
      {product.specifications.map((spec, index) => (
        <View key={index} style={styles.specificationRow}>
          <Text style={styles.specificationKey}>{spec.key}</Text>
          <Text style={styles.specificationValue}>{spec.value}</Text>
        </View>
      ))}
    </View>
  );

  const renderComments = () => (
    <View style={styles.commentsContainer}>
      <View style={styles.commentHeader}>
        <Text style={styles.sectionTitle}>用户评价</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>查看全部</Text>
        </TouchableOpacity>
      </View>
      {product.comments.map((comment) => (
        <View key={comment.id} style={styles.commentItem}>
          <View style={styles.commentHeader}>
            <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
            <View>
              <Text style={styles.commentUser}>{comment.user}</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= comment.rating ? "star" : "star-outline"}
                    size={16}
                    color="#FFCC00"
                    style={{ marginRight: 2 }}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.commentDate}>{comment.date}</Text>
          </View>
          <Text style={styles.commentContent}>{comment.content}</Text>
          {comment.images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.commentImages}>
              {comment.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.commentImage} />
              ))}
            </ScrollView>
          )}
        </View>
      ))}
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={styles.iconButton}
        onPress={handleToggleFavorite}
      >
        <Ionicons 
          name={isFavorite ? "heart" : "heart-outline"} 
          size={24} 
          color={isFavorite ? "#e91e63" : "#333"} 
        />
        <Text style={styles.iconButtonText}>收藏</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={handleViewCart}
      >
        <Ionicons name="cart-outline" size={24} color="#333" />
        <Text style={styles.iconButtonText}>购物车</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartText}>加入购物车</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
        <Text style={styles.buyNowText}>立即购买</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {renderHeader()}
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {renderImageGallery()}
        {renderProductInfo()}
        {renderOptions()}
        {renderDescription()}
        {renderSpecifications()}
        {renderComments()}
        <View style={{ height: 80 }} />
      </Animated.ScrollView>
      {renderFooter()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    zIndex: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  shareButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  imageGallery: {
    height: width,
    position: 'relative',
  },
  productImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
  },
  pagination: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: 5,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
  },
  productInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e91e63',
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountTag: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    color: '#e91e63',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    lineHeight: 22,
  },
  salesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  salesText: {
    fontSize: 12,
    color: '#666',
  },
  stockText: {
    fontSize: 12,
    color: '#666',
  },
  optionsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  optionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  optionItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#ffebee',
    borderColor: '#e91e63',
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#e91e63',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 15,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  showMoreText: {
    color: '#e91e63',
    marginTop: 5,
    fontSize: 14,
  },
  specificationsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
  },
  specificationRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specificationKey: {
    width: 100,
    fontSize: 14,
    color: '#666',
  },
  specificationValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  commentsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: 14,
    color: '#e91e63',
  },
  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    marginLeft: 'auto',
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 8,
  },
  commentImages: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  commentImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  iconButton: {
    alignItems: 'center',
    marginRight: 15,
    width: 40,
  },
  iconButtonText: {
    fontSize: 12,
    marginTop: 2,
    color: '#666',
  },
  addToCartButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 10,
  },
  addToCartText: {
    color: '#e91e63',
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  buyNowText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 