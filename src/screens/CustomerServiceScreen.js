import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// 模拟订单数据
const orderData = [
  { id: '1001', date: '2023-11-20', status: '已发货', items: ['法国波尔多红酒 2015年份'] },
  { id: '1002', date: '2023-11-18', status: '已完成', items: ['茅台飞天53度 500ml', '麦卡伦12年单一麦芽威士忌'] },
  { id: '1003', date: '2023-11-15', status: '已完成', items: ['法国巴黎之花香槟'] },
];

// 模拟物流信息
const logisticsData = {
  orderId: '1001',
  company: '顺丰速运',
  trackingNumber: 'SF1234567890',
  status: '运输中',
  details: [
    { time: '2023-11-21 14:30', desc: '【广州市】已签收，签收人：本人' },
    { time: '2023-11-21 11:20', desc: '【广州市】快递员正在派送途中' },
    { time: '2023-11-21 09:15', desc: '【广州市】已到达广州白云区配送中心' },
    { time: '2023-11-20 20:30', desc: '【上海市】已发出，下一站广州转运中心' },
    { time: '2023-11-20 18:50', desc: '【上海市】已揽收' },
  ],
};

export default function CustomerServiceScreen({ onClose }) {
  const [messages, setMessages] = useState([
    { id: '1', type: 'system', text: '您好，欢迎来到客服中心，请问有什么可以帮您？', time: '14:30' },
  ]);
  const [inputText, setInputText] = useState('');
  const [showQuickOptions, setShowQuickOptions] = useState(true);
  const [showOrderSelector, setShowOrderSelector] = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // 自动滚动到底部
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // 显示物流信息动画
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: showLogistics ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showLogistics, slideAnim]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowQuickOptions(false);

    // 模拟系统回复
    setTimeout(() => {
      const systemReply = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        text: getAutoReply(inputText),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, systemReply]);
    }, 1000);
  };

  const getAutoReply = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('订单') || lowerText.includes('order')) {
      return '您可以点击下方"查询订单"按钮，选择您要查询的订单。';
    } else if (lowerText.includes('物流') || lowerText.includes('快递') || lowerText.includes('delivery')) {
      return '您可以点击下方"查询物流"按钮，查看您的物流信息。';
    } else if (lowerText.includes('退款') || lowerText.includes('退货') || lowerText.includes('refund')) {
      return '如需办理退款或退货，请点击下方"申请退款/退货"按钮。';
    } else {
      return '感谢您的咨询，我们的客服人员会尽快回复您。您也可以使用下方的快捷选项，或拨打客服热线：400-123-4567。';
    }
  };

  const handleQuickOption = (option) => {
    switch (option) {
      case 'order':
        setShowOrderSelector(true);
        break;
      case 'logistics':
        setShowLogistics(true);
        break;
      case 'refund':
        const refundMessage = {
          id: Date.now().toString(),
          type: 'system',
          text: '请选择您要退款的订单，并说明退款原因。我们的客服人员会在24小时内处理您的申请。',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, refundMessage]);
        setShowOrderSelector(true);
        break;
      default:
        const message = {
          id: Date.now().toString(),
          type: 'user',
          text: option === 'contact' ? '我想联系人工客服' : '我想查看常见问题',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, message]);

        // 模拟系统回复
        setTimeout(() => {
          const reply = {
            id: (Date.now() + 1).toString(),
            type: 'system',
            text: option === 'contact' 
              ? '您好，人工客服工作时间为周一至周日 9:00-22:00，您可以继续在此留言，或拨打客服热线：400-123-4567。' 
              : '您可以访问我们的帮助中心查看常见问题解答：https://help.example.com',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, reply]);
        }, 1000);
    }
  };

  const handleSelectOrder = (order) => {
    setShowOrderSelector(false);
    const orderMessage = {
      id: Date.now().toString(),
      type: 'user',
      text: `我想查询订单：${order.id}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, orderMessage]);

    // 模拟系统回复
    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        text: `订单号：${order.id}\n日期：${order.date}\n状态：${order.status}\n商品：${order.items.join('，')}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.type === 'user' ? styles.userMessageContainer : styles.systemMessageContainer
    ]}>
      <View style={[
        styles.messageBubble,
        item.type === 'user' ? styles.userMessageBubble : styles.systemMessageBubble
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  const renderQuickOptions = () => (
    <View style={styles.quickOptionsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.quickOption}
          onPress={() => handleQuickOption('order')}
        >
          <Ionicons name="receipt-outline" size={20} color="#e91e63" />
          <Text style={styles.quickOptionText}>查询订单</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickOption}
          onPress={() => handleQuickOption('logistics')}
        >
          <Ionicons name="cube-outline" size={20} color="#e91e63" />
          <Text style={styles.quickOptionText}>查询物流</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickOption}
          onPress={() => handleQuickOption('refund')}
        >
          <Ionicons name="return-down-back-outline" size={20} color="#e91e63" />
          <Text style={styles.quickOptionText}>申请退款/退货</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickOption}
          onPress={() => handleQuickOption('contact')}
        >
          <Ionicons name="call-outline" size={20} color="#e91e63" />
          <Text style={styles.quickOptionText}>人工客服</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickOption}
          onPress={() => handleQuickOption('faq')}
        >
          <Ionicons name="help-circle-outline" size={20} color="#e91e63" />
          <Text style={styles.quickOptionText}>常见问题</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderOrderSelector = () => (
    <View style={styles.overlayContainer}>
      <View style={styles.overlayContent}>
        <View style={styles.overlayHeader}>
          <Text style={styles.overlayTitle}>选择订单</Text>
          <TouchableOpacity onPress={() => setShowOrderSelector(false)}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={orderData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderItem}
              onPress={() => handleSelectOrder(item)}
            >
              <View>
                <Text style={styles.orderNumber}>订单号：{item.id}</Text>
                <Text style={styles.orderDate}>日期：{item.date}</Text>
                <Text style={styles.orderProducts}>
                  商品：{item.items.join('，')}
                </Text>
              </View>
              <View style={styles.orderStatus}>
                <Text style={styles.orderStatusText}>{item.status}</Text>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );

  const renderLogistics = () => {
    const translateY = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View style={styles.overlayContainer}>
        <TouchableOpacity
          style={styles.overlayBackdrop}
          activeOpacity={1}
          onPress={() => setShowLogistics(false)}
        />
        <Animated.View
          style={[
            styles.logisticsContainer,
            { transform: [{ translateY }] }
          ]}
        >
          <View style={styles.logisticsHeader}>
            <Text style={styles.logisticsTitle}>物流详情</Text>
            <TouchableOpacity onPress={() => setShowLogistics(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.logisticsInfo}>
            <Text style={styles.logisticsCompany}>
              物流公司：{logisticsData.company}
            </Text>
            <Text style={styles.logisticsNumber}>
              运单号码：{logisticsData.trackingNumber}
            </Text>
            <Text style={styles.logisticsStatus}>
              物流状态：{logisticsData.status}
            </Text>
          </View>
          <View style={styles.logisticsTimeline}>
            {logisticsData.details.map((detail, index) => (
              <View key={index} style={styles.logisticsItem}>
                <View style={styles.logisticsPoint}>
                  <View
                    style={[
                      styles.logisticsDot,
                      index === 0 && styles.logisticsActiveDot,
                    ]}
                  />
                  {index !== logisticsData.details.length - 1 && (
                    <View style={styles.logisticsLine} />
                  )}
                </View>
                <View style={styles.logisticsContent}>
                  <Text style={styles.logisticsTime}>{detail.time}</Text>
                  <Text style={styles.logisticsDesc}>{detail.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>客服中心</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        ref={flatListRef}
        style={styles.messageList}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageListContent}
      />

      {showQuickOptions && renderQuickOptions()}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="请输入您的问题..."
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={inputText.trim() ? '#e91e63' : '#ccc'}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>

      {showOrderSelector && renderOrderSelector()}
      {showLogistics && renderLogistics()}
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
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  systemMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
  },
  userMessageBubble: {
    backgroundColor: '#e91e63',
    borderBottomRightRadius: 4,
  },
  systemMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  userMessageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
  },
  quickOptionsContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  quickOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 5,
  },
  quickOptionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderProducts: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderStatusText: {
    fontSize: 14,
    color: '#e91e63',
    marginRight: 5,
  },
  logisticsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  logisticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logisticsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  logisticsInfo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logisticsCompany: {
    fontSize: 16,
    marginBottom: 5,
  },
  logisticsNumber: {
    fontSize: 16,
    marginBottom: 5,
  },
  logisticsStatus: {
    fontSize: 16,
    color: '#e91e63',
  },
  logisticsTimeline: {
    padding: 15,
  },
  logisticsItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  logisticsPoint: {
    width: 20,
    alignItems: 'center',
  },
  logisticsDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  logisticsActiveDot: {
    backgroundColor: '#e91e63',
  },
  logisticsLine: {
    width: 2,
    height: 40,
    backgroundColor: '#eee',
    marginTop: 5,
    alignSelf: 'center',
  },
  logisticsContent: {
    flex: 1,
    marginLeft: 10,
  },
  logisticsTime: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  logisticsDesc: {
    fontSize: 16,
    color: '#333',
  },
}); 