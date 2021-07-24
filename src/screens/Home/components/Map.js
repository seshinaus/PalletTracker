import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import images from "res/images";
import data from "../../../data/data";
import MapOverlayView from "./MapOverlayView";

const MAP_WIDTH = 1400;
const MAP_HEIGHT = 2068;

const { height, width } = Dimensions.get("window");

const Map = () => {
  const factor = width / MAP_WIDTH;

  return (
    <View>
      <Image
        source={images.map}
        style={{
          width: width,
          height: (width * MAP_HEIGHT) / MAP_WIDTH,
          marginBottom: 41 * factor,
          marginRight: 60 * factor,
        }}
      />
      {data.map((item) => {
        return <MapOverlayView key={item.id} item={item} factor={factor} />;
      })}
    </View>
  );
};

const AREA_LIST = [
  {
    id: 1,
    title: "VASTAANOTTO",
    top: 186,
    left: 211,
    width: 541,
    height: 405,
    image: {
      uri: images.vastaanotto,
      size: {
        width: 548,
        height: 405,
      },
    },
  },
  {
    id: 2,
    title: "Silkki",
    top: 186,
    left: 750,
    width: 567,
    height: 405,
    image: {
      uri: images.silkki,
      size: {
        width: 581,
        height: 405,
      },
    },
  },
];

export default Map;

const styles = StyleSheet.create({});
