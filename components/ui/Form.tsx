import { useThemeColor } from '@/hooks/useThemeColor';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
    Control,
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
    FormProvider,
    Path,
    useFormContext,
} from 'react-hook-form';
import {
    TextInput as RNTextInput,
    StyleSheet,
    Text,
    TextProps,
    View,
    ViewProps,
} from 'react-native';
import TextInput from './TextInput';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};
FormField.displayName = 'FormField';

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<View, ViewProps>(
  ({ children, style, ...props }, ref) => {
    return (
      <View ref={ref} style={[styles.formItem, style]} {...props}>
        {React.Children.map(children, (child, i) => (
          <View
            style={
              i < React.Children.toArray(children).length - 1
                ? { marginBottom: 1 }
                : null
            }
          >
            {child}
          </View>
        ))}
      </View>
    );
  }
);
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<Text, any>(({ style, ...props }, ref) => {
  const { error } = useFormField();
  const errorColor = useThemeColor({}, 'secondary');

  return (
    <Text
      ref={ref}
      style={[styles.formLabel, error && { color: errorColor }, style]}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { formDescriptionId } = useFormField();
    const muted = useThemeColor({}, 'icon');

    return (
      <Text
        ref={ref}
        id={formDescriptionId}
        style={[styles.formDescription, { color: muted }, style]}
        {...props}
      />
    );
  }
);
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<Text, TextProps>(
  ({ style, children, ...props }, ref) => {
    const errorColor = useThemeColor({}, 'secondary');
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return <View style={{ height: 10 }} />;
    }

    return (
      <View style={{ height: 10 }}>
        <Text
          ref={ref}
          id={formMessageId}
          style={[styles.formMessage, { color: errorColor }, style]}
          {...props}
        >
          {body}
        </Text>
      </View>
    );
  }
);
FormMessage.displayName = 'FormMessage';

export type FormInputFieldProps<T extends FieldValues> = {
  formLabel: string;
  name: Path<T>;
  fieldIndex: number;
  fullName?: string;
} & Omit<
  React.ComponentProps<typeof TextInput>,
  'onSubmitEditing' | 'value' | 'onChangeText' | 'onBlur'
>;

export type FormFieldProps<T extends FieldValues> = {
  handleSubmitEditing: () => void;
  formControl: Control<T>;
} & FormInputFieldProps<T>;

const FormFieldRenderer = <T extends FieldValues>(
  {
    formLabel,
    name,
    handleSubmitEditing,
    formControl,
    ...textInputProps
  }: FormFieldProps<T>,
  ref: React.ForwardedRef<RNTextInput>
) => {
  return (
    <FormField
      control={formControl}
      render={({ field: { onChange, onBlur, value } }) => (
        <FormItem>
          <FormLabel>{formLabel}</FormLabel>
          <FormControl>
            <TextInput
              {...textInputProps}
              ref={ref}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              onSubmitEditing={handleSubmitEditing}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
      name={name}
    />
  );
};

export const FormInputField = React.forwardRef(FormFieldRenderer) as <
  T extends FieldValues
>(
  props: FormFieldProps<T> & { ref?: React.ForwardedRef<RNTextInput> }
) => ReturnType<typeof FormFieldRenderer>;

const styles = StyleSheet.create({
  formItem: {},
  formLabel: {
    fontSize: 10.8,
  },
  formDescription: {
    fontSize: 10.8,
  },
  formMessage: {
    fontSize: 10,
  },
});

export {
    Form, FormControl,
    FormDescription, FormField, FormItem,
    FormLabel, FormMessage, useFormField
};

