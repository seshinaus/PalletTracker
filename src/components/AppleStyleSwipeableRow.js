import React, { Component } from "react";
import { Animated, StyleSheet, Text, View, I18nManager } from "react-native";

import { RectButton, Swipeable } from "react-native-gesture-handler";

export default class AppleStyleSwipeableRow extends Component {
  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.leftAction} onPress={this.close}>
        <Animated.Text style={[styles.actionText]}>Archive</Animated.Text>
      </RectButton>
    );
  };
  renderRightAction = (text, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      this.close();
      this.props.onDelete();
    };
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Text style={styles.actionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  renderRightSecondAction = (text, color, x, progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });
    const pressHandler = () => {
      this.close();
      this.props.onRemove();
    };
    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={pressHandler}
        >
          <Text style={styles.secondActionText}>{text}</Text>
        </RectButton>
      </Animated.View>
    );
  };

  renderRightActions = (progress) => (
    <View
      style={{
        width: 128,
        flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
      }}
    >
      {/* {this.renderRightAction("More", "#C8C7CD", 192, progress)} */}
      {this.renderRightSecondAction("Remove\nOne", "#dd2c00", 64, progress)}
      {this.renderRightAction("Delete", "#dd2c00", 64, progress)}
    </View>
  );
  updateRef = (ref) => {
    this._swipeableRow = ref;
  };
  close = () => {
    this._swipeableRow.close();
  };
  render() {
    const { children } = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        leftThreshold={30}
        rightThreshold={40}
        // renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
      >
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: "#497AFC",
    justifyContent: "center",
  },
  actionText: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
  },
  secondActionText: {
    color: "white",
    fontSize: 10,
    textAlign: "center",
    backgroundColor: "transparent",
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginVertical: 4,
    // marginHorizontal: 8,
    marginLeft: 4,
    borderRadius: 4,
  },
});
