
import React, { useState, useEffect } from 'react';
import {
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { RouteProp, NavigationProp } from '@react-navigation/native';
import "tailwindcss-react-native/types.d";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { FeedObjectStore } from './AddRssFeed';

type Props = {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
};

const MenuView = ({ navigation, route }: Props) => {
    const [feeds, setFeeds] = useState<FeedObjectStore[]>([]);
    const [isUpdatingFeeds, setIsUpdatingFeeds] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    useEffect(() => {
        async function getFeedList() {
            let feedsRawData: string | null = await AsyncStorage.getItem('myFeeds');
            if (feedsRawData == null) {
                setFeeds([]);
                return;
            }
            let feedsDecoded: FeedObjectStore[] = JSON.parse(feedsRawData);
            if (feedsDecoded == undefined) {
                setFeeds([]);
                return;
            }
            setFeeds(feedsDecoded);
            console.log("Feeds loaded from storage.");
        }
        getFeedList();
    }, []);
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
                        <TouchableOpacity className=" px-3 py-1 rounded-md bg-gray-700" onPress={() => navigation.navigate('Home')}>
                            <Text className="text-lg font-semibold text-orange-400">Feeds</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="bg-gray-700/70 h-full pb-[100px] p-3" >
                    <Text className="text-gray-200 text-xl font-medium">Your RSS feeds:</Text>
                    <Text className="text-gray-200 text-md my-3">Select url edit</Text>
                    <FlatList horizontal={false} data={feeds} renderItem={
                        ({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate('EditFeed', { feedItem: item })}>
                                <Text className="text-gray-300 text-lg px-3 py-3 bg-gray-900/60 my-2 rounded-xl">{item.remoteUrl}</Text>
                            </TouchableOpacity>

                        )} />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default MenuView;
