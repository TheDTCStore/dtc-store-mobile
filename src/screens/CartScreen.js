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
import { useCart } from '../context/CartContext';

export default function CartScreen({ onClose, onCheckout }) {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [selectedItems, setSelectedItems] = useState(cartItems.map(item => item.cartItemId));

  const isAllSelected = selectedItems.length === cartItems.length;
  const totalPrice = selectedItems.reduce((total, id) => {
    const item = cartItems.find(item => item.cartItemId === id);
    if (item) {
      const price = parseFloat(item.price.replace('¥', ''));
      return total + (price * item.quantity);
    }
    return total;
  }, 0);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.cartItemId));
    }
  };

  const handleSelectItem = (cartItemId) => {
    if (selectedItems.includes(cartItemId)) {
      setSelectedItems(selectedItems.filter(id => id !== cartItemId));
    } else {
      setSelectedItems([...selectedItems, cartItemId]);
    }
  };

  const handleRemoveItem = (cartItemId) => {
    Alert.alert(
      '删除商品',
      '确定要从购物车中删除该商品吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            removeFromCart(cartItemId);
            setSelectedItems(selectedItems.filter(id => id !== cartItemId));
          }
        },
      ]
    );
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    
    Alert.alert(
      '清空购物车',
      '确定要清空购物车吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            clearCart();
            setSelectedItems([]);
          }
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert('提示', '请选择要结算的商品');
      return;
    }
    
    const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.cartItemId));
    onCheckout && onCheckout(itemsToCheckout, totalPrice);
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyText}>购物车空空如也</Text>
      <TouchableOpacity style={styles.goShopButton} onPress={onClose}>
        <Text style={styles.goShopButtonText}>去逛逛</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.cartItemId);
    
    return (
      <View style={styles.cartItem}>
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => handleSelectItem(item.cartItemId)}
        >
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
        </TouchableOpacity>
        
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.optionsContainer}>
            {item.options.option && (
              <Text style={styles.optionText}>容量: {item.options.option}</Text>
            )}
            {item.options.vintage && (
              <Text style={styles.optionText}>年份: {item.options.vintage}</Text>
            )}
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.itemPrice}>{item.price}</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Text style={[
                  styles.quantityButtonText, 
                  item.quantity <= 1 && styles.disabledText
                ]}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.cartItemId, item.quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleRemoveItem(item.cartItemId)}
        >
          <Ionicons name="trash-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>购物车</Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
          <Text style={styles.clearButtonText}>清空</Text>
        </TouchableOpacity>
      </View>

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.cartItemId}
            contentContainerStyle={styles.cartList}
          />
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.selectAllContainer}
              onPress={handleSelectAll}
            >
              <View style={[styles.checkbox, isAllSelected && styles.checkboxSelected]}>
                {isAllSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={styles.selectAllText}>全选</Text>
            </TouchableOpacity>
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>合计：</Text>
              <Text style={styles.totalPrice}>¥{totalPrice.toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>
                结算({selectedItems.length})
              </Text>
            </TouchableOpacity>
          </View>
        </>
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
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#999',
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
  goShopButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#e91e63',
    borderRadius: 20,
  },
  goShopButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cartList: {
    paddingVertical: 10,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#e91e63',
    borderColor: '#e91e63',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    marginBottom: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  optionText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  disabledText: {
    color: '#ccc',
  },
  quantityText: {
    fontSize: 14,
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 5,
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 60,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    fontSize: 14,
    marginLeft: 5,
  },
  totalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 15,
  },
  totalLabel: {
    fontSize: 14,
    color: '#333',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  checkoutButton: {
    backgroundColor: '#e91e63',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
}); 