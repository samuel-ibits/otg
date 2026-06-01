import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import HomeScreen from '../navigation/HomeStack';
import FeedScreen from '../navigation/FeedStack';
import PostScreen from '../screens/post/PostScreen';
import CommunitiesScreen from '../navigation/CommunityStack';
import ChatScreen from '../navigation/ChatStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, any> = {
  Home: require('../assets/icons/home.png'),
  Feed: require('../assets/icons/feed.png'),
  Post: require('../assets/icons/plus.png'),
  Communities: require('../assets/icons/communities.png'),
  Chat: require('../assets/icons/chat.png'),
};

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name as never);
        };
        const label = descriptors[route.key].options.tabBarLabel ?? route.name;
        const isPost = route.name === 'Post';

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            style={styles.item}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, isPost && styles.postWrap, focused && isPost && styles.postWrapActive]}>
              <Image
                source={ICONS[route.name]}
                style={[
                  styles.icon,
                  focused && !isPost ? { tintColor: '#0145FE' } : { tintColor: '#9AA6BD' },
                  isPost && styles.postIcon,
                  focused && isPost && { tintColor: '#fff' },
                ]}
                resizeMode="contain"
              />
            </View>
            <Text
              style={[
                styles.label,
                focused ? { color: isPost ? '#0145FE' : '#0145FE' } : { color: '#9AA6BD' },
              ]}
              numberOfLines={1}
            >
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(p) => <TabBar {...p} />}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Feed" component={FeedScreen} options={{ tabBarLabel: 'Feed' }} />
      <Tab.Screen name="Post" component={PostScreen} options={{ tabBarLabel: 'Post' }} />
      <Tab.Screen name="Communities" component={CommunitiesScreen} options={{ tabBarLabel: 'Communities' }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: 'Chat' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6ECF5',
    backgroundColor: '#fff',
    paddingTop: 6,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
  icon: { width: 22, height: 22 },
  label: { fontSize: 11, marginTop: 4, fontFamily: 'RCB-Regular' },

  // Center “Post” pill
  postWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8EFFF',
  },
  postWrapActive: {
    backgroundColor: '#0145FE',
  },
  postIcon: { width: 18, height: 18 },
});
