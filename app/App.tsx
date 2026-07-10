// Description: App entry: providers, navigation, and the web phone frame.
// Description: The frame is a no-op on native; the browser renders a fixed phone viewport.

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import PhoneFrame from './src/components/PhoneFrame';
import { ActivitiesStackParamList, RootTabParamList } from './src/navigation';
import AboutScreen from './src/screens/AboutScreen';
import ActivityDetailScreen from './src/screens/ActivityDetailScreen';
import ActivityListScreen from './src/screens/ActivityListScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WeeklySummaryScreen from './src/screens/WeeklySummaryScreen';
import { SettingsProvider } from './src/state/SettingsContext';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator<ActivitiesStackParamList>();
const Tabs = createBottomTabNavigator<RootTabParamList>();

function ActivitiesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="ActivityList"
        component={ActivityListScreen}
        options={{ title: 'Activities' }}
      />
      <Stack.Screen
        name="ActivityDetail"
        component={ActivityDetailScreen}
        options={{ title: 'Activity' }}
      />
    </Stack.Navigator>
  );
}

const TAB_ICONS: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  ActivitiesTab: 'list',
  SummaryTab: 'stats-chart',
  SettingsTab: 'settings-outline',
  AboutTab: 'information-circle-outline',
};

export default function App() {
  return (
    <SettingsProvider>
      <PhoneFrame>
        <NavigationContainer>
          <Tabs.Navigator
            screenOptions={({ route }) => ({
              headerStyle: { backgroundColor: colors.card },
              headerTintColor: colors.text,
              tabBarActiveTintColor: colors.accent,
              tabBarInactiveTintColor: colors.textMuted,
              tabBarStyle: { backgroundColor: colors.card },
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
              ),
            })}
          >
            <Tabs.Screen
              name="ActivitiesTab"
              component={ActivitiesStack}
              options={{ title: 'Activities', headerShown: false }}
            />
            <Tabs.Screen
              name="SummaryTab"
              component={WeeklySummaryScreen}
              options={{ title: 'Summary' }}
            />
            <Tabs.Screen
              name="SettingsTab"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
            <Tabs.Screen
              name="AboutTab"
              component={AboutScreen}
              options={{ title: 'About' }}
            />
          </Tabs.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </PhoneFrame>
    </SettingsProvider>
  );
}
