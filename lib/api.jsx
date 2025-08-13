import { categories, products, banners } from './data/staticData';

// 模拟API延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // 获取轮播图数据
  getBanners: async () => {
    await delay(300);
    return {
      success: true,
      data: banners
    };
  },

  // 获取分类数据
  getCategories: async () => {
    await delay(200);
    return {
      success: true,
      data: categories
    };
  },

  // 获取推荐商品
  getFeaturedProducts: async () => {
    await delay(400);
    // 返回前6个商品作为推荐商品
    return {
      success: true,
      data: products.slice(0, 6)
    };
  },

  // 获取所有商品
  getProducts: async () => {
    await delay(500);
    return {
      success: true,
      data: products
    };
  },

  // 根据分类获取商品
  getProductsByCategory: async (categoryId) => {
    await delay(300);
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) {
      return {
        success: false,
        message: '分类不存在'
      };
    }
    
    const categoryProducts = products.filter(product => product.category === category.name);
    return {
      success: true,
      data: categoryProducts
    };
  },

  // 根据ID获取商品详情
  getProductById: async (productId) => {
    await delay(200);
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
      return {
        success: false,
        message: '商品不存在'
      };
    }
    return {
      success: true,
      data: product
    };
  },

  // 搜索商品
  searchProducts: async (keyword) => {
    await delay(400);
    const searchResults = products.filter(product => 
      product.name.toLowerCase().includes(keyword.toLowerCase()) ||
      product.category.toLowerCase().includes(keyword.toLowerCase()) ||
      product.description.toLowerCase().includes(keyword.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    return {
      success: true,
      data: searchResults
    };
  },

  // 用户登录
  login: async (credentials) => {
    await delay(1000);
    // 模拟登录逻辑
    if (credentials.username === 'admin' && credentials.password === 'password') {
      return {
        success: true,
        data: {
          user: {
            id: 1,
            username: 'admin',
            name: '管理员',
            email: 'admin@example.com',
            phone: '138****8888'
          },
          token: 'mock_token_12345'
        }
      };
    } else {
      return {
        success: false,
        message: '用户名或密码错误'
      };
    }
  },

  // 用户注册
  register: async (userInfo) => {
    await delay(1200);
    // 模拟注册逻辑
    return {
      success: true,
      data: {
        user: {
          id: 2,
          username: userInfo.username,
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone
        },
        token: 'mock_token_67890'
      }
    };
  },

  // 添加到购物车
  addToCart: async (productId, quantity = 1) => {
    await delay(300);
    return {
      success: true,
      message: '已添加到购物车'
    };
  },

  // 获取购物车
  getCart: async () => {
    await delay(300);
    // 模拟购物车数据
    return {
      success: true,
      data: {
        items: [
          {
            id: 1,
            product: products[0],
            quantity: 2,
            selected: true
          },
          {
            id: 2,
            product: products[2],
            quantity: 1,
            selected: true
          },
          {
            id: 3,
            product: products[3],
            quantity: 6,
            selected: false
          }
        ],
        totalAmount: 6096,
        discountAmount: 1100
      }
    };
  }
}; 