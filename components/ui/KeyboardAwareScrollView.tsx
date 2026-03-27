import React from 'react';
import { Platform } from 'react-native';
import {
  KeyboardAwareScrollViewProps,
  KeyboardAwareScrollView as MainKeyboardAwareScrollView,
} from 'react-native-keyboard-aware-scroll-view';

const KeyboardAwareScrollView: React.FC<KeyboardAwareScrollViewProps> = ({ ...rest }) => {
  return (
    <MainKeyboardAwareScrollView
      {...rest}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      enableOnAndroid
      extraScrollHeight={Platform.select({ ios: 0, android: 50 })}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
};

export default KeyboardAwareScrollView;
