import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

const LargeTextArea = React.forwardRef<TextInput, TextInputProps>(
  ({ style, ...props }, ref) => {
    const placeholderColor = useThemeColor({}, 'icon');
    const borderColor = useThemeColor({}, 'outlineBorder');
    const textColor = useThemeColor({}, 'text');

    return (
      <TextInput
        ref={ref}
        multiline
        numberOfLines={8}
        textAlignVertical="top"
        placeholderTextColor={placeholderColor}
        style={[
          styles.input,
          {
            borderColor,
            color: textColor,
          },
          style,
        ]}
        {...props}
      />
    );
  }
);

LargeTextArea.displayName = 'LargeTextArea';

const styles = StyleSheet.create({
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 140,
  },
});

export default LargeTextArea;
