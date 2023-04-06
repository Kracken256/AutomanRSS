
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    TextInput,
    Alert
} from 'react-native';
import React, { useState } from 'react';
import { RouteProp, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
    RssFeedView: undefined;
};

type RssFeedViewRouteProp = RouteProp<RootStackParamList, 'RssFeedView'>;

type RssFeedViewNavigationProp = NavigationProp<RootStackParamList, 'RssFeedView'>;

type Props = {
    route: RssFeedViewRouteProp;
    navigation: RssFeedViewNavigationProp;
};

export type FeedObjectStore = {
    remoteUrl: string;
    headers?: { [key: string]: string };
}

const AddRssFeedView = ({ navigation, route }: Props) => {
    const [rssFeedText, setrssFeedText] = useState('');
    const [httpHeadersText, sethttpHeadersText] = useState('');
    async function addFeed() {
        const urlRegex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
        const headersRegex = new RegExp('([\\w]*\\:\\s*[^;.]*\\w*\\;?)+');
        if (!urlRegex.test(rssFeedText)) {
            Alert.alert("Invalid URL", "This URL is not valid.");
            return;
        }
        if (httpHeadersText.length > 0 && !headersRegex.test(httpHeadersText)) {
            Alert.alert("Invalid HTTP headers", "These headers do not seem to be valid.");
            return;
        }
        let feeds: string | null = await AsyncStorage.getItem("myFeeds");

        let newFeedsJson: FeedObjectStore[] = [];
        if (feeds == null) {
            newFeedsJson = [];
        } else {
            let parsed: FeedObjectStore[] | undefined = JSON.parse(feeds);
            if (parsed) {
                newFeedsJson = parsed;
            }
        }
        if (newFeedsJson.filter(e => e.remoteUrl === rssFeedText).length > 0) {
            Alert.alert("Woops", 'You are already subscribed to that feed');
            return;
        }
        if (httpHeadersText && httpHeadersText.length > 0) {
            let headersParts: string[] = httpHeadersText.split(';')
            let headers = new Map<string, string>();
            headersParts.forEach(e => {
                if (e.trim().length !== 0) {
                    let keyValuePair: string[] = e.split(":")
                    let testValid = new Headers();
                    try {
                        testValid.set(keyValuePair[0].trim(), keyValuePair[1].trim());
                        headers.set(keyValuePair[0].trim(), keyValuePair[1].trim())
                    } catch {
                        Alert.alert("Whoops", "The `" + keyValuePair[0].trim() + "` HTTP header is invalid.");
                        return;
                    }
                }
            })
            let newFeed: FeedObjectStore = {
                remoteUrl: rssFeedText,
                headers: Object.fromEntries(headers)
            }
            newFeedsJson.push(newFeed);
        } else {
            newFeedsJson.push({ remoteUrl: rssFeedText });
        }
        await AsyncStorage.setItem('myFeeds', JSON.stringify(newFeedsJson));
        //throw new Error("Unable to parse JSON.");


        navigation.navigate('Home');
    }
    return (
        <View>
            <StatusBar backgroundColor={'#111827'} />
            <View className="bg-gray-900 h-screen w-screen flex flex-col">
                <View className="h-[60px] bg-gray-800  flex flex-row p-3 space-x-3 items-center">
                    <Image source={require("../assets/logo.png")} className="h-[30px] w-[30px]" />
                    <Text className="text-orange-400 text-2xl font-semibold text-left tracking-wider grow">Automan RSS</Text>

                    <View className="flex flex-row space-x-3">
                        <TouchableOpacity className=" px-3 py-1 rounded-md bg-gray-700" onPress={() => navigation.navigate('Home')}>
                            <Text className="text-lg font-semibold text-orange-400">Feeds</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className=" px-3 py-1 rounded-md bg-gray-700" onPress={() => navigation.navigate('Menu')}>
                            <Text className="text-lg font-semibold text-orange-400">Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="h-full bg-gray-700 flex flex-col items-center p-4 space-y-4">
                    <Text className="text-gray-200 text-lg w-full font-medium">Add an RSS Feed</Text>
                    <Text className="text-gray-400 text-md w-full font-medium">Example: https://myfeedsite.com/feeds/rss.xml</Text>
                    <TextInput placeholder='RSS feed URL' className="w-full bg-gray-600 p-2 font-medium text-lg text-gray-200 rounded-md px-4" placeholderTextColor={'gray'} onChangeText={newText => setrssFeedText(newText)} />


                    <View className="bg-gray-800 p-3 w-full rounded-md space-y-4">
                        <Text className="text-gray-400 text-lg w-full font-medium">Advanced Settings</Text>
                        <Text className="text-gray-400 text-md w-full font-mono">Example: header1: value1; header2: value2</Text>
                        <TextInput placeholder='HTTP headers' className="w-full bg-gray-600 p-2 font-medium text-lg text-gray-200 rounded-md px-4" placeholderTextColor={'gray'} onChangeText={newText => sethttpHeadersText(newText)} />

                        <Text className="text-gray-400 text-md w-full font-mono">Please note these headers are not encrypted on this device.</Text>
                    </View>
                    <TouchableOpacity className=" p-4 rounded-xl bg-gray-600 absolute right-[20px] bottom-[100px]" onPress={() => addFeed()}>
                        <Text className="text-2xl font-semibold text-orange-400">Add Feed</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

export default AddRssFeedView;
