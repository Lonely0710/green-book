import { Image, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Index_all from './index_all';
import Index_follow from './index_follow';

const Tab = createMaterialTopTabNavigator();

export default function HomeScreen() {
  return (
    <SafeAreaView className='flex-1 bg-myBackGround'>
      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: '#60D174', 
          }
        }}
      >
        <Tab.Screen name="发现" component={Index_all} />
        <Tab.Screen name="关注" component={Index_follow} />
      </Tab.Navigator>
    </SafeAreaView>
  )
}


