import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

const {} = Dimensions.get("window");

type CollapsibleHeaderViewProps = {
  initialHeight?: number;
  header: React.ReactNode;
  content: React.ReactNode;
};

const CollapsibleHeaderView: React.FC<CollapsibleHeaderViewProps> = ({
  initialHeight = 200,
  header,
  content,
}) => {
  const [headerHeight, setHeaderHeight] = useState(initialHeight);
  const scrollY = useRef(new Animated.Value(0)).current;

  const background = useThemeColor({}, "background");

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: "clamp",
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height: _height } = event.nativeEvent.layout;
    setHeaderHeight(_height);
  };

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      <StatusBar backgroundColor={background} />
      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: headerHeight }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        {content}
      </Animated.ScrollView>

      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: background,
            transform: [{ translateY: headerTranslate }],
          },
        ]}
        onLayout={handleLayout}
      >
        {header}
      </Animated.View>
    </View>
  );
};

export default CollapsibleHeaderView;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
