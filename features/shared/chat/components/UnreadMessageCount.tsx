import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type UnreadMessageCountProps = {
  count: number;
};

export default function UnreadMessageCount({ count }: UnreadMessageCountProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 6,
    borderRadius: 10,
    height: 20,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});
