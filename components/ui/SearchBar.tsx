import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, Platform } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';
import Spacing from '@/constants/SPACING';
import Radius from '@/constants/RADIUS';
import { useThemeColor } from '@/hooks/useThemeColor';

type SearchBarProps = {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  renderIcon?: () => JSX.Element;
  containerStyle?: any;
  inputStyle?: any;
  useRouterSync?: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChangeText,
  renderIcon,
  containerStyle,
  inputStyle,
  useRouterSync = true,
}) => {
  const bg = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'outlineBorder');
  const text = useThemeColor({}, 'text');

  const [localSearch, setLocalSearch] = useState(value ?? '');
  const debouncedRouterSearch = useDebouncedCallback((text: string) => {
    if (useRouterSync) {
      import('expo-router').then(({ router }) => {
        router.setParams({ query: text });
      });
    }
  }, 500);

  useEffect(() => {
    if (value !== undefined) {
      setLocalSearch(value);
    }
  }, [value]);  

  const handleSearch = (text: string) => {
    setLocalSearch(text);
    if (onChangeText) {
      onChangeText(text);
    }
    debouncedRouterSearch(text);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bg, borderColor: border },
        containerStyle,
      ]}
    >
      {renderIcon && <View style={styles.icon}>{renderIcon()}</View>}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#A9A9A9"
        value={localSearch}
        onChangeText={handleSearch}
        style={[styles.input, { color: text }, inputStyle]}
        returnKeyType="search"
        underlineColorAndroid="transparent"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    backgroundColor: '#F4F6F8',
    minHeight: 42,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Platform.OS === 'android' ? 3 : 6,
    flex: 1,
  },
  icon: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PoppinsRegular',
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
});

export default SearchBar;
