import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const feedbackTypes = [
  { id: 'bug', title: '问题反馈', icon: '🐛', color: '#ff4757' },
  { id: 'suggestion', title: '功能建议', icon: '💡', color: '#ffa726' },
  { id: 'praise', title: '表扬建议', icon: '👍', color: '#4CAF50' },
  { id: 'other', title: '其他意见', icon: '💬', color: '#42a5f5' }
];

export default function FeedbackPage() {
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState('suggestion');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/profile');
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('提示', '请输入反馈内容');
      return;
    }

    if (content.trim().length < 10) {
      Alert.alert('提示', '反馈内容至少需要10个字符');
      return;
    }

    setLoading(true);

    // 模拟提交
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        '提交成功',
        '感谢您的反馈！我们会认真处理您的意见，并在必要时与您联系。',
        [
          {
            text: '确定',
            onPress: () => {
              // 清空表单
              setContent('');
              setContact('');
              setSelectedType('suggestion');
              handleGoBack();
            }
          }
        ]
      );
    }, 1500);
  };

  const selectedTypeInfo = feedbackTypes.find(type => type.id === selectedType);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 头部 */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>意见反馈</Text>
        <View style={styles.headerRight} />
      </SafeAreaView>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 反馈类型选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>反馈类型</Text>
          <View style={styles.typeGrid}>
            {feedbackTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeItem,
                  selectedType === type.id && styles.typeItemActive
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <View style={[styles.typeIcon, { backgroundColor: type.color }]}>
                  <Text style={styles.typeIconText}>{type.icon}</Text>
                </View>
                <Text style={[
                  styles.typeTitle,
                  selectedType === type.id && styles.typeTitleActive
                ]}>
                  {type.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 反馈内容 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            详细描述 <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textArea}
              placeholder={`请详细描述您的${selectedTypeInfo?.title}...`}
              multiline
              numberOfLines={8}
              value={content}
              onChangeText={setContent}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>{content.length}/500</Text>
          </View>
          
          {/* 提示信息 */}
          <View style={styles.tipContainer}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipText}>
              为了更好地处理您的反馈，请尽量详细描述问题的具体情况、出现步骤或改进建议。
            </Text>
          </View>
        </View>

        {/* 联系方式 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>联系方式（选填）</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入手机号或邮箱，方便我们与您联系"
            value={contact}
            onChangeText={setContact}
            keyboardType="email-address"
          />
        </View>

        {/* 常见问题 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>常见问题</Text>
          <View style={styles.faqContainer}>
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>❓ 如何取消订单？</Text>
              <Text style={styles.faqAnswer}>在订单详情页面可以取消未付款的订单</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>❓ 配送需要多长时间？</Text>
              <Text style={styles.faqAnswer}>标准配送3-5天，快速配送1-2天</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.faqItem}>
              <Text style={styles.faqQuestion}>❓ 如何申请退换货？</Text>
              <Text style={styles.faqAnswer}>在订单详情中选择退换货，填写申请信息</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 底部提交按钮 */}
      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        <TouchableOpacity 
          style={[styles.submitButton, (!content.trim() || loading) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!content.trim() || loading}
        >
          <LinearGradient
            colors={(!content.trim() || loading) ? ['#ccc', '#bbb'] : ['#ff6600', '#ff8f33']}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>
              {loading ? '提交中...' : '提交反馈'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 12,
  },
  required: {
    color: '#ff4757',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  typeItemActive: {
    borderColor: '#ff6600',
    backgroundColor: '#fff5f0',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIconText: {
    fontSize: 24,
  },
  typeTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  typeTitleActive: {
    color: '#ff6600',
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  textArea: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#2e7d32',
    lineHeight: 20,
  },
  faqContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  faqItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  faqQuestion: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
}); 