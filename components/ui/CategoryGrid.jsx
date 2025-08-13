import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CategoryGrid({ categories = [], onCategoryPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => onCategoryPress?.(category)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.color + '15' }]}>
              <Text style={styles.icon}>{category.icon}</Text>
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
}); 