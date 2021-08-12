import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppleStyleSwipeableRow from "../../components/AppleStyleSwipeableRow";
import { PalletContext } from "../../context/PalletContext";
import CloseMap from "./components/CloseMap";

const DetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [selectedItem, setSelectedItem] = useState(item);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { height, width } = Dimensions.get("window");
  const { bottom: bottomSafeArea } = useSafeAreaInsets();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: item.title,
    });
  }, [navigation]);

  const {
    pallets,
    existPallet,
    addPallet,
    currentCode,
    setCurrentCode,
    count,
    setCount,
    countToAssign,
    setCountToAssign,
    deletePallet,
  } = useContext(PalletContext);

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(
    () => [bottomSafeArea === 0 ? 80 : bottomSafeArea + 80, "50%", "90%"],
    [bottomSafeArea]
  );

  const { slots } = selectedItem;

  const getDataSource = () => {
    return slots.map((slotIndex) => {
      const reducer = (accumulator, currentValue) =>
        accumulator + currentValue.count;
      const palletsCount = pallets
        .filter((pallet) => {
          return pallet.slot === slotIndex;
        })
        .reduce(reducer, 0);
      return {
        id: slotIndex,
        count: palletsCount,
      };
    });
  };

  const getPallets = () => {
    return pallets.filter((item) => {
      return (
        slots.includes(item.slot) &&
        (currentCode !== null && currentCode !== undefined
          ? item.code === currentCode
          : true)
      );
    });
  };

  const [source, setSource] = useState([]);

  const [palletsToShow, setPalletsToShow] = useState([]);

  const onDelete = (id) => {
    deletePallet(id);
  };

  useEffect(() => {
    setSource(getDataSource());
    setPalletsToShow(getPallets());
  }, [selectedItem, pallets]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#003158",
      }}
    >
      <StatusBar barStyle="dark-content" />

      <CloseMap selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      {currentCode !== null && (
        <Text
          style={{
            color: "white",
            padding: 20,
            fontSize: 24,
            fontWeight: "bold",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          Current Code: {currentCode}
          {count > 0 ? `\nCount: ${count}` : ""}
          {countToAssign > 0 ? `\nRemain: ${countToAssign}` : ""}
        </Text>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}

        // onChange={handleSheetChanges}
      >
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: bottomSafeArea },
          ]}
          style={{ zIndex: 20 }}
        >
          <View style={{ paddingVertical: 8 }}>
            <SegmentedControl
              values={["Slots", "Pallets"]}
              selectedIndex={selectedIndex}
              tintColor="black"
              activeFontStyle={{ color: "white" }}
              backgroundColor="gray"
              style={{ height: 44 }}
              tabStyle={{ color: "black" }}
              onChange={(event) => {
                setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
              }}
            />
          </View>
          {selectedIndex === 0
            ? source.map((item) => {
                const { id, count } = item;
                return (
                  <TouchableWithoutFeedback key={id}>
                    <View style={styles.item}>
                      <Text style={styles.title}>{item.code ?? id}</Text>
                      <Text style={styles.count}>{count}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                );
              })
            : palletsToShow.map((item) => {
                const { id, count } = item;
                return (
                  <AppleStyleSwipeableRow
                    key={id}
                    onDelete={() => onDelete(id)}
                  >
                    <TouchableWithoutFeedback>
                      <View style={styles.item}>
                        <Text style={styles.title}>{item.code ?? id}</Text>
                        <Text style={styles.count}>{count}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </AppleStyleSwipeableRow>
                );
              })}
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
    marginHorizontal: 8,
  },
  header: {
    marginVertical: 8,
    borderRadius: 4,
    paddingRight: 4,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    // marginHorizontal: 8,
    marginVertical: 4,
    backgroundColor: "gray",
    borderRadius: 4,
    height: 44,
  },
  title: {
    color: "black",
    fontSize: 16,
  },
});
