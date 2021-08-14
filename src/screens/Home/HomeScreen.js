import {
  connectActionSheet,
  useActionSheet
} from "@expo/react-native-action-sheet";

import React, {
  useContext,
  useState,
  useLayoutEffect
} from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { PalletContext } from "../../context/PalletContext";

import AddManualCodeDialog from "./components/AddManualCodeDialog";
import HomeBottomSheet from "./components/HomeBottomSheet";
import Map from "./components/Map";


const HomeScreen = ({ navigation }) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const [showManual, setShowManual] = useState(false);

  const {
    currentCode,
    count,
    countToAssign,
  } = useContext(PalletContext);

  const addAction = () => {
    showActionSheetWithOptions(
      {
        options: ["Scan", "Set manually", "Cancel"],
        cancelIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          navigation.navigate("Scan", { searchMode: false });
        } else if (buttonIndex === 1) {
          setShowManual(true);
        }
      }
    );
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 20 }} onPress={addAction}>
          <MaterialCommunityIcons name="plus" color="black" size={30} />
        </TouchableOpacity>
      ),
      headerTitle: ""
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      {currentCode !== null && (
        <Text
          style={styles.currentCode}
        >
          Current Code: {currentCode}
          {count > 0 ? `\nCount: ${count}` : ""}
          {countToAssign > 0 ? `\nRemain: ${countToAssign}` : ""}
        </Text>
      )}
      <View
        style={styles.mapWrapper}
      >
        <Map />
      </View>

      <AddManualCodeDialog showManual={showManual} setShowManual={setShowManual}/>

      <HomeBottomSheet />
    </SafeAreaView>
  );
};

export default connectActionSheet(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  currentCode: {
    color: "white",
    padding: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  mapWrapper: {
    flex: 1,
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#003158",
    zIndex: -1,
  }
});
