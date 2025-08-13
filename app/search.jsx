import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

import ProductCard from '../components/ui/ProductCard';
import { api } from '../lib/api';

// 热门搜索关键词
const HOT_KEYWORDS = [
  '茅台', '五粮液', '剑南春', '红酒', '白酒',
  '啤酒', '洋酒', '威士忌', '香槟', '干红'
];

// 搜索历史（模拟数据）
const SEARCH_HISTORY = [
  '茅台酒', '拉菲红酒', '轩尼诗XO', '青岛啤酒'
];

export default function SearchPage() {
  const params = useLocalSearchParams();
  const [searchText, setSearchText] = useState(params.q || '');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (params.q) {
      handleSearch(params.q);
    }
  }, [params.q]);

  const handleSearch = async (keyword = searchText) => {
    if (!keyword.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);
      const result = await api.searchProducts(keyword.trim());
      if (result.success) {
        setSearchResults(result.data);
      }
    } catch (error) {
      Alert.alert('搜索失败', '请检查网络连接后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordPress = (keyword) => {
    setSearchText(keyword);
    handleSearch(keyword);
  };

  const handleProductPress = (product) => {
    router.push(`/product/${product.id}`);
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索您喜欢的酒类..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={() => handleSearch()}
        >
          <Text style={styles.searchButtonText}>搜索</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {!hasSearched ? (
          <>
            {/* 搜索历史 */}
            {SEARCH_HISTORY.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>搜索历史</Text>
                  <TouchableOpacity>
                    <Text style={styles.clearHistoryText}>清空</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.keywordsContainer}>
                  {SEARCH_HISTORY.map((keyword, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.historyKeyword}
                      onPress={() => handleKeywordPress(keyword)}
                    >
                      <Text style={styles.historyKeywordText}>🕒 {keyword}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* 热门搜索 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>热门搜索</Text>
              <View style={styles.keywordsContainer}>
                {HOT_KEYWORDS.map((keyword, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.hotKeyword,
                      index < 3 && styles.topKeyword
                    ]}
                    onPress={() => handleKeywordPress(keyword)}
                  >
                    <Text style={[
                      styles.hotKeywordText,
                      index < 3 && styles.topKeywordText
                    ]}>
                      {index < 3 && '🔥'} {keyword}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 搜索建议 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>搜索建议</Text>
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionText}>• 试试搜索品牌名称，如"茅台"、"五粮液"</Text>
                <Text style={styles.suggestionText}>• 可以按酒类搜索，如"红酒"、"白酒"</Text>
                <Text style={styles.suggestionText}>• 搜索产地，如"法国"、"贵州"</Text>
                <Text style={styles.suggestionText}>• 按度数搜索，如"53度"、"12度"</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* 搜索结果 */}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                "{searchText}" 的搜索结果
              </Text>
              <Text style={styles.resultsCount}>
                {loading ? '搜索中...' : `共找到 ${searchResults.length} 件商品`}
              </Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>正在搜索...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <View style={styles.resultsContainer}>
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPress={handleProductPress}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsIcon}>🔍</Text>
                <Text style={styles.noResultsText}>未找到相关商品</Text>
                <Text style={styles.noResultsSubtext}>
                  试试其他关键词或浏览推荐商品
                </Text>
                <TouchableOpacity 
                  style={styles.browseButton}
                  onPress={() => router.push('/shop')}
                >
                  <Text style={styles.browseButtonText}>浏览商城</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 44,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  searchButton: {
    backgroundColor: '#7c2d12',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  clearHistoryText: {
    fontSize: 14,
    color: '#6b7280',
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyKeyword: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  historyKeywordText: {
    fontSize: 14,
    color: '#374151',
  },
  hotKeyword: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  topKeyword: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  hotKeywordText: {
    fontSize: 14,
    color: '#374151',
  },
  topKeywordText: {
    color: '#7c2d12',
    fontWeight: '600',
  },
  suggestionsContainer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#7c2d12',
  },
  suggestionText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  resultsHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  noResultsIcon: {
    fontSize: 80,
    marginBottom: 20,
    opacity: 0.5,
  },
  noResultsText: {
    fontSize: 20,
    color: '#6b7280',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#7c2d12',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 