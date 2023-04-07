
import React, { useState, useEffect, useCallback } from 'react';
import {
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { RouteProp, NavigationProp, useIsFocused } from '@react-navigation/native';

import FeedSnip, { FeedSnipProp } from '../components/FeedSnip';
import getMyRSSFeeds from '../backend/getFeeds';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainContent from '../components/MainContent';


type Props = {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
};

const HomeView = ({ navigation, route }: Props) => {

    return (
        <SafeAreaView>
            <StatusBar backgroundColor={'#111827'} />
            <View className="bg-gray-900 h-screen w-screen flex flex-col">
                <View className="h-[60px] bg-gray-800  flex flex-row p-3 space-x-3 items-center">
                    <Image source={require("../assets/logo.png")} className="h-[30px] w-[30px]" />
                    <Text className="text-orange-400 text-2xl font-semibold text-left tracking-wider grow">Automan RSS</Text>

                    <View className="flex flex-row space-x-3">
                        <TouchableOpacity className=" px-3 py-1 rounded-md bg-gray-700" onPress={() => navigation.navigate('AddRssFeed')}>
                            <Text className="text-lg font-semibold text-orange-400">Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className=" px-3 py-1 rounded-md bg-gray-700" onPress={() => navigation.navigate('Menu')}>
                            <Text className="text-lg font-semibold text-orange-400">Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="bg-gray-700/70 h-full" >
                    <MainContent navigation={navigation}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default HomeView;
