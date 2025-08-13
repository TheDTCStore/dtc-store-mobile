import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#ff6600" />
      <LinearGradient
        colors={['#ff6600', '#ff8f33']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Text style={styles.emoji}>🍷</Text>
            <Text style={styles.title}>页面走丢了</Text>
            <Text style={styles.message}>
              抱歉，您访问的页面不存在{'\n'}
              可能是链接错误或页面已被移除
            </Text>
            
            <View style={styles.suggestions}>
              <Text style={styles.suggestionsTitle}>您可以尝试：</Text>
              <Text style={styles.suggestionItem}>• 检查网址是否正确</Text>
              <Text style={styles.suggestionItem}>• 返回首页重新浏览</Text>
              <Text style={styles.suggestionItem}>• 使用搜索功能查找商品</Text>
            </View>

            <TouchableOpacity style={styles.linkContainer}>
              <Link href="/(tabs)" style={styles.link}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                  style={styles.linkGradient}
                >
                  <Text style={styles.linkText}>🏠 回到首页</Text>
                </LinearGradient>
              </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkContainer}>
              <Link href="/(tabs)/shop" style={styles.link}>
                <View style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>🛒 去购物</Text>
                </View>
              </Link>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  message: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  suggestions: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    alignSelf: 'stretch',
  },
  suggestionsTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestionItem: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    lineHeight: 20,
  },
  linkContainer: {
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  link: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  linkGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  linkText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#ff6600',
    fontWeight: '700',
  },
}); 