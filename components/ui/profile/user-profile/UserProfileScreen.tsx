import { FormInputFieldProps } from '@/components/ui/Form';
import Spacer from '@/components/ui/Spacer';
import { Text } from '@/components/ui/Text';
import Spacing from '@/constants/SPACING';
import withErrorAndLoading, { WithErrorAndLoadingProps } from '@/hoc/withErrorAndLoading';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UserProfileForm from './UserProfileForm';
import UserProfileFormImageHandler from './UserProfileFormImageHandler';

type UserProfileScreenProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formFields: FormInputFieldProps<T>[];
  onSubmit: (values: T) => void;
  updateError?: Error | null;
  onImageSelect: (s: string) => void;
  alwaysRenderButton: boolean;
};

const UserProfileScreen = <T extends FieldValues>({
  form,
  formFields,
  onSubmit,
  updateError,
  onImageSelect,
  alwaysRenderButton,
}: UserProfileScreenProps<T>) => {
  const background = useThemeColor({}, 'background');
  const errorColor = useThemeColor({}, 'secondary'); 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
      >
        <UserProfileFormImageHandler onImageSelect={onImageSelect} />

        <Spacer size="xl" />
        {updateError && (
          <Text variant="h5" style={{ color: errorColor }}>
            {updateError.message}
          </Text>
        )}

        <UserProfileForm
          form={form}
          formFields={formFields}
          onSubmit={onSubmit}
          alwaysRenderButton={alwaysRenderButton}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default withErrorAndLoading(UserProfileScreen) as <T extends FieldValues>(
  props: UserProfileScreenProps<T> & WithErrorAndLoadingProps
) => JSX.Element;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxs,
  },
});
