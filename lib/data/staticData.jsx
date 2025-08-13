// 分类数据
export const categories = [
  {
    id: 1,
    name: '红酒',
    icon: '🍷',
    color: '#e53e3e',
    description: '精选进口红酒'
  },
  {
    id: 2,
    name: '白酒',
    icon: '🥃',
    color: '#d69e2e',
    description: '传统国酒精品'
  },
  {
    id: 3,
    name: '啤酒',
    icon: '🍺',
    color: '#f6ad55',
    description: '清爽啤酒系列'
  },
  {
    id: 4,
    name: '洋酒',
    icon: '🥂',
    color: '#38b2ac',
    description: '进口烈性酒'
  },
  {
    id: 5,
    name: '威士忌',
    icon: '🥃',
    color: '#805ad5',
    description: '苏格兰威士忌'
  },
  {
    id: 6,
    name: '香槟',
    icon: '🍾',
    color: '#ed8936',
    description: '庆祝首选'
  },
  {
    id: 7,
    name: '清酒',
    icon: '🍶',
    color: '#4299e1',
    description: '日式清酒'
  },
  {
    id: 8,
    name: '伏特加',
    icon: '🧊',
    color: '#48bb78',
    description: '纯净烈酒'
  }
];

// 商品数据
export const products = [
  {
    id: 1,
    name: '茅台酒',
    category: '白酒',
    price: 2899,
    originalPrice: 3299,
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
    description: '贵州茅台酒，53度，500ml',
    rating: 4.9,
    reviews: 2580,
    stock: 50,
    tags: ['热销', '正品保证'],
    specifications: ['53度', '500ml', '酱香型']
  },
  {
    id: 2,
    name: '五粮液',
    category: '白酒',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1551797197-99af35e44605?w=400',
    description: '五粮液浓香型白酒，52度，500ml',
    rating: 4.8,
    reviews: 1890,
    stock: 30,
    tags: ['经典', '浓香型'],
    specifications: ['52度', '500ml', '浓香型']
  },
  {
    id: 3,
    name: '拉菲红酒',
    category: '红酒',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400',
    description: '法国波尔多拉菲红酒，750ml',
    rating: 4.7,
    reviews: 856,
    stock: 25,
    tags: ['进口', '波尔多'],
    specifications: ['13.5度', '750ml', '干红']
  },
  {
    id: 4,
    name: '青岛啤酒',
    category: '啤酒',
    price: 158,
    originalPrice: 188,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
    description: '青岛啤酒经典款，330ml*24罐',
    rating: 4.5,
    reviews: 3200,
    stock: 100,
    tags: ['国产', '经典'],
    specifications: ['4.3度', '330ml*24', '淡色拉格']
  },
  {
    id: 5,
    name: '轩尼诗XO',
    category: '洋酒',
    price: 1888,
    originalPrice: 2288,
    image: 'https://images.unsplash.com/photo-1577057713682-4b50b7b9a4e5?w=400',
    description: '轩尼诗XO干邑白兰地，700ml',
    rating: 4.9,
    reviews: 420,
    stock: 15,
    tags: ['奢华', '收藏级'],
    specifications: ['40度', '700ml', '干邑']
  },
  {
    id: 6,
    name: '皇家礼炮',
    category: '威士忌',
    price: 688,
    originalPrice: 888,
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
    description: '皇家礼炮21年苏格兰威士忌，700ml',
    rating: 4.6,
    reviews: 690,
    stock: 20,
    tags: ['21年', '苏格兰'],
    specifications: ['40度', '700ml', '调和威士忌']
  },
  {
    id: 7,
    name: '香槟王',
    category: '香槟',
    price: 799,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1551797197-99af35e44605?w=400',
    description: '法国香槟王干型香槟，750ml',
    rating: 4.8,
    reviews: 340,
    stock: 18,
    tags: ['法国', '庆典'],
    specifications: ['12度', '750ml', '干型香槟']
  },
  {
    id: 8,
    name: '獭祭清酒',
    category: '清酒',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400',
    description: '獭祭纯米大吟酿清酒，720ml',
    rating: 4.7,
    reviews: 580,
    stock: 40,
    tags: ['日本', '纯米大吟酿'],
    specifications: ['16度', '720ml', '纯米大吟酿']
  },
  {
    id: 9,
    name: '绝对伏特加',
    category: '伏特加',
    price: 199,
    originalPrice: 259,
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400',
    description: '瑞典绝对伏特加，750ml',
    rating: 4.4,
    reviews: 920,
    stock: 60,
    tags: ['瑞典', '经典'],
    specifications: ['40度', '750ml', '纯净']
  },
  {
    id: 10,
    name: '剑南春',
    category: '白酒',
    price: 468,
    originalPrice: 568,
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
    description: '剑南春浓香型白酒，52度，500ml',
    rating: 4.6,
    reviews: 1250,
    stock: 35,
    tags: ['四川', '浓香型'],
    specifications: ['52度', '500ml', '浓香型']
  }
];

// 轮播图数据
export const banners = [
  {
    id: 1,
    title: '新品上市',
    subtitle: '精选洋酒',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800',
    link: '/category/5',
    backgroundColor: '#ff6600'
  },
  {
    id: 2,
    title: '限时特惠',
    subtitle: '红酒专场',
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800',
    link: '/category/1',
    backgroundColor: '#e53e3e'
  },
  {
    id: 3,
    title: '会员专享',
    subtitle: '白酒精选',
    image: 'https://images.unsplash.com/photo-1551797197-99af35e44605?w=800',
    link: '/category/2',
    backgroundColor: '#d69e2e'
  }
];

// 热门搜索关键词
export const hotSearchKeywords = [
  '茅台', '五粮液', '拉菲', '威士忌', '红酒',
  '白酒', '香槟', '清酒', '轩尼诗', '青岛啤酒'
];

// 搜索历史（示例数据）
export const searchHistory = [
  '茅台酒',
  '拉菲红酒',
  '轩尼诗XO',
  '青岛啤酒'
]; 