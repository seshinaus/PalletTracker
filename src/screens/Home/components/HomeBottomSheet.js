import React,{ useCallback, useRef, useMemo, useState, useEffect, useContext} from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import BottomSheet, {
  BottomSheetSectionList
} from "@gorhom/bottom-sheet";
import {
  useHeaderHeight
} from "@react-navigation/stack";
import AppleStyleSwipeableRow from "../../../components/AppleStyleSwipeableRow";
import SearchHandle, {
  SEARCH_HANDLE_HEIGHT
}
  from "../../../components/searchHandle";
const {
  height: SCREEN_HEIGHT
} = Dimensions.get("screen");
import {
  useSafeAreaInsets
} from "react-native-safe-area-context";

import data from "../../../data/data";
import {
  getDataSource
} from "../../../utils/utils";
import { PalletContext } from '../../../context/PalletContext';
import { useNavigation } from '@react-navigation/native';

const HomeBottomSheet = () => {

  const navigation = useNavigation()

  const bottomSheetRef = useRef(null);

  const headerHeight = useHeaderHeight();
  const [keyword, setKeyword] = useState(null);

  const [source, setSource] = useState([]);
  const {
    bottom: bottomSafeArea
  } = useSafeAreaInsets();

  const {
    pallets,
    setCurrentCode,
    setCount,
    setCountToAssign
  } = useContext(PalletContext);

  const snapPoints = useMemo(
    () => [
      bottomSafeArea === 0 ? SEARCH_HANDLE_HEIGHT / 2 : bottomSafeArea,
      298 + bottomSafeArea,
      SCREEN_HEIGHT,
    ],
    [bottomSafeArea]
  );

  const renderSearchHandle = useCallback(() => {
    return (
      <SearchHandle onChange={onKeywordChange} onPressScan={onPressScan} />
    );
  }, []);

  const renderItem = ({ item }) => {
    const { id, count } = item;
    return keyword ? (
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

  const onKeywordChange = (text) => {
    console.log(text);
    setKeyword(text);
  };

  const onPressScan = () => {
    navigation.navigate("Scan", { searchMode: true });
  };

  
  const selectItem = (item) => {
    if (keyword) {
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
      {keyword != null ? <Text style={styles.headerText}>{count}</Text> : null}
    </View>
  );

  const onDelete = (id) => {
    deletePallet(id);
  };

  useEffect(() => {
    const tempSource = getDataSource(data, pallets, keyword)
    console.log(`tempSource`, JSON.stringify(tempSource))
    setSource(tempSource);
  }, [pallets, keyword]);

  return (
    <BottomSheet
        ref={bottomSheetRef}
        index={0}
        key="bottomSheet"
        snapPoints={snapPoints}
        topInset={headerHeight}
        handleHeight={SEARCH_HANDLE_HEIGHT}
        handleComponent={renderSearchHandle}
      >
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
  )
}

export default HomeBottomSheet

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

