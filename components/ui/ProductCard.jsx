import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProductCard({ product, onPress, style, layoutType = 'grid' }) {
  const discountPrice = product.originalPrice - product.price;

  if (layoutType === 'list') {
    return (
      <TouchableOpacity 
        style={[styles.containerList, style]} 
        onPress={() => onPress?.(product)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainerList}>
          <Image source={{ uri: product.image }} style={styles.imageList} />
          {product.tags && product.tags.includes('热销') && (
            <View style={styles.hotBadgeList}>
              <Text style={styles.hotTextList}>🔥</Text>
            </View>
          )}
        </View>
        
        <View style={styles.contentList}>
          <View style={styles.headerList}>
            <Text style={styles.categoryList}>{product.category}</Text>
            {product.rating && (
              <Text style={styles.ratingList}>⭐ {product.rating}</Text>
            )}
          </View>
          
          <Text style={styles.nameList} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.descriptionList} numberOfLines={1}>{product.description}</Text>
          
          <View style={styles.priceContainerList}>
            <View style={styles.priceRowList}>
              <Text style={styles.priceList}>¥{product.price}</Text>
              {product.originalPrice > product.price && (
                <Text style={styles.originalPriceList}>¥{product.originalPrice}</Text>
              )}
            </View>
            {product.tags && (
              <View style={styles.tagsContainer}>
                {product.tags.slice(0, 2).map((tag, index) => (
                  <Text key={index} style={styles.tag}>{tag}</Text>
                ))}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // 网格布局（默认）
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={() => onPress?.(product)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        {product.tags && product.tags.includes('热销') && (
          <View style={styles.hotBadge}>
            <Text style={styles.hotText}>🔥 热销</Text>
          </View>
        )}
        {discountPrice > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{Math.round((discountPrice / product.originalPrice) * 100)}%</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={1}>{product.description}</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {product.rating}</Text>
          {product.reviews && (
            <Text style={styles.reviews}>({product.reviews})</Text>
          )}
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>¥{product.price}</Text>
          {product.originalPrice > product.price && (
            <Text style={styles.originalPrice}>¥{product.originalPrice}</Text>
          )}
          {discountPrice > 0 && (
            <Text style={styles.savePrice}>省¥{discountPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // 网格布局样式
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hotBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hotText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff6b35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  category: {
    fontSize: 12,
    color: '#ff6600',
    fontWeight: '600',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  reviews: {
    fontSize: 11,
    color: '#999',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4444',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  savePrice: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },

  // 列表布局样式
  containerList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainerList: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  imageList: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hotBadgeList: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#ff4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotTextList: {
    fontSize: 10,
  },
  contentList: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryList: {
    fontSize: 11,
    color: '#ff6600',
    fontWeight: '600',
  },
  ratingList: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: '600',
  },
  nameList: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  descriptionList: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceContainerList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceRowList: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceList: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4444',
    marginRight: 6,
  },
  originalPriceList: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  tagsContainer: {
    flexDirection: 'row',
  },
  tag: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
}); 