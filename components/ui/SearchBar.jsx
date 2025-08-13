import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function SearchBar({ 
  placeholder = "搜索...", 
  onSearch, 
  onFocus, 
  onBlur,
  style 
}) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText);
    }
  };

  const handleSubmit = () => {
    handleSearch();
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
        returnKeyType="search"
      />
      {searchText.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={() => setSearchText('')}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearText: {
    fontSize: 14,
    color: '#999',
  },
}); 