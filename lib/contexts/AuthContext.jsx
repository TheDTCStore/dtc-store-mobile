import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化时检查登录状态
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      
      if (userData && token) {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log('检查登录状态失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password) => {
    try {
      // 写死的账号密码验证
      const validAccounts = [
        { phone: '13800138000', password: '123456', name: '张三' },
        { phone: '13900139000', password: '123456', name: '李四' },
        { phone: 'admin', password: 'admin', name: '管理员' },
        { phone: '123456', password: '123456', name: '测试用户' }
      ];

      const account = validAccounts.find(acc => 
        acc.phone === phone && acc.password === password
      );

      if (!account) {
        throw new Error('手机号或密码错误');
      }

      // 模拟用户数据
      const userData = {
        id: Date.now(),
        name: account.name,
        phone: phone,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        level: 'VIP会员',
        points: 2580,
      };

      const token = 'mock_token_' + Date.now();

      // 保存到本地存储
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', token);

      setUser(userData);
      setIsLoggedIn(true);

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (phone, password, code) => {
    try {
      // 简单的注册验证
      if (!phone || !password || !code) {
        throw new Error('请填写完整信息');
      }

      if (code !== '123456') {
        throw new Error('验证码错误');
      }

      // 模拟注册成功
      const userData = {
        id: Date.now(),
        name: '新用户',
        phone: phone,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        level: '普通会员',
        points: 100,
      };

      const token = 'mock_token_' + Date.now();

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', token);

      setUser(userData);
      setIsLoggedIn(true);

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
    register,
    updateUser,
    checkLoginStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 