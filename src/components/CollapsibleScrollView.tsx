import React, { useRef } from 'react';
import { Animated, StyleSheet, ScrollViewProps } from 'react-native';
import LargeTopAppBar, { LARGE_TOP_APP_BAR_HEIGHT } from './LargeTopAppBar';

interface Props extends ScrollViewProps {
  title: string;
  children: React.ReactNode;
}

export default function CollapsibleScrollView({ title, children, contentContainerStyle, onScroll, ...rest }: Props) {
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
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore Animated types */}
      <Animated.ScrollView
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
            listener: onScroll as any,
          }
        )}
      >
        {children}
      </Animated.ScrollView>
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