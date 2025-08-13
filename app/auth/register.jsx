import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../../lib/contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const validatePhone = (phone) => /^1[3-9]\d{9}$/.test(phone);

  const sendCode = async () => {
    if (!validatePhone(phone)) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }

    setCodeSent(true);
    setCountdown(60);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCodeSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    Alert.alert('验证码已发送', `验证码已发送到 ${phone}`);
  };

  const handleRegister = async () => {
    // 验证
    if (!phone.trim()) return Alert.alert('提示', '请输入手机号');
    if (!validatePhone(phone)) return Alert.alert('提示', '请输入正确的手机号');
    if (!code.trim()) return Alert.alert('提示', '请输入验证码');
    if (!password.trim()) return Alert.alert('提示', '请输入密码');
    if (password.length < 6) return Alert.alert('提示', '密码长度不能少于6位');

    try {
      setLoading(true);
      const result = await register(phone, password, code);
      
      if (result.success) {
        Alert.alert('注册成功', `恭喜您注册成功，${result.user.name}！`, [
          { text: '开始使用', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        Alert.alert('注册失败', result.error);
      }
    } catch (error) {
      Alert.alert('注册失败', '请检查网络连接后重试');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.canGoBack() ? router.back() : router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Logo区域 */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🍷</Text>
          </View>
          <Text style={styles.title}>欢迎注册</Text>
          <Text style={styles.subtitle}>请输入您的信息完成注册</Text>
        </View>

        {/* 表单区域 */}
        <View style={styles.formSection}>
          {/* 手机号 */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>📱</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入手机号"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>
          </View>

          {/* 验证码 */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔐</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入验证码"
                placeholderTextColor="#999"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
                maxLength={6}
              />
              <TouchableOpacity 
                style={[styles.codeButton, codeSent && styles.codeButtonDisabled]}
                onPress={sendCode}
                disabled={codeSent}
              >
                <Text style={styles.codeButtonText}>
                  {codeSent ? `${countdown}s` : '获取验证码'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 密码 */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="设置密码（至少6位）"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                maxLength={20}
              />
            </View>
          </View>

          {/* 注册按钮 */}
          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <LinearGradient
              colors={['#ff6600', '#ff8f33']}
              style={styles.registerButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.registerButtonText}>
                {loading ? '注册中...' : '立即注册'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* 底部链接 */}
          <View style={styles.bottomLinks}>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.linkText}>已有账号？立即登录</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <SafeAreaView edges={['bottom']} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#ff6600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formSection: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  codeButton: {
    backgroundColor: '#ff6600',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  codeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  codeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#ff6600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  registerButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0,
  },
  registerButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomLinks: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: '#ff6600',
    fontWeight: '500',
  },
}); 