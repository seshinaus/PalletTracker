import React, { memo, useState, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Image,
  TouchableOpacity,
} from "react-native";
import { BottomSheetTextInput, useBottomSheet } from "@gorhom/bottom-sheet";
import { TextInput } from "react-native-gesture-handler";
import isEqual from "lodash.isequal";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const { width: SCREEN_WIDTH } = Dimensions.get("screen");
export const SEARCH_HANDLE_HEIGHT = 69;

const BottomSheetHandleComponent = ({ onChange, onPressScan }) => {
  // state
  const [value, setValue] = useState("");

  // hooks
  const { snapTo } = useBottomSheet();

  // styles
  const indicatorStyle = useMemo(
    () => [
      styles.indicator,
      {
        backgroundColor:
          "" === "light" ? "rgba(0, 0, 0, 0.25)" : "rgba(255, 255, 255, 0.25)",
      },
    ],
    []
  );

  // callbacks
  const handleInputChange = useCallback(
    ({
      nativeEvent: { text },
    }: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setValue(text);
      onChange(text);
    },
    []
  );
  const handleInputFocus = useCallback(() => {
    snapTo(2);
  }, [snapTo]);

  // render
  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 4,
          marginBottom: 8,
          alignSelf: "center",
          width: (7.5 * SCREEN_WIDTH) / 100,
          height: 4,
          borderRadius: 4,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        }}
      />
      <View style={indicatorStyle} />
      <BottomSheetTextInput
        style={styles.input}
        value={value}
        defaultValue={null}
        textContentType="none"
        placeholder="Search Pallets"
        placeholderTextColor="gray"
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 30,
          bottom: 0,
          top: 14,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={onPressScan}
      >
        <MaterialCommunityIcons name="barcode-scan" color="black" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const BottomSheetHandle = memo(BottomSheetHandleComponent, isEqual);

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
  },
  indicator: {
    alignSelf: "center",
    width: (8 * SCREEN_WIDTH) / 100,
    height: 5,
    borderRadius: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
    height: 44,
    alignItems: "center",
  },
});

export default BottomSheetHandle;
