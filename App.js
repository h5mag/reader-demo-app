import Icon from 'react-native-vector-icons/Ionicons'; Icon.loadFont();
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import H5mag from '@h5mag/react-native-h5mag';
import Editions from './src/screens/Editions';
import Online from './src/screens/Online';
import Offline from './src/screens/Offline';
import Downloads from './src/screens/Downloads';
import Saved from './src/screens/Favorites';
import Home from './src/screens/Home';
import styles from './src/css/style';
import sv from './src/css/variables';
import { API_KEY } from './localConfig';

// TODO: Fix these errors.
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
	"[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
	'RCTBridge required dispatch_sync to load RNGestureHandlerModule. This may lead to deadlocks',
]);

// Set up your API key in localConfig.js
H5mag.setApiKey(API_KEY);

export default function App() {
	const Tab = createBottomTabNavigator();
	const HomeStack = createNativeStackNavigator();
	const DownloadsStack = createNativeStackNavigator();
	const SavedStack = createNativeStackNavigator();

	const headerOptions = {
		headerStyle: {
			backgroundColor: sv.primaryColor,
		},
		headerTintColor: sv.white,
		headerTitleStyle: {
			fontWeight: 'bold',
		},
	};

	const HomeStackScreens = () => {
		return (
			<HomeStack.Navigator screenOptions={{ ...headerOptions }}>
				<HomeStack.Screen
					name="Home"
					component={Home}
					options={{
						title: '',
					}}
				/>
				<HomeStack.Screen
					name="Editions"
					component={Editions}
				/>
				<HomeStack.Screen
					name="Offline"
					component={Offline}
					options={{}}
				/>
				<HomeStack.Screen
					name="Online"
					component={Online}
				/>
			</HomeStack.Navigator>
		);
	};

	const DownloadsStackScreen = () => {
		return (
			<DownloadsStack.Navigator screenOptions={{ ...headerOptions }}>
				<DownloadsStack.Screen
					name="Downloads"
					component={Downloads}
				/>
				<DownloadsStack.Screen
					name="Offline"
					component={Offline}
					options={{}}
				/>
				<DownloadsStack.Screen
					name="Online"
					component={Online}
				/>
				<DownloadsStack.Screen
					name="Editions"
					component={Editions}
				/>
			</DownloadsStack.Navigator>
		);
	};

	const SavedStackScreens = () => {
		return (
			<SavedStack.Navigator screenOptions={{ ...headerOptions }}>
				<SavedStack.Screen
					name="Favorites"
					component={Saved}
				/>
				<SavedStack.Screen
					name="Offline"
					component={Offline}
				/>
				<SavedStack.Screen
					name="Online"
					component={Online}
				/>
			</SavedStack.Navigator>
		);
	};

	function getTabBarVisible(route) {
		let routeName = getFocusedRouteNameFromRoute(route);
		if (routeName === 'Online' || routeName === 'Offline') {
			return false;
		}
		return true;
	}

	const MyTabs = () => {
		return (
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;

						if (route.name === 'HomeTab') {
							iconName = focused
								? 'home'
								: 'home-outline';
						} else if (route.name === 'SavedTab') {
							iconName = focused ? 'heart' : 'heart-outline';
						} else if (route.name === 'DownloadsTab') {
							iconName = focused ? 'arrow-down-circle' : 'arrow-down-circle-outline';
						}

						return <Icon name={iconName} size={size} color={color} />;
					},
					tabBarActiveTintColor: sv.primaryColor,
					tabBarInactiveTintColor: sv.gray,
					headerShown: false,
				})}
			>
				<Tab.Screen name="HomeTab" component={HomeStackScreens} options={({ route }) => ({
					title: 'Home',
					tabBarStyle: { display: !getTabBarVisible(route) ? 'none' : 'flex' },
				})} />
				<Tab.Screen name="DownloadsTab" component={DownloadsStackScreen} options={({ route }) => ({
					title: 'Downloads',
					tabBarStyle: { display: !getTabBarVisible(route) ? 'none' : 'flex' },
				})} />
				<Tab.Screen name="SavedTab" component={SavedStackScreens} options={({ route }) => ({
					title: 'Favorites',
					tabBarStyle: { display: !getTabBarVisible(route) ? 'none' : 'flex' },
				})} />
			</Tab.Navigator>
		);
	};

	return (
		<GestureHandlerRootView style={styles.flex1}>
			<NavigationContainer>
				{MyTabs()}
			</NavigationContainer>
		</GestureHandlerRootView>
	);
}



