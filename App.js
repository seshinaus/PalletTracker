/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import "react-native-gesture-handler";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import auth from "@react-native-firebase/auth";
import React, { useEffect, useState } from "react";

import PalletContextProvider from "./src/context/PalletContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { ActivityIndicator, View } from "react-native";

const App = () => {

  const [isLoading, setIsLoading] = useState(false)

  const login = async () => {
    setIsLoading(true)
    try {
      await auth().signInAnonymously();
    } catch (error) {
      if (error.code === "auth/operation-not-allowed") {
        console.log("Enable anonymous in your firebase console.");
      }
      console.error(error);
    }
    setIsLoading(false)
  };

  useEffect(() => {
    login();
  }, []);

  return (
    isLoading ? <View style={{flex: 1, justifyContent: "center"}}><ActivityIndicator size="large" color="#0000ff" /></View> : <ActionSheetProvider>
      <PalletContextProvider>
        <RootNavigator />
      </PalletContextProvider>
    </ActionSheetProvider>
  );
};

export default App;
