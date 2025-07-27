import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// 模拟会员等级数据
const membershipLevels = [
  {
    id: '1',
    name: '普通会员',
    icon: 'wine-outline',
    color: '#9e9e9e',
    points: 0,
    benefits: [
      '生日特惠',
      '专属客服',
      '参与品鉴活动',
    ],
  },
  {
    id: '2',
    name: '品鉴家',
    icon: 'wine',
    color: '#ffc107',
    points: 500,
    benefits: [
      '生日特惠',
      '专属客服',
      '参与品鉴活动',
      '每月赠送50酒币',
      '购物满500减50',
    ],
  },
  {
    id: '3',
    name: '侍酒师',
    icon: 'wine',
    color: '#2196f3',
    points: 2000,
    benefits: [
      '生日特惠',
      '专属客服',
      '参与品鉴活动',
      '每月赠送100酒币',
      '购物满500减100',
      '专属新品尝鲜',
    ],
  },
  {
    id: '4',
    name: '酒庄大师',
    icon: 'wine',
    color: '#e91e63',
    points: 5000,
    benefits: [
      '生日特惠',
      '专属客服',
      '参与品鉴活动',
      '每月赠送200酒币',
      '购物满500减150',
      '专属新品尝鲜',
      '酒庄参观特权',
      '专属定制服务',
    ],
  },
];

// 模拟品鉴记录数据
const tastingRecords = [
  {
    id: '1',
    name: '法国波尔多品鉴会',
    date: '2023-11-15',
    location: '上海外滩会所',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    status: 'completed',
  },
  {
    id: '2',
    name: '意大利托斯卡纳红酒专场',
    date: '2023-12-05',
    location: '北京国贸酒店',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    status: 'upcoming',
  },
  {
    id: '3',
    name: '澳大利亚葡萄酒品鉴',
    date: '2024-01-20',
    location: '广州四季酒店',
    image: 'https://images.unsplash.com/photo-1566452348683-96bdaf92cbb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    status: 'upcoming',
  },
];

export default function MembershipScreen({ onClose }) {
  const [activeTab, setActiveTab] = useState('membership');
  const [showBenefits, setShowBenefits] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // 模拟当前用户数据
  const currentUser = {
    name: '张三',
    points: 520,
    level: '2', // 对应 membershipLevels 中的 id
    nextLevel: '3',
    progress: 0.26, // 进度百分比 (520 / 2000)
  };

  const getCurrentLevel = () => {
    return membershipLevels.find(level => level.id === currentUser.level);
  };

  const getNextLevel = () => {
    return membershipLevels.find(level => level.id === currentUser.nextLevel);
  };

  const handleViewBenefits = (level) => {
    setSelectedLevel(level);
    setShowBenefits(true);
  };

  const renderMembershipCard = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();

    return (
      <View style={styles.membershipCard}>
        <View style={styles.cardHeader}>
          <View style={styles.levelInfo}>
            <Text style={styles.memberName}>{currentUser.name}</Text>
            <View style={[styles.levelBadge, { backgroundColor: currentLevel.color }]}>
              <Ionicons name={currentLevel.icon} size={14} color="#fff" />
              <Text style={styles.levelText}>{currentLevel.name}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.benefitsButton}
            onPress={() => handleViewBenefits(currentLevel)}
          >
            <Text style={styles.benefitsButtonText}>查看特权</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pointsSection}>
          <View style={styles.pointsInfo}>
            <Text style={styles.pointsLabel}>我的酒币</Text>
            <Text style={styles.pointsValue}>{currentUser.points}</Text>
          </View>
          <View style={styles.pointsInfo}>
            <Text style={styles.pointsLabel}>距离{nextLevel.name}</Text>
            <Text style={styles.pointsValue}>{nextLevel.points - currentUser.points}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${currentUser.progress * 100}%`, backgroundColor: currentLevel.color }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressStart}>{currentLevel.points}</Text>
            <Text style={styles.progressEnd}>{nextLevel.points}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderLevelItem = ({ item }) => {
    const isCurrentLevel = item.id === currentUser.level;
    
    return (
      <TouchableOpacity
        style={[
          styles.levelItem,
          isCurrentLevel && { borderColor: item.color, borderWidth: 2 },
        ]}
        onPress={() => handleViewBenefits(item)}
      >
        <View style={[styles.levelIconContainer, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={24} color="#fff" />
        </View>
        <Text style={styles.levelItemName}>{item.name}</Text>
        <Text style={styles.levelItemPoints}>{item.points}酒币</Text>
        {isCurrentLevel && (
          <View style={[styles.currentLevelTag, { backgroundColor: item.color }]}>
            <Text style={styles.currentLevelText}>当前等级</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTastingItem = ({ item }) => (
    <TouchableOpacity style={styles.tastingItem}>
      <Image source={{ uri: item.image }} style={styles.tastingImage} />
      <View style={styles.tastingOverlay} />
      <View style={styles.tastingContent}>
        <Text style={styles.tastingName}>{item.name}</Text>
        <View style={styles.tastingDetails}>
          <View style={styles.tastingDetail}>
            <Ionicons name="calendar-outline" size={14} color="#fff" />
            <Text style={styles.tastingDetailText}>{item.date}</Text>
          </View>
          <View style={styles.tastingDetail}>
            <Ionicons name="location-outline" size={14} color="#fff" />
            <Text style={styles.tastingDetailText}>{item.location}</Text>
          </View>
        </View>
        <View style={[styles.tastingStatus, { backgroundColor: item.status === 'completed' ? '#4caf50' : '#ff9800' }]}>
          <Text style={styles.tastingStatusText}>
            {item.status === 'completed' ? '已参加' : '即将开始'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBenefitsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showBenefits}
      onRequestClose={() => setShowBenefits(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>会员特权</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowBenefits(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {selectedLevel && (
            <View style={styles.modalBody}>
              <View style={[styles.benefitsHeader, { backgroundColor: selectedLevel.color }]}>
                <Ionicons name={selectedLevel.icon} size={40} color="#fff" />
                <Text style={styles.benefitsTitle}>{selectedLevel.name}</Text>
                <Text style={styles.benefitsPoints}>{selectedLevel.points}酒币</Text>
              </View>

              <View style={styles.benefitsList}>
                {selectedLevel.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <Ionicons name="checkmark-circle" size={20} color={selectedLevel.color} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>

              {selectedLevel.id !== '4' && (
                <Text style={styles.benefitsNote}>
                  继续累积酒币可升级到更高会员等级，享受更多特权
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>会员中心</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'membership' && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab('membership')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'membership' && styles.activeTabText,
            ]}
          >
            会员等级
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabItem,
            activeTab === 'tasting' && styles.activeTabItem,
          ]}
          onPress={() => setActiveTab('tasting')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'tasting' && styles.activeTabText,
            ]}
          >
            品鉴记录
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'membership' ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderMembershipCard()}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>会员等级</Text>
            <FlatList
              data={membershipLevels}
              renderItem={renderLevelItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.levelsList}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>酒币规则</Text>
            </View>
            <View style={styles.rulesContainer}>
              <View style={styles.ruleItem}>
                <View style={styles.ruleIconContainer}>
                  <Ionicons name="cart-outline" size={24} color="#e91e63" />
                </View>
                <View style={styles.ruleContent}>
                  <Text style={styles.ruleTitle}>消费获取</Text>
                  <Text style={styles.ruleDesc}>每消费1元获得1酒币</Text>
                </View>
              </View>
              <View style={styles.ruleItem}>
                <View style={styles.ruleIconContainer}>
                  <Ionicons name="star-outline" size={24} color="#e91e63" />
                </View>
                <View style={styles.ruleContent}>
                  <Text style={styles.ruleTitle}>评价获取</Text>
                  <Text style={styles.ruleDesc}>评价晒图获得10酒币/次</Text>
                </View>
              </View>
              <View style={styles.ruleItem}>
                <View style={styles.ruleIconContainer}>
                  <Ionicons name="share-social-outline" size={24} color="#e91e63" />
                </View>
                <View style={styles.ruleContent}>
                  <Text style={styles.ruleTitle}>分享获取</Text>
                  <Text style={styles.ruleDesc}>分享商品获得5酒币/次</Text>
                </View>
              </View>
              <View style={styles.ruleItem}>
                <View style={styles.ruleIconContainer}>
                  <Ionicons name="calendar-outline" size={24} color="#e91e63" />
                </View>
                <View style={styles.ruleContent}>
                  <Text style={styles.ruleTitle}>签到获取</Text>
                  <Text style={styles.ruleDesc}>每日签到获得2酒币</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={tastingRecords}
          renderItem={renderTastingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.tastingList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="wine-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>暂无品鉴记录</Text>
            </View>
          }
        />
      )}

      {renderBenefitsModal()}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#e91e63',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#e91e63',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  membershipCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelInfo: {
    flexDirection: 'column',
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  benefitsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#ffebee',
  },
  benefitsButtonText: {
    color: '#e91e63',
    fontSize: 12,
    fontWeight: '500',
  },
  pointsSection: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  pointsInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#e91e63',
  },
  progressContainer: {
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  progressStart: {
    fontSize: 12,
    color: '#999',
  },
  progressEnd: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  levelsList: {
    paddingRight: 15,
  },
  levelItem: {
    width: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  levelIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelItemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  levelItemPoints: {
    fontSize: 12,
    color: '#666',
  },
  currentLevelTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  currentLevelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  rulesContainer: {
    marginTop: 5,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ruleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  ruleContent: {
    flex: 1,
  },
  ruleTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  ruleDesc: {
    fontSize: 12,
    color: '#666',
  },
  tastingList: {
    padding: 15,
  },
  tastingItem: {
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  tastingImage: {
    width: '100%',
    height: '100%',
  },
  tastingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tastingContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  tastingName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  tastingDetails: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tastingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  tastingDetailText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 5,
  },
  tastingStatus: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tastingStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 0,
  },
  benefitsHeader: {
    alignItems: 'center',
    padding: 20,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 10,
  },
  benefitsPoints: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  benefitsList: {
    padding: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  benefitText: {
    fontSize: 14,
    marginLeft: 10,
  },
  benefitsNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
}); 