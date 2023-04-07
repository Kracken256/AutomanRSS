
import React from 'react';
import {
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import { RouteProp, NavigationProp } from '@react-navigation/native';

import { FeedSnipProp } from '../components/FeedSnip';

type Props = {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
};
const ViewFeedView = (props: Props) => {
    let params = props.route.params;
    let feedItem: FeedSnipProp | undefined;
    if (params && params['feedItem']) {
        feedItem = params['feedItem'];
    } else {
        Alert.alert("Internal Error", '[DEV] Missing feedItem parameter.');
        props.navigation.goBack();
    }
    return (
        <SafeAreaView>
            <StatusBar backgroundColor={'#111827'} />
            <View className="bg-gray-900 h-screen w-screen flex flex-col">
                <View className="h-[60px] bg-gray-800  flex flex-row p-3 space-x-3 items-center">
                    <Image source={require("../assets/logo.png")} className="h-[30px] w-[30px]" />
                    <Text className="text-orange-400 text-2xl font-semibold text-left tracking-wider grow">Automan RSS</Text>

                    <View className="flex flex-row space-x-3">
                        <TouchableOpacity className=" px-3 py-1 rounded-md bg-gray-700" onPress={() => props.navigation.navigate('Home')}>
                            <Text className="text-lg font-semibold text-orange-400">Feeds</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className=" px-3 py-1 rounded-md bg-gray-700" onPress={() => props.navigation.navigate('Menu')}>
                            <Text className="text-lg font-semibold text-orange-400">Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView className="flex p-4 space-y-2 bg-gray-700/70">
                    <View className="flex flex-row space-x-2 items-center">
                        <Image source={require('../assets/logo.png')} className="w-6 h-6"></Image>
                        <Text className="text-gray-300 font-medium grow text-lg">{feedItem?.feedSourceName}</Text>
                        {
                            feedItem?.unread ? <Text className="text-green-500 font-bold mr-2">NEW</Text> : <Text className="text-gray-400 font-bold mr-2">OLD</Text>
                        }
                    </View>
                    <Text className="text-xl text-left text-gray-200 font-bold leading-6 py-1">{feedItem?.headline}</Text>

                    <Text className="text-[17px] text-left text-gray-200 font-normal tracking-wide ">
                        {feedItem?.summary}
                    </Text>

                    <Text className="text-gray-400 ml-auto"></Text>
                    <View className="w-full h-[2px] bg-gray-600 mt-2"></View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default ViewFeedView;
