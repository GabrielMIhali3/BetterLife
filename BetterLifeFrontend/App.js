import React, { useEffect, useCallback, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { MonsieurLaDoulaise_400Regular} from "@expo-google-fonts/monsieur-la-doulaise";
import {AbhayaLibre_500Medium,AbhayaLibre_800ExtraBold} from "@expo-google-fonts/abhaya-libre";

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ActionScreen from './screens/ActionScreen';
import HistoryScreen from './screens/HistoryScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import { AppUserContext } from './contexts/AppUserContext';
import { AppScanHistoryContext } from './contexts/AppScanHistoryContext';
import HealthPreferencesScreen from './screens/HealthPreferencesScreen';
import DashboardScreen from './screens/DashboardScreen';
import ScanScreen from './screens/ScanScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [appUser, setAppUser] = useState(null);
  const [appScanHistory, setAppScanHistory] = useState(null);

  let [fontsLoaded] = useFonts({
    Poppins: Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-Bold": Poppins_700Bold,
    "MonsieurLaDoulaise": MonsieurLaDoulaise_400Regular,
    "AbhayaLibre-Medium": AbhayaLibre_500Medium,
    "AbhayaLibre-Bold": AbhayaLibre_800ExtraBold,
  });


  useEffect(() => {
    async function hideSplash() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    }
    hideSplash();
  }, [fontsLoaded]);

  if (!fontsLoaded || !appIsReady) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00C04B" />
      </View>
    );
  }

  return (
    <AppUserContext.Provider value={{ appUser, setAppUser}}>
      <AppScanHistoryContext.Provider value={{ appScanHistory, setAppScanHistory}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Action" component={ActionScreen}/>
          <Stack.Screen name="History" component={HistoryScreen}/>
          <Stack.Screen name="Chatbot" component={ChatbotScreen}/>
          <Stack.Screen name="Health" component={HealthPreferencesScreen}/>
          <Stack.Screen name="Dashboard" component={DashboardScreen}/>
          <Stack.Screen name="Scan" component={ScanScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
      </AppScanHistoryContext.Provider>
    </AppUserContext.Provider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});