import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { PalletContext } from "../../../context/PalletContext";

const MapOverlayView = ({ item, factor }) => {
  const { id, title, top, left, width, height } = item;
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate("Detail", { item: item });
  };

  const { pallets, currentCode } = useContext(PalletContext);

  const hasCode = pallets.some((pallet) => {
    return item.slots.some((slot) => {
      return pallet.slot === slot && currentCode === pallet.code;
    });
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        position: "absolute",
        top: top * factor,
        left: left * factor,
        width: width * factor,
        height: height * factor,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "red",
      }}
    >
      <View>
        <Text
          style={{
            color: hasCode ? "green" : "white",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MapOverlayView;

const styles = StyleSheet.create({});
