import React, { useRef } from 'react';
import { Animated, StyleSheet, FlatListProps } from 'react-native';

import LargeTopAppBar, { LARGE_TOP_APP_BAR_HEIGHT } from './LargeTopAppBar';

interface Props<ItemT> extends FlatListProps<ItemT> {
  /** Title for the LargeTopAppBar */
  title: string;
}

export default function CollapsibleFlatList<ItemT>(props: Props<ItemT>) {
  const { title, contentContainerStyle, onScroll, ...rest } = props;
  const scrollY = useRef(new Animated.Value(0)).current;

  const translateY = scrollY.interpolate({
    inputRange: [0, LARGE_TOP_APP_BAR_HEIGHT],
    outputRange: [0, -LARGE_TOP_APP_BAR_HEIGHT],
    extrapolate: 'clamp',
  });

  return (
    <>
      <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
        <LargeTopAppBar title={title} />
      </Animated.View>
      <Animated.FlatList
        {...rest}
        contentContainerStyle={[
          { paddingTop: LARGE_TOP_APP_BAR_HEIGHT },
          contentContainerStyle,
        ]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
            listener: onScroll,
          }
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
}); 