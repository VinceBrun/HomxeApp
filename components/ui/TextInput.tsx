import { useThemeColor } from '@/hooks/useThemeColor';
import React, { forwardRef, memo, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  StyleSheet,
} from 'react-native';
import { TextInput as PaperInput } from 'react-native-paper';

type PaperInputProps = React.ComponentProps<typeof PaperInput>;

const TextInput = forwardRef<
  RNTextInput,
  PaperInputProps & {
    additionalOutlineStyle?: PaperInputProps['outlineStyle'];
    additionalContentStyle?: PaperInputProps['contentStyle'];
    value?: string;
    onChangeText?: (text: string) => void;
    onBlur?: (e: NativeSyntheticEvent<any>) => void;
  }
>(function (
  {
    style,
    additionalOutlineStyle,
    additionalContentStyle,
    value,
    onChangeText,
    onBlur,
    ...props
  },
  ref
) {
  const [focused, setFocused] = useState(false);

  const backgroundColor = useThemeColor({}, 'card');
  const primary = useThemeColor({}, 'primary');
  const placeholder = useThemeColor({}, 'icon');
  const textColor = useThemeColor({}, 'text');

  const handleFocus = () => setFocused(true);
  const handleBlur = (e: NativeSyntheticEvent<any>) => {
    onBlur?.(e);
    setFocused(false);
  };

  return (
    <PaperInput
      ref={ref}
      value={value}
      onChangeText={onChangeText}
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={[{ backgroundColor }, style]}
      outlineStyle={[
        styles.outline,
        {
          borderColor: focused ? primary : 'rgba(0,0,0,0.08)',
          borderWidth: focused ? 1 : StyleSheet.hairlineWidth,
        },
        additionalOutlineStyle,
      ]}
      contentStyle={[styles.content, { color: textColor }, additionalContentStyle]}
      selectionColor={primary}
      underlineColor="transparent"
      placeholderTextColor={placeholder}
      mode="outlined"
      autoCorrect={false}
      {...props}
    />
  );
});

TextInput.displayName = 'TextInput';

export const TextInputIcon = PaperInput.Icon;

const styles = StyleSheet.create({
  outline: {
    borderRadius: 1000,
  },
  content: {
    fontSize: 14,
  },
});

export default memo(TextInput);
