// Description: App entry: providers and navigation.
// Description: Screens read preferences from SettingsContext and data from the BFF client.

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivitiesStackParamList } from './src/navigation';
import ActivityDetailScreen from './src/screens/ActivityDetailScreen';
import ActivityListScreen from './src/screens/ActivityListScreen';
import { SettingsProvider } from './src/state/SettingsContext';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator<ActivitiesStackParamList>();

export default function App() {
  return (
    <SettingsProvider>
      <NavigationContainer>
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
      </NavigationContainer>
      <StatusBar style="auto" />
    </SettingsProvider>
  );
}
