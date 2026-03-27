import Radius from '@/constants/RADIUS';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar as OriginalAvatar } from 'react-native-paper';

function Avatar({
  size,
  imageUri,
  additionalStyles,
}: Readonly<{
  size?: number;
  imageUri?: string | null;
  additionalStyles?: View['props']['style'];
}>) {
  const [imageError, setImageError] = useState(false);
  const _size = size ?? 40;

  const primary = useThemeColor({}, 'primary');
  const muted = useThemeColor({}, 'icon'); 
  const mutedContainer = useThemeColor({}, 'card'); 

  return (
    <View
      style={[
        styles.avatarContainer,
        {
          borderColor: primary,
          backgroundColor: mutedContainer,
          width: _size,
          height: _size,
        },
        additionalStyles,
      ]}
    >
      {imageUri && !imageError ? (
        <OriginalAvatar.Image
          size={_size}
          source={{
            uri: imageUri,
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        <MaterialCommunityIcons name="account-circle-outline" size={_size * 0.6} color={muted} />
      )}
    </View>
  );
}

export default Avatar;

const styles = StyleSheet.create({
  avatarContainer: {
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
