import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import LoadingSpinner from 'react-native-loading-spinner-overlay';

type Props = { visible: boolean };

const Spinner: React.FC<Props> = ({ visible }) => {
  const overlayColor = useThemeColor({}, 'outlineBorder');
  const spinnerColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  return (
    <LoadingSpinner
      visible={visible}
      overlayColor={overlayColor}
      color={spinnerColor}
      textStyle={{
        color: textColor,
        fontWeight: 'normal',
        fontSize: 16,
      }}
      animation="fade"
    />
  );
};

export default Spinner;
