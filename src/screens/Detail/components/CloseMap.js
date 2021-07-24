import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  PanResponder,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import images from "res/images";
import data from "../../../data/data";
import { Surface, Shape, Path } from "@react-native-community/art";
import shapes from "../../../data/shapes";
import { useNavigation } from "@react-navigation/native";
import { PalletContext } from "../../../context/PalletContext";
import Dialog from "react-native-dialog";
const MAP_WIDTH = 1400;
const MAP_HEIGHT = 2068;
const { height, width } = Dimensions.get("window");
const LINE_WIDTH = 3;

const CloseMap = ({ selectedItem, setSelectedItem }) => {
  const [slotToAdd, setSlotToAdd] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: selectedItem.title,
    });
  }, [selectedItem]);

  const {
    width: tileWidth,
    height: tileHeight,
    top: tileTop,
    left: tileLeft,
    slots,
  } = selectedItem;

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

  const slotsToShow = shapes.filter((shape) => {
    return slots.includes(shape.id);
  });

  const factor = width / tileWidth;

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
        width: width,
        height: tileHeight * factor,
      }}
    >
      <View
        style={{
          width: width,
          height: factor * tileHeight,
          overflow: "hidden",
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
              top: (topLeft.y - tileTop) * factor - LINE_WIDTH,
              left: (topLeft.x - tileLeft) * factor - LINE_WIDTH,
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
            top: (factor * tileHeight) / 2 - 15,
            zIndex: 10,
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
            left: width / 2 - 15,
            zIndex: 10,
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
            top: (factor * tileHeight) / 2 - 15,
            zIndex: 10,
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
            left: width / 2 - 15,
            zIndex: 10,
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
