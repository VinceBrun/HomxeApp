import Button from "@/components/Button";
import {
  Form,
  FormInputField,
  FormInputFieldProps,
} from "@/components/ui/Form";
import Spacer from "@/components/ui/Spacer";
import TextInput from "@/components/ui/TextInput";
import { SpacingScaleLabel } from "@/constants/SPACING";
import { useFormLogic } from "@/hooks/useFormLogic";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

export interface UserProfileReadonlyFormField {
  label: string;
  value: string | null;
}

interface ReusableFormBaseProps {
  readonly?: boolean;
}

interface UserProfileFormReadonlyProps extends ReusableFormBaseProps {
  readonly: true;
  formFields: UserProfileReadonlyFormField[];
}

interface UserProfileFormEditableProps<
  T extends FieldValues,
> extends ReusableFormBaseProps {
  form: UseFormReturn<T>;
  formFields: FormInputFieldProps<T>[];
  onSubmit: (values: T) => void;
  alwaysRenderButton?: boolean;
  buttonText?: string;
  spaceBtwFormAndButton?: SpacingScaleLabel | number;
  readonly?: false;
}

export type UserProfileFormProps<T extends FieldValues> =
  | UserProfileFormReadonlyProps
  | UserProfileFormEditableProps<T>;

const ReadOnlyFormField: React.FC<UserProfileReadonlyFormField> = ({
  label,
  value,
}) => {
  const onBackground = useThemeColor({}, "text");

  return (
    <View>
      <Text style={{ color: onBackground, fontSize: 12.8 }}>{label}</Text>
      <TextInput readOnly value={value ?? ""} />
    </View>
  );
};

const UserProfileReadonlyForm = ({
  formFields,
}: UserProfileFormReadonlyProps) => {
  return (
    <>
      <View style={styles.topFormView}>
        {formFields.slice(0, 2).map((props) => (
          <View style={{ flex: 1 }} key={props.label}>
            <ReadOnlyFormField {...props} />
          </View>
        ))}
      </View>
      <Spacer size={9} />
      <View style={{ gap: 9 }}>
        {formFields.slice(2).map((props) => (
          <ReadOnlyFormField {...props} key={props.label} />
        ))}
      </View>
    </>
  );
};

const UserProfileEditableForm = <T extends FieldValues>({
  form,
  formFields,
  onSubmit,
  alwaysRenderButton,
  buttonText = "Save Changes",
  spaceBtwFormAndButton = "lg",
}: UserProfileFormEditableProps<T>) => {
  const { createProps } = useFormLogic({
    formControl: form.control,
    formFieldsLength: formFields.length,
  });

  return (
    <Form {...form}>
      <View style={styles.topFormView}>
        {formFields.slice(0, 2).map((props) => (
          <View style={{ flex: 1 }} key={props.name}>
            <FormInputField {...createProps(props)} />
          </View>
        ))}
      </View>
      <Spacer size={9} />
      <View style={{ gap: 9 }}>
        {formFields.slice(2).map((props) => (
          <FormInputField {...props} {...createProps(props)} key={props.name} />
        ))}
      </View>
      <Spacer size={spaceBtwFormAndButton} />
      {(form.formState.isDirty || alwaysRenderButton) && (
        <Button
          mode="contained"
          disabled={alwaysRenderButton ? false : !form.formState.isDirty}
          onPress={form.handleSubmit(onSubmit)}
        >
          {buttonText}
        </Button>
      )}
    </Form>
  );
};

const UserProfileForm = <T extends FieldValues>(
  props: UserProfileFormProps<T>,
) => {
  if (props.readonly) return <UserProfileReadonlyForm {...props} />;
  return <UserProfileEditableForm {...props} />;
};

export default UserProfileForm;

const styles = StyleSheet.create({
  topFormView: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
  },
});
