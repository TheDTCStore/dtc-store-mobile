import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';

export default function CustomModal({
  visible = false,
  onClose,
  title = '',
  message = '',
  buttons = [],
  type = 'default', // 'default', 'success', 'warning', 'error'
}) {
  const getIconByType = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getColorByType = () => {
    switch (type) {
      case 'success':
        return '#4caf50';
      case 'warning':
        return '#ff9800';
      case 'error':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => {}}>
          <View style={styles.modal}>
            {/* 图标 */}
            <View style={[styles.iconContainer, { backgroundColor: getColorByType() + '20' }]}>
              <Text style={styles.icon}>{getIconByType()}</Text>
            </View>

            {/* 标题 */}
            {title ? (
              <Text style={styles.title}>{title}</Text>
            ) : null}

            {/* 内容 */}
            {message ? (
              <Text style={styles.message}>{message}</Text>
            ) : null}

            {/* 按钮组 */}
            <View style={styles.buttonContainer}>
              {buttons.length > 0 ? (
                buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      button.style === 'primary' ? styles.primaryButton : styles.secondaryButton,
                      buttons.length === 1 ? styles.singleButton : null,
                      index === 0 && buttons.length > 1 ? styles.firstButton : null,
                      index === buttons.length - 1 && buttons.length > 1 ? styles.lastButton : null,
                    ]}
                    onPress={() => {
                      button.onPress && button.onPress();
                      onClose && onClose();
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.buttonText,
                      button.style === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText
                    ]}>
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton, styles.singleButton]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.buttonText, styles.primaryButtonText]}>确定</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxWidth: 320,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleButton: {
    borderRadius: 8,
  },
  firstButton: {
    marginRight: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  lastButton: {
    marginLeft: 8,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  primaryButton: {
    backgroundColor: '#ff6600',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#666',
  },
}); 