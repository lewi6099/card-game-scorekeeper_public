import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import HomeScreen from "./src/screens/HomeScreen";
import Onboarding from './src/screens/Onboarding';
import NewGamePart0 from "./src/screens/NewGamePart0";
import NewGamePart1 from "./src/screens/NewGamePart1";
import NewGamePart2 from "./src/screens/NewGamePart2";
import NewGamePart3 from "./src/screens/NewGamePart3";
import ActiveGame from "./src/screens/ActiveGame";
import LoadGameScreen from './src/screens/LoadGameScreen';
import ScoreTable from "./src/screens/ScoreTable";
import { GameProvider } from './src/contexts/GameContext';
import { getOnboardingStatus } from './src/utils/OtherStorage';
import { clearStorageOnVersionChange } from './src/utils/DevVersionControl';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  // Runs on launch
  useEffect(() => {
    const checkIfFirstLaunch = async () => {
      // Clears game storage if the app version has changed
      await clearStorageOnVersionChange();
      // Check if the user has seen the onboarding screen
      const hasSeenOnboarding = await getOnboardingStatus();
      setInitialRoute(hasSeenOnboarding === false ? "Onboarding" : "Home");
    };
    checkIfFirstLaunch();
  }, []);

  // While checking for onboarding status, show a loading indicator
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Once onboarding status is found, set the initial route
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <GameProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
              <Stack.Screen name="Home" component={HomeScreen} options={{ 
                title: "Guesstimate",
                headerLeft: () => false,
                gestureEnabled: false }} />
              <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
              <Stack.Screen name="LoadGameScreen" component={LoadGameScreen} options={{ title: "Load Game" }} />
              <Stack.Screen name="NewGamePart0" component={NewGamePart0} options={{ title: "Details" }} />
              <Stack.Screen name="NewGamePart1" component={NewGamePart1} options={{ title: "Players" }} />
              <Stack.Screen name="NewGamePart2" component={NewGamePart2} options={{ title: "Game Settings" }} />
              <Stack.Screen name="NewGamePart3" component={NewGamePart3} options={{ title: "Rounds" }} />
              <Stack.Screen name="ActiveGame" component={ActiveGame} options={{ 
                title: "Active Game",
                headerLeft: () => false,
                gestureEnabled: false }} />
              <Stack.Screen name="ScoreTable" component={ScoreTable} options={{ title: "Score Table" }} />
            </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </ApplicationProvider>
  );
}

export default App;