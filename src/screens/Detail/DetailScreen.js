import React, { useContext, useMemo, useRef, useState, useEffect } from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import CloseMap from "./components/CloseMap";
import { PalletContext } from "../../context/PalletContext";
import shapes from "../../data/shapes";
import AppleStyleSwipeableRow from "../../components/AppleStyleSwipeableRow";
import BottomSheet, {
  BottomSheetSectionList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import SegmentedControl from "@react-native-segmented-control/segmented-control";

const DetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [selectedItem, setSelectedItem] = useState(item);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { height, width } = Dimensions.get("window");
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

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

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
      return slots.includes(item.slot);
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
          }}
        >
          Current Code: {currentCode}
          {count > 0 ? `\nCount: ${count}` : ""}
          {countToAssign > 0 ? `\nRemain: ${countToAssign}` : ""}
        </Text>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        // onChange={handleSheetChanges}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          <View style={{ paddingVertical: 8 }}>
            <SegmentedControl
              values={["Slots", "Pallets"]}
              selectedIndex={selectedIndex}
              tintColor="black"
              style={{ height: 36 }}
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 8,
    // marginHorizontal: 8,
    marginVertical: 4,
    backgroundColor: "gray",
    borderRadius: 4,
  },
  title: {
    color: "black",
    fontSize: 16,
  },
});
