import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function CustomerServicePage() {
  const insets = useSafeAreaInsets();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: '您好！欢迎来到精品酒类商城',
      time: '18:16:56'
    },
    {
      id: 2,
      type: 'system',
      content: '我是您的专属客服小助手 💝',
      time: '18:16:56'
    },
    {
      id: 3,
      type: 'system',
      content: '请问有什么可以帮助您的吗？',
      time: '18:16:56'
    }
  ]);

  const quickReplies = [
    '商品真伪如何保证？',
    '配送时间费用',
    '退货'
  ];

  
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputMessage.trim(),
        time: new Date().toLocaleTimeString('zh-CN', { hour12: false }).slice(0, 5)
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      
      // 模拟客服回复
      setTimeout(() => {
        const reply = {
          id: messages.length + 2,
          type: 'system',
          content: '收到您的问题，客服正在为您处理，请稍候...',
          time: new Date().toLocaleTimeString('zh-CN', { hour12: false }).slice(0, 5)
        };
        setMessages(prev => [...prev, reply]);
      }, 1000);
    }
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/profile');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* 统一的顶部导航 */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>客服中心</Text>
          <View style={styles.headerRight} />
        </View>
      </SafeAreaView>

      {/* 聊天区域 */}
      <ScrollView 
        style={styles.chatArea}
        contentContainerStyle={[
          styles.chatContent,
          { paddingBottom: 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View key={message.id} style={styles.messageContainer}>
            <View style={[
              styles.messageBox,
              message.type === 'user' ? styles.userMessage : styles.systemMessage
            ]}>
              <Text style={[
                styles.messageText,
                message.type === 'user' ? styles.userMessageText : styles.systemMessageText
              ]}>
                {message.content}
              </Text>
            </View>
            <Text style={[
              styles.messageTime,
              message.type === 'user' ? styles.userMessageTime : styles.systemMessageTime
            ]}>
              {message.time}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* 快捷回复 */}
      <View style={styles.quickReplyContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {quickReplies.map((reply, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickReplyButton}
              onPress={() => handleQuickReply(reply)}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 输入区域 */}
      <SafeAreaView style={styles.inputArea} edges={['bottom']}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="请输入您的问题..."
            placeholderTextColor="#999"
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, inputMessage.trim() ? styles.sendButtonActive : null]}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            <Text style={[
              styles.sendButtonText,
              inputMessage.trim() ? styles.sendButtonTextActive : null
            ]}>
              发送
            </Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backIcon: {
    fontSize: 20,
    color: '#333',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  headerRight: {
    width: 48,
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  chatContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageBox: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  systemMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: '#ff6600',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  systemMessageText: {
    color: '#333',
  },
  userMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  systemMessageTime: {
    alignSelf: 'flex-start',
    marginLeft: 4,
  },
  userMessageTime: {
    alignSelf: 'flex-end',
    marginRight: 4,
  },
  quickReplyContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quickReplyButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickReplyText: {
    fontSize: 13,
    color: '#666',
  },
  inputArea: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    maxHeight: 80,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sendButton: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#ff6600',
  },
  sendButtonText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  sendButtonTextActive: {
    color: '#fff',
  },
}); 