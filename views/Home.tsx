
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
import { RouteProp, NavigationProp } from '@react-navigation/native';

import FeedSnip, { FeedSnipProp } from '../components/FeedSnip';
import getMyRSSFeeds from '../backend/getFeeds';


type Props = {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
};

const HomeView = ({ navigation, route }: Props) => {
    const [feeds, setFeeds] = useState<FeedSnipProp[]>([]);
    const [isUpdatingFeeds, setIsUpdatingFeeds] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    useEffect(() => {
        function loadInitFeed() {
            setRefreshing(true);
            getMyRSSFeeds().then((newFeeds) => {
                setFeeds(newFeeds);
                setRefreshing(false);
            });
        }
        loadInitFeed();
    }, []);

    const handleRefresh = useCallback(async () => {
        if (isUpdatingFeeds) {
            return;
        }
        setIsUpdatingFeeds(true);
        setRefreshing(true);
        const newFeeds = await getMyRSSFeeds();
        setFeeds(newFeeds);
        setRefreshing(false);
        setIsUpdatingFeeds(false);
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
                        <TouchableOpacity className=" px-3 py-1 rounded-md bg-gray-700" onPress={() => navigation.navigate('Menu')}>
                            <Text className="text-lg font-semibold text-orange-400">Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="bg-gray-700/70 h-full pb-[100px]" >
                    {
                        feeds.length > 0 ?
                            <View>
                                <FlatList data={feeds} renderItem={
                                    ({ item }) => (<FeedSnip feedSourceIconUri={item.feedSourceIconUri} feedSourceName={item.feedSourceName} headline={item.headline} summary={item.summary} timestamp={item.timestamp} unread={item.unread} navigation={navigation} />)} refreshing={refreshing} onRefresh={handleRefresh}
                                />
                            </View>
                            : (
                                <View className="h-full justify-center space-y-4  py-12 px-6 rounded-2xl">
                                    <View className="items-center space-y-4 bg-gray-700 py-12 px-6 rounded-2xl">
                                        <Text className="text-2xl text-orange-400 font-medium">Welcome to Automan RSS</Text>
                                        <TouchableOpacity className=" px-3 py-1 rounded-md bg-gray-600 border-orange-400 border-[3px]" onPress={() => navigation.navigate('AddRssFeed')}>
                                            <Text className="text-lg font-semibold text-orange-400">Add an RSS Feed</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                    }
                </View>
            </View>
        </SafeAreaView>
    );
}

export default HomeView;
