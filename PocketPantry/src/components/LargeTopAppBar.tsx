import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { COLORS } from '../constants';

interface Props {
  title: string;
}

export const LARGE_TOP_APP_BAR_HEIGHT = 56;

export default function LargeTopAppBar({ title }: Props) {
  return (
    <SafeAreaView style={{ backgroundColor: COLORS.purpleLight }}>
      <Appbar.Header
        mode="small"
        style={styles.header}
        elevated
      >
        <Appbar.Content
          title={title}
          titleStyle={styles.title}
          style={{ justifyContent: 'center', alignItems: 'flex-start', paddingBottom: 0, paddingTop: 0 }}
        />
      </Appbar.Header>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: LARGE_TOP_APP_BAR_HEIGHT,
    backgroundColor: COLORS.purpleLight,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textSecondary, // or add a new color if needed
    textAlign: 'left',
    flexShrink: 1,
  },
}); 