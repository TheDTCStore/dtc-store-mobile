import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TabBar from './src/components/TabBar';
import HomeScreen from './src/screens/HomeScreen';
import ShopScreen from './src/screens/ShopScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CustomerService from './src/components/CustomerService';
import { CartProvider } from './src/context/CartContext';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('Home');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'Shop':
        return <ShopScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <CartProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
          <StatusBar style="auto" />
          <View style={styles.content}>
            {renderScreen()}
          </View>
          <CustomerService />
          <TabBar navigation={setActiveScreen} />
        </SafeAreaView>
      </SafeAreaProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});
