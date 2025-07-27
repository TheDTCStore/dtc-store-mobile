import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 添加商品到购物车
  const addToCart = (product, quantity = 1, options = {}) => {
    setCartItems(prevItems => {
      // 检查是否已存在相同商品和选项
      const existingItemIndex = prevItems.findIndex(
        item => 
          item.id === product.id && 
          JSON.stringify(item.options) === JSON.stringify(options)
      );

      if (existingItemIndex !== -1) {
        // 如果已存在，更新数量
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // 如果不存在，添加新项
        return [...prevItems, {
          ...product,
          quantity,
          options,
          cartItemId: Date.now().toString() // 唯一标识符
        }];
      }
    });
  };

  // 从购物车移除商品
  const removeFromCart = (cartItemId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.cartItemId !== cartItemId)
    );
  };

  // 更新购物车中商品数量
  const updateQuantity = (cartItemId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.cartItemId === cartItemId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // 清空购物车
  const clearCart = () => {
    setCartItems([]);
  };

  // 计算购物车总价
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('¥', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  // 计算购物车商品总数
  const getItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext); 