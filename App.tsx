import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import StartupView from './views/Startup';

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();
function App(): JSX.Element {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{
          headerShown: false
        }} component={StartupView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
