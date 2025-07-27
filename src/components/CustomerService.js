import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomerServiceScreen from '../screens/CustomerServiceScreen';

export default function CustomerService() {
  const [showCustomerService, setShowCustomerService] = useState(false);

  const handleOpenCustomerService = () => {
    setShowCustomerService(true);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleOpenCustomerService}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showCustomerService}
        onRequestClose={() => setShowCustomerService(false)}
      >
        <CustomerServiceScreen onClose={() => setShowCustomerService(false)} />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e91e63',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
}); 