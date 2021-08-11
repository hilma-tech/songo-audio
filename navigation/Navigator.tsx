import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SelectAudio from '../scenes/SelectAudio';
import { provide } from '@hilma/tools';
import { AudioControllerProvider } from '../store/AudioController.store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Player from '../scenes/Player';

const Tab = createBottomTabNavigator();

function Navigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'AudioLIst') {
                            iconName = 'headset-outline';
                        } else if (route.name === 'Player') {
                            iconName = 'musical-notes';
                        }

                        // You can return any component that you like here!
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
                tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'gray',
                }}
            >
                <Tab.Screen name="AudioLIst" component={SelectAudio} />
                <Tab.Screen name="Player" component={Player} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default provide(AudioControllerProvider)(Navigator)