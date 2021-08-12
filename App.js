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
import React, { useEffect } from "react";

import PalletContextProvider from "./src/context/PalletContext";
import RootNavigator from "./src/navigation/RootNavigator";

const App = () => {
  const login = async () => {
    try {
      await auth().signInAnonymously();
    } catch (error) {
      if (error.code === "auth/operation-not-allowed") {
        console.log("Enable anonymous in your firebase console.");
      }

      console.error(error);
    }
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <ActionSheetProvider>
      <PalletContextProvider>
        <RootNavigator />
      </PalletContextProvider>
    </ActionSheetProvider>
  );
};

export default App;
