
import React, { PureComponent } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Alert
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export type FeedSnipProp = {
    feedSourceName: string,
    feedSourceIconUri: string,
    timestamp: number,
    unread: boolean,
    headline: string,
    summary: string,
};
interface FeedSnipProps extends FeedSnipProp {
    navigation: NavigationProp<any>;
}

class FeedSnip extends PureComponent<FeedSnipProps> {
    handlePress = () => {
        let newProps: FeedSnipProp = {

            feedSourceName: this.props.feedSourceName,
            feedSourceIconUri: this.props.feedSourceIconUri,
            timestamp: this.props.timestamp,
            unread: this.props.unread,
            headline: this.props.headline,
            summary: this.props.summary,
        }
        this.props.navigation.navigate('ViewFeed', { feedItem: newProps });
    };
    render() {
        let headlineText = this.props.headline;
        const headlineTextMaxLength: number = 100;
        if (headlineText.length > headlineTextMaxLength) {

            let tmpString = headlineText.substring(0, headlineTextMaxLength).trim();
            if (tmpString.endsWith('.')) {
                tmpString = tmpString.substring(0, tmpString.length - 1);
            }
            headlineText = tmpString + "...";
        }

        let summaryText = this.props.summary;
        const summaryTextMaxLength: number = 150;
        if (summaryText.length > summaryTextMaxLength) {
            let tmpString = summaryText.substring(0, summaryTextMaxLength).trim();
            if (tmpString.endsWith('.')) {
                tmpString = tmpString.substring(0, tmpString.length - 1);
            }
            summaryText = tmpString + "...";
        }
        const timestamp = this.props.timestamp;
        const date = new Date(timestamp);

        let formattedString: string = '';
        if (timestamp === -1) {
            formattedString = '?';
        } else if (timestamp < Date.now() - 3.154e+10) {
            formattedString = date.toLocaleDateString('en-US', { 'year': 'numeric' });
        } else if (timestamp < Date.now() - 8.64e+7) {
            formattedString = date.toLocaleDateString('en-US', { 'weekday': 'short' }).split(',')[0];
        } else {
            formattedString = date.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
        }


        return (
            <TouchableOpacity className="w-full px-3 pt-3 flex flex-col" onPress={this.handlePress}>
                <View className="flex flex-row space-x-2 items-center">
                    <Image source={require('../assets/logo.png')} className="w-4 h-4"></Image>
                    <Text className="text-gray-300 font-medium grow">{this.props.feedSourceName}</Text>
                    {
                        this.props.unread ? <Text className="text-green-500 font-bold mr-2">TODAY</Text> : <Text className="text-gray-400 font-bold mr-2">OLD</Text>
                    }
                </View>
                <Text className="text-lg text-left text-gray-200 font-bold leading-6 py-1">{headlineText}</Text>

                <Text className="text-[16px] text-left text-gray-200 font-normal ">
                    {summaryText}
                </Text>

                <Text className="text-gray-400 ml-auto">{formattedString}</Text>
                <View className="w-full h-[2px] bg-gray-600 mt-2"></View>
            </TouchableOpacity>
        );
    }
}

export default FeedSnip;