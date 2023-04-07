
import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    FlatList
} from 'react-native';
import { NavigationProp, useIsFocused } from '@react-navigation/native';

import FeedSnip, { FeedSnipProp } from './FeedSnip';
import getMyRSSFeeds from '../backend/getFeeds';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FeedObjectStore } from '../views/AddRssFeed';

type Props = {
    navigation: NavigationProp<any>;
};

const MainContent = (props: Props) => {
    const [feeds, setFeeds] = useState<FeedSnipProp[]>([]);
    const [isUpdatingFeeds, setIsUpdatingFeeds] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const [feedsExistStatus, setFeedsExistStatus] = React.useState(false);
    const isFocused = useIsFocused();
    useEffect(() => {
        async function loadInitFeed() {
            getMyRSSFeeds().then((newFeeds) => {
                setRefreshing(true);
                setFeeds(newFeeds);
                setRefreshing(false);
            });
        }
        isFocused && loadInitFeed();
    }, [isFocused]);

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

    const checkFeeds = async () => {
        let feedsRawSrc: string | null = await AsyncStorage.getItem('myFeeds');
        if (feedsRawSrc) {
            const feedsTmp:FeedObjectStore[] = JSON.parse(feedsRawSrc);
            if (feedsTmp.length > 0) {
                setFeedsExistStatus(true);
            }
        }
    };
    checkFeeds();

    return (
        feeds.length > 0 ?
            (
                <View className="bg-gray-700/70 h-full  pb-[60px]" >
                    <View>
                        <FlatList data={feeds} renderItem={
                            ({ item }) => (<FeedSnip feedSourceIconUri={item.feedSourceIconUri} feedSourceName={item.feedSourceName} headline={item.headline} summary={item.summary} timestamp={item.timestamp} unread={item.unread} navigation={props.navigation} />)} refreshing={refreshing} onRefresh={handleRefresh}
                        />
                    </View>
                </View>
            ) : (feedsExistStatus ? (
                <View className="bg-gray-700/70 h-full  pb-[60px]" >
                    <View className="h-full justify-center space-y-4  py-12 px-6 rounded-2xl">
                        <View className="items-center space-y-4 bg-gray-700 py-12 px-6 rounded-2xl">
                            <Text className="text-2xl text-orange-400 font-medium">You are all caught up!</Text>
                            <Text className="text-2xl text-orange-400 font-medium text-center">There are no feeds available today.</Text>
                            <TouchableOpacity className=" px-3 py-1 rounded-md bg-gray-600 border-orange-400 border-[3px]" onPress={() => props.navigation.navigate('AddRssFeed')}>
                                <Text className="text-lg font-semibold text-orange-400">Add an RSS Feed</Text>
                            </TouchableOpacity>
                        </View >
                    </View >
                </View >
            ) : (
                <View className="bg-gray-700/70 h-full  pb-[60px]" >
                    <View className="h-full justify-center space-y-4  py-12 px-6 rounded-2xl">
                        <View className="items-center space-y-4 bg-gray-700 py-12 px-6 rounded-2xl">
                            <Text className="text-2xl text-orange-400 font-medium">Welcome to Automan RSS</Text>
                            <TouchableOpacity className=" px-3 py-1 rounded-md bg-gray-600 border-orange-400 border-[3px]" onPress={() => props.navigation.navigate('AddRssFeed')}>
                                <Text className="text-lg font-semibold text-orange-400">Add an RSS Feed</Text>
                            </TouchableOpacity>
                        </View >
                    </View >
                </View >
            )
            )
    )
}

export default MainContent;
