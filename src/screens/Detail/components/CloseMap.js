import { Path, Shape, Surface } from "@react-native-community/art";
import { useNavigation } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/stack";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import Dialog from "react-native-dialog";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import images from "res/images";
import { PalletContext } from "../../../context/PalletContext";
import data from "../../../data/data";
import shapes from "../../../data/shapes";
const MAP_WIDTH = 1400;
const MAP_HEIGHT = 2068;
const { height, width } = Dimensions.get("window");
const LINE_WIDTH = 3;

const CloseMap = ({ selectedItem, setSelectedItem }) => {
  const [slotToAdd, setSlotToAdd] = useState(null);
  const navigation = useNavigation();

  const {
    width: tileWidth,
    height: tileHeight,
    top: tileTop,
    left: tileLeft,
    slots,
  } = selectedItem;

  const inset = useSafeAreaInsets();

  const snapPoint = useMemo(
    () => (inset.bottom === 0 ? 100 : inset.bottom + 100),
    [inset.bottom]
  );
  const headerHeight = useHeaderHeight();
  const factor = Math.min(
    (width - 80) / tileWidth,
    (height - 2 * snapPoint - 40 - headerHeight - 80) / tileHeight
  );

  useEffect(() => {
    navigation.setOptions({
      title: selectedItem.title,
    });
  }, [selectedItem]);

  const { pallets, currentCode, addPallet, existPallet, countToAssign } =
    useContext(PalletContext);

  const [showManual, setShowManual] = useState(false);
  const [manualCount, setManualCount] = useState(1);
  const handleSubmit = () => {
    setShowManual(false);
    console.log(countToAssign, manualCount);
    if (countToAssign - manualCount >= 0) {
      addPallet(slotToAdd, manualCount);
      setManualCount(1);
      setSlotToAdd(null);
    } else {
      Alert.prompt("Invalid Count!");
    }
  };

  const handleCancel = () => {
    setShowManual(false);
  };

  const onChangeCount = (count) => {
    setManualCount(Number(count));
  };

  const hasCode = (slot) => {
    return pallets.some((pallet) => {
      return pallet.slot === slot.id && currentCode === pallet.code;
    });
  };

  const countAssigned = (slot) => {
    const reducer = (accumulator, currentValue) =>
      accumulator + currentValue.count;
    return pallets
      .filter((pallet) => {
        return pallet.slot === slot.id && currentCode === pallet.code;
      })
      .reduce(reducer, 0);
  };

  const slotsToShow = shapes.filter((shape) => {
    return slots.includes(shape.id);
  });

  const moveLeft = () => {
    console.log("moveleft");
    if (selectedItem.leftTile !== undefined) {
      setSelectedItem(data[selectedItem.leftTile]);
    }
  };
  const moveRight = () => {
    if (selectedItem.rightTile !== undefined) {
      setSelectedItem(data[selectedItem.rightTile]);
    }
  };
  const moveUp = () => {
    if (selectedItem.upTile !== undefined) {
      console.log("up", selectedItem.upTile);
      setSelectedItem(data[selectedItem.upTile]);
    }
  };
  const moveDown = () => {
    if (selectedItem.downTile !== undefined) {
      setSelectedItem(data[selectedItem.downTile]);
    }
  };

  const draw = ({ startPoint, points, topLeft }) => {
    let path = new Path();
    path = path.moveTo(
      (startPoint.x - topLeft.x) * factor + LINE_WIDTH,
      (startPoint.y - topLeft.y) * factor + LINE_WIDTH
    );
    points.forEach((point) => {
      path = path.lineTo(
        (point.x - topLeft.x) * factor + LINE_WIDTH,
        (point.y - topLeft.y) * factor + LINE_WIDTH
      );
    });
    path = path.lineTo(
      (startPoint.x - topLeft.x) * factor + LINE_WIDTH,
      (startPoint.y - topLeft.y) * factor + LINE_WIDTH
    );
    return path;
  };

  const onPressSlot = (slot) => {
    console.log("add", countToAssign, slot);
    // if (existPallet(currentCode) === false) {
    //   console.log("add to ", slot.id);
    //   addPallet(slot.id);
    //   console.log(pallets);
    // }
    if (countToAssign > 0) {
      setSlotToAdd(slot.id);
      setShowManual(true);
    }
  };

  return (
    <View
      style={{
        width: tileWidth * factor + 80,
        height: tileHeight * factor + 80,
        marginBottom: snapPoint,
      }}
    >
      <View
        style={{
          width: tileWidth * factor,
          height: factor * tileHeight,
          overflow: "hidden",
          top: 40,
          left: 40,
          position: "absolute",
        }}
      >
        <Image
          source={images.map}
          style={{
            top: -tileTop * factor,
            left: -tileLeft * factor,
            width: MAP_WIDTH * factor,
            height: MAP_HEIGHT * factor,
            position: "absolute",
          }}
        />
      </View>
      {slotsToShow.map((slot) => {
        const { topLeft, bottomRight, id } = slot;
        return (
          <TouchableOpacity
            key={id}
            style={{
              position: "absolute",
              top: (topLeft.y - tileTop) * factor - LINE_WIDTH + 40,
              left: (topLeft.x - tileLeft) * factor - LINE_WIDTH + 40,
              width: (bottomRight.x - topLeft.x) * factor + 2 * LINE_WIDTH,
              height: (bottomRight.y - topLeft.y) * factor + 2 * LINE_WIDTH,
            }}
            onPress={() => {
              onPressSlot(slot);
            }}
          >
            <Surface
              width={(bottomRight.x - topLeft.x) * factor + 2 * LINE_WIDTH}
              height={(bottomRight.y - topLeft.y) * factor + 2 * LINE_WIDTH}
            >
              <Shape
                d={draw(slot)}
                stroke={hasCode(slot) ? "green" : "yellow"}
                strokeWidth={3}
              />
            </Surface>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                top: 0,
                left: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {hasCode(slot) ? (
                <Text style={{ fontSize: 32 * factor, color: "white" }}>
                  {countAssigned(slot)}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
        );
      })}

      {selectedItem.leftTile === undefined ? null : (
        <TouchableOpacity
          style={{
            position: "absolute",
            left: 0,
            width: 40,
            height: 40,
            top: (factor * tileHeight) / 2 - 15 + 40,
            // zIndex: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={moveLeft}
        >
          <MaterialCommunityIcons name="chevron-left" color="white" size={30} />
        </TouchableOpacity>
      )}
      {selectedItem.upTile === undefined ? null : (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            width: 40,
            height: 40,
            left: (tileWidth * factor) / 2 - 15 + 40,
            // zIndex: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={moveUp}
        >
          <MaterialCommunityIcons name="chevron-up" color="white" size={30} />
        </TouchableOpacity>
      )}
      {selectedItem.rightTile === undefined ? null : (
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 0,
            width: 40,
            height: 40,
            top: (factor * tileHeight) / 2 - 15 + 40,
            // zIndex: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={moveRight}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            color="white"
            size={30}
          />
        </TouchableOpacity>
      )}
      {selectedItem.downTile === undefined ? null : (
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 0,
            width: 40,
            height: 40,
            left: (tileWidth * factor) / 2 - 15 + 40,
            // zIndex: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={moveDown}
        >
          <MaterialCommunityIcons name="chevron-down" color="white" size={30} />
        </TouchableOpacity>
      )}

      <Dialog.Container visible={showManual}>
        <Dialog.Title>Count</Dialog.Title>
        <Dialog.Description>Please input count of pallet!</Dialog.Description>

        <Dialog.Input
          value={String(manualCount)}
          defaultValue={null}
          placeholder=""
          keyboardType="numeric"
          textContentType="oneTimeCode"
          onChangeText={onChangeCount}
        ></Dialog.Input>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button
          label="Submit"
          onPress={handleSubmit}
          disabled={countToAssign - manualCount < 0}
        />
      </Dialog.Container>
    </View>
  );
};

export default CloseMap;

const styles = StyleSheet.create({
  box: {
    height: 40,
    width: 40,
    backgroundColor: "blue",
    borderRadius: 5,
  },
});