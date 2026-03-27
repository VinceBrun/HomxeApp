import Button from '@/components/Button';
import { Text } from '@/components/ui/Text';
import Radius from '@/constants/RADIUS';
import Spacing from '@/constants/SPACING';
import { useThemeColor } from '@/hooks/useThemeColor';
import { WarningModalProps } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, ModalProps, Portal } from 'react-native-paper';

type Props = WarningModalProps & {
  modalProps: Omit<ModalProps, 'children'>;
  hideModal: () => void;
};

const WarningConfirmationModal: React.FC<Props> = ({
  modalProps,
  ...compProps
}) => {
  const {
    onProceed,
    warningHeader,
    warningActionButtonText,
    warningDescription,
    warningIcon,
    hideModal,
  } = compProps;

  const background = useThemeColor({}, 'background');
  const error = useThemeColor({}, 'secondary');
  const errorContainer = useThemeColor({}, 'card');
  const muted = useThemeColor({}, 'icon');
  const mutedContainer = useThemeColor({}, 'card');

  const handleContinue = () => {
    onProceed();
    hideModal();
  };

  const buttonSharedProps: Partial<React.ComponentProps<typeof Button>> = {
    mode: 'contained',
    style: styles.button,
    labelStyle: styles.buttonText,
    contentStyle: styles.buttoncontentStyle,
  };

  return (
    <Portal>
      <Modal
        {...modalProps}
        contentContainerStyle={[
          modalProps?.contentContainerStyle,
          { backgroundColor: background },
          styles.modalContainerStyle,
        ]}
      >
        <View style={styles.contentContainerStyle}>
          <View style={[styles.iconContainerViewStyles, { backgroundColor: errorContainer }]}>
            <View style={[styles.iconContainer, { backgroundColor: error }]}>
              <Ionicons name={warningIcon} color={background} size={30} />
            </View>
          </View>

          <View style={{ gap: Spacing.xxs }}>
            <Text variant="h3" style={styles.header}>
              {warningHeader}
            </Text>
            <Text variant="h6" style={[styles.description, { color: muted }]}>
              {warningDescription}
            </Text>
          </View>

          <View style={{ gap: Spacing.md, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Button
                onPress={hideModal}
                buttonColor={mutedContainer}
                textColor={muted}
                {...buttonSharedProps}
              >
                Cancel
              </Button>
            </View>

            <View style={{ flex: 1 }}>
              <Button
                onPress={handleContinue}
                buttonColor={error}
                {...buttonSharedProps}
              >
                {warningActionButtonText}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default WarningConfirmationModal;

const styles = StyleSheet.create({
  modalContainerStyle: {
    width: '70%',
    marginHorizontal: 'auto',
    maxWidth: 450,
    minWidth: 230,
    borderRadius: Radius.sm,
    padding: 0,
  },
  contentContainerStyle: {
    padding: 10,
    gap: Spacing.md,
  },
  iconContainer: {
    height: 45,
    width: 45,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerViewStyles: {
    paddingVertical: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  header: {
    fontWeight: '600',
  },
  description: {
    fontWeight: '500',
  },
  button: {
    borderRadius: 10,
  },
  buttoncontentStyle: {
    padding: 0,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 15,
  },
  debug: {
    borderColor: 'red',
    borderWidth: 1,
  },
});
