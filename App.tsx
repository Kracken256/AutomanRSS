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
import HomeView from './views/Home';
import AddRssFeedView from './views/AddRssFeed';
import ViewFeedView from './views/ViewFeed';
import MenuView from './views/MenuView';
import EditFeedView from './views/EditFeed';


const Stack = createNativeStackNavigator();
function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="StartupView" options={{
          headerShown: false
        }} component={StartupView} />


        <Stack.Screen name="Home" options={{
          headerShown: false
        }} component={HomeView} />

        <Stack.Screen name="Menu" options={{
          headerShown: false
        }} component={MenuView} />

        <Stack.Screen name="AddRssFeed" options={{
          headerShown: false
        }} component={AddRssFeedView} />

        <Stack.Screen name="EditFeed" options={{
          headerShown: false
        }} component={EditFeedView} />

        <Stack.Screen name="ViewFeed" options={{
          headerShown: false
        }} component={ViewFeedView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
