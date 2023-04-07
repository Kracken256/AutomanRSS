
import React from 'react';
import {
    Image,
    StatusBar,
    Text,
    View,
    ActivityIndicator,
} from 'react-native';
import { RouteProp, NavigationProp } from '@react-navigation/native';

type Props = {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
};

const StartupView = ({ navigation, route }: Props) => {
    setTimeout(() => navigation.navigate("Home"), 500);
    return (
        <View>
            <StatusBar backgroundColor={'#111827'} />
            <View className="bg-gray-900 h-screen flex flex-col justify-center items-center">
                <View className="p-8 bg-gray-600/60 rounded-3xl">
                    <Image resizeMode='stretch' className="w-[200px] h-[200px] " source={require('../assets/logo.png')} />
                    <Text className="text-orange-400 text-2xl font-semibold text-center pt-4 tracking-wider">Automan RSS</Text>
                </View>
                <View>
                    <ActivityIndicator size={'large'} className="mt-8 bg-gray-600/60 p-3 rounded-full" color={'#FB923C'} />
                </View>
            </View>
        </View>
    );
}

export default StartupView;
