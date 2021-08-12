import {
  connectActionSheet,
  useActionSheet,
} from "@expo/react-native-action-sheet";
import BottomSheet, { BottomSheetSectionList } from "@gorhom/bottom-sheet";
import { useHeaderHeight } from "@react-navigation/stack";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Dialog from "react-native-dialog";
import { Extrapolate, interpolateNode } from "react-native-reanimated";
import { useValue } from "react-native-redash/lib/module/v1";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AppleStyleSwipeableRow from "../../components/AppleStyleSwipeableRow";
import SearchHandle, {
  SEARCH_HANDLE_HEIGHT,
} from "../../components/searchHandle";
import { PalletContext } from "../../context/PalletContext";
import data from "../../data/data";
import Map from "./components/Map";
const { height: SCREEN_HEIGHT } = Dimensions.get("screen");

const HomeScreen = ({ navigation }) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const [showManual, setShowManual] = useState(false);

  const [manualCode, setManualCode] = useState(null);
  const [manualCount, setManualCount] = useState(1);
  const [keyword, setKeyword] = useState(null);

  const isSearchMode =
    keyword !== null && keyword !== undefined && keyword != "";

  const [source, setSource] = useState([]);

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
    removeOne,
  } = useContext(PalletContext);

  const onChangeText = (text) => {
    setManualCode(text);
  };

  const onChangeCount = (count) => {
    setManualCount(Number(count));
  };

  const handleSubmit = () => {
    if (manualCode === "" || manualCode === null || Number(manualCount) == 0) {
      console.log(`ignore, ${manualCode}, ${manualCount}`);
      return;
    }
    if (existPallet(manualCode)) {
      Alert.alert("Already exists");
    }
    setShowManual(false);
    setCurrentCode(manualCode);
    setCountToAssign(manualCount);
    setCount(manualCount);
    setManualCode(null);
    setManualCount(1);
  };

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

  const handleCancel = () => {
    setShowManual(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 20 }} onPress={addAction}>
          <MaterialCommunityIcons name="plus" color="black" size={30} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const bottomSheetRef = useRef(null);

  // variables

  const headerHeight = useHeaderHeight();
  const { bottom: bottomSafeArea } = useSafeAreaInsets();

  const snapPoints = useMemo(
    () => [
      bottomSafeArea === 0 ? SEARCH_HANDLE_HEIGHT / 2 : bottomSafeArea,
      298 + bottomSafeArea,
      SCREEN_HEIGHT,
    ],
    [bottomSafeArea]
  );

  const animatedPosition = useValue(0);
  const animatedModalPosition = useValue(0);
  const animatedIndex = useValue(0);

  const scrollViewStyle = useMemo(
    () => [
      styles.scrollView,
      {
        opacity: interpolateNode(animatedIndex, {
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: Extrapolate.CLAMP,
        }),
      },
    ],
    [animatedIndex]
  );
  const scrollViewContentContainer = useMemo(
    () => [styles.contentContainer, { paddingBottom: bottomSafeArea }],
    [bottomSafeArea]
  );

  const onKeywordChange = (text) => {
    console.log(text);
    setKeyword(text);
  };

  const onPressScan = () => {
    navigation.navigate("Scan", { searchMode: true });
  };

  const renderSearchHandle = useCallback(() => {
    return (
      <SearchHandle onChange={onKeywordChange} onPressScan={onPressScan} />
    );
  }, []);

  const getDataSource = () => {
    if (isSearchMode === true) {
      return getDataSourceWithKeyWord();
    }
    const source = [];
    data.forEach((tile) => {
      let count = 0;
      const info = tile.slots.map((slotIndex) => {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue.count;
        const palletsCount = pallets
          .filter((pallet) => {
            if (keyword !== null && keyword !== "" && keyword !== undefined) {
              "".includes;
              return (
                pallet.slot === slotIndex &&
                pallet.id.toLowerCase().includes(keyword.toLowerCase())
              );
            } else {
              return pallet.slot === slotIndex;
            }
          })
          .reduce(reducer, 0);
        count += palletsCount;
        return {
          id: slotIndex,
          count: palletsCount,
        };
      });
      if (
        (keyword !== null &&
          keyword !== "" &&
          keyword !== undefined &&
          count !== 0) ||
        keyword === null ||
        keyword === "" ||
        keyword === undefined
      ) {
        source.push({ title: tile.title, count: count, data: info });
      }
    });
    return source;
  };

  const getDataSourceWithKeyWord = () => {
    if (isSearchMode === false) {
      return [];
    }
    const source = [];
    data.forEach((tile) => {
      source.push({
        title: tile.title,
        count: count,
        data: pallets.filter((item) => {
          return (
            tile.slots.includes(item.slot) &&
            item.code.includes(keyword) === true
          );
        }),
      });
    });
    return source;
  };

  const renderItem = ({ item }) => {
    const { id, count } = item;
    return isSearchMode ? (
      <AppleStyleSwipeableRow
        onDelete={() => onDelete(id)}
        onRemove={() => removeOne(id)}
      >
        <TouchableWithoutFeedback onPress={() => selectItem(item)}>
          <View style={styles.item}>
            <Text style={styles.title}>{item.code ?? id}</Text>
            <Text style={styles.count}>{count}</Text>
          </View>
        </TouchableWithoutFeedback>
      </AppleStyleSwipeableRow>
    ) : (
      <TouchableWithoutFeedback onPress={() => selectItem(item)}>
        <View style={styles.item}>
          <Text style={styles.title}>{item.code ?? id}</Text>
          <Text style={styles.count}>{count}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const selectItem = (item) => {
    if (isSearchMode === true) {
      setCurrentCode(item.code);
      setCount(item.count);
      setCountToAssign(0);
      const tiles = data.filter((tile) => {
        return tile.slots.includes(item.slot);
      });
      if (tiles.length > 0) {
        navigation.navigate("Detail", { item: tiles[0] });
      }
    } else {
      const tiles = data.filter((tile) => {
        return tile.slots.includes(item.code);
      });
      if (tiles.length > 0) {
        navigation.navigate("Detail", { item: tiles[0] });
      }
    }
  };

  const renderHeader = ({ section: { title, count } }) => (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
      {isSearchMode === false && <Text style={styles.headerText}>{count}</Text>}
    </View>
  );

  const onDelete = (id) => {
    deletePallet(id);
  };

  useEffect(() => {
    const tempSource = getDataSource();
    console.log("tempSource", JSON.stringify(tempSource));
    setSource(tempSource);
    console.log("source", JSON.stringify(source));
  }, [pallets, keyword]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <StatusBar barStyle="dark-content" />
      {currentCode !== null && (
        <Text
          style={{
            color: "white",
            padding: 20,
            fontSize: 24,
            fontWeight: "bold",
          }}
        >
          Current Code: {currentCode}
          {count > 0 ? `\nCount: ${count}` : ""}
          {countToAssign > 0 ? `\nRemain: ${countToAssign}` : ""}
        </Text>
      )}
      <View
        style={{
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
        }}
      >
        <Map />
      </View>

      <Dialog.Container visible={showManual}>
        <Dialog.Title>Code</Dialog.Title>
        <Dialog.Description>
          Please input the code and count of pallet!
        </Dialog.Description>
        <Dialog.Input
          value={manualCode}
          placeholder="Code"
          onChangeText={onChangeText}
        ></Dialog.Input>

        <Dialog.Input
          value={String(manualCount)}
          placeholder="Count"
          keyboardType="numeric"
          textContentType="oneTimeCode"
          onChangeText={onChangeCount}
        ></Dialog.Input>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Submit" onPress={handleSubmit} />
      </Dialog.Container>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        key="bottomSheet"
        snapPoints={snapPoints}
        topInset={headerHeight}
        handleHeight={SEARCH_HANDLE_HEIGHT}
        handleComponent={renderSearchHandle}

        // onChange={handleSheetChanges}
      >
        {console.log("section", JSON.stringify(source))}
        <BottomSheetSectionList
          sections={source}
          keyExtractor={(item, index) => {
            return item.id ?? 0 + index;
          }}
          renderItem={renderItem}
          renderSectionHeader={renderHeader}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: bottomSafeArea + 20 },
          ]}
          stickySectionHeadersEnabled={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="never"
          // style={scrollViewStyle}
          // contentContainerStyle={scrollViewContentContainer}
        />
      </BottomSheet>
    </SafeAreaView>
  );
};

export default connectActionSheet(HomeScreen);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
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
