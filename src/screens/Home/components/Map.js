import { useHeaderHeight } from "@react-navigation/stack";
import React, { useMemo } from "react";
import {
  Dimensions, Image, StyleSheet, View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import images from "res/images";
import { SEARCH_HANDLE_HEIGHT } from "../../../components/searchHandle";
import data from "../../../data/data";
import MapOverlayView from "./MapOverlayView";

const MAP_WIDTH = 1400;
const MAP_HEIGHT = 2068;

const { height, width } = Dimensions.get("window");
const Map = () => {
  const inset = useSafeAreaInsets();
  const snapPoint = useMemo(
    () => (inset.bottom === 0 ? SEARCH_HANDLE_HEIGHT / 2 : inset.bottom),
    [inset.bottom]
  );
  const headerHeight = useHeaderHeight();
  const factor = Math.min(
    width / MAP_WIDTH,
    (height - 2 * snapPoint - 40 - headerHeight) / MAP_HEIGHT
  );

  return (
    <View>
      <Image
        source={images.map}
        style={{
          width: MAP_WIDTH * factor,
          height: MAP_HEIGHT * factor,
          marginBottom: snapPoint * 2,
          marginRight: 60 * factor,
        }}
      />
      {data.map((item) => {
        return <MapOverlayView key={item.id} item={item} factor={factor} />;
      })}
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({});
