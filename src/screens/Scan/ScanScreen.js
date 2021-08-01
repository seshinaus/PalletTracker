import React, { Component, useContext, useState } from "react";

import { View, Dimensions, Text, TouchableOpacity, Image } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
// import Icon from "react-native-vector-icons/Ionicons";
import Icon from "react-native-feather1s";
import * as Animatable from "react-native-animatable";
import { PalletContext } from "../../context/PalletContext";
import Dialog from "react-native-dialog";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const ScanScreen = ({ navigation, route }) => {
  const { setCurrentCode, setCount, countToAssign, setCountToAssign } =
    useContext(PalletContext);

  const { searchMode } = route.params;

  const [reactivate, setReactivate] = useState(false);

  const [showManual, setShowManual] = useState(false);

  const [manualCode, setManualCode] = useState(null);

  const [manualCount, setManualCount] = useState(1);

  function onSuccess(e) {
    console.log(e.data);
    // alert(e);
    setReactivate(false);
    let result = e.data;
    if (result === null || result === undefined || result === "") {
      setReactivate(true);
      return;
    }
    const re = /-[a-zA-Z0-9]{3}/i;
    if (result?.search(re)) {
      result = result.replace(re, "");
    }
    if (searchMode === true) {
      setCurrentCode(result);
      setCount(0);
      setCountToAssign(0);
      onBack();
      return;
    }
    setManualCode(result);
    setReactivate(false);
    setShowManual(true);
  }

  const onBack = () => {
    navigation.goBack();
  };

  function makeSlideOutTranslation(translationType, fromValue) {
    return {
      from: {
        [translationType]: scanBarWidth / 2,
      },
      to: {
        [translationType]: fromValue,
      },
    };
  }

  const onChangeCount = (count) => {
    setManualCount(Number(count));
  };

  const handleSubmit = () => {
    console.log("submit");
    setShowManual(false);
    setCurrentCode(manualCode);
    setCountToAssign(manualCount);
    setCount(manualCount);
    setManualCode(null);
    setManualCount(1);
    onBack();
  };

  const handleCancel = () => {
    setShowManual(false);
    setReactivate(true);
  };

  return (
    <View>
      <QRCodeScanner
        showMarker
        onRead={onSuccess}
        cameraStyle={{ height: SCREEN_HEIGHT }}
        reactivate={reactivate}
        customMarker={
          <View style={styles.rectangleContainer}>
            <View style={styles.topOverlay}>
              <Text style={{ fontSize: 30, color: "white" }}>
                PLEASE SCAN PALLET!
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={styles.leftAndRightOverlay} />

              <View style={styles.rectangle}>
                <Icon
                  name="maximize"
                  size={rectDimensions / 1.5 - 20}
                  color={iconScanColor}
                  style={{
                    paddingRight: 8,
                    position: "absolute",
                  }}
                />
                {/* <Image
                  source={images.crossHair}
                  style={{
                    position: "absolute",
                    width: rectDimensions / 2,
                    height: rectDimensions,
                    resizeMode: "contain",
                  }}
                /> */}
                <Animatable.View
                  style={styles.scanBar}
                  direction="alternate-reverse"
                  iterationCount="infinite"
                  duration={1200}
                  easing="linear"
                  animation={makeSlideOutTranslation(
                    "translateY",
                    -scanBarWidth / 2
                  )}
                />
              </View>

              <View style={styles.leftAndRightOverlay} />
            </View>

            <View style={styles.bottomOverlay}>
              <TouchableOpacity onPress={onBack}>
                <View style={styles.button}>
                  <Text style={{ color: "white", fontSize: 16 }}>DISMISS</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
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
        <Dialog.Button label="Submit" onPress={handleSubmit} />
      </Dialog.Container>
    </View>
  );
};

export default ScanScreen;

const overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.8; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "white";

const scanBarWidth = SCREEN_WIDTH / 3; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.005; //this is equivalent to 1 from a 393 device width
const scanBarColor = "yellow";

const iconScanColor = "white";

const styles = {
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  rectangle: {
    height: rectDimensions,
    width: rectDimensions / 1.5,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  topOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  bottomOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    paddingBottom: SCREEN_WIDTH * 0.25,
    alignItems: "center",
    justifyContent: "center",
  },

  leftAndRightOverlay: {
    height: SCREEN_WIDTH * 0.8,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
  },

  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor,
  },

  button: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 40,
    width: rectDimensions,
  },
};
