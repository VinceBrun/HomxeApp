import { FormFieldProps } from '@/components/ui/Form';
import { FormFieldInitialType } from '@/types';
import React, { RefObject, useCallback, useEffect, useRef } from 'react';
import { Control, FieldValues } from 'react-hook-form';
import { TextInput as RNTextInput } from 'react-native';

type UseFormLogicParams<T extends FieldValues> = {
  formFieldsLength: number;
  formControl: Control<T>;
};

export type CreateFormInputAddedProps =
  | 'ref'
  | 'handleSubmitEditing'
  | 'blurOnSubmit'
  | 'returnKeyType'
  | 'formControl'
  | 'key';

export function useFormLogic<T extends FieldValues>({
  formFieldsLength,
  formControl,
}: UseFormLogicParams<T>) {
  const inputRefs = useRef<RefObject<RNTextInput | null>[]>([]);

  useEffect(() => {
    inputRefs.current = Array.from({ length: formFieldsLength }).map(() =>
      React.createRef<RNTextInput>()
    );
  }, [formFieldsLength]);

  const createProps: (props: FormFieldInitialType<T>) => FormFieldProps<T> =
    useCallback(
      (props) => {
        const formInputFieldProps: FormFieldProps<T> = {
          ...props,
          handleSubmitEditing: () => {
            const nextInput = inputRefs.current[props.fieldIndex + 1];
            if (nextInput) nextInput.current?.focus();
          },
          ref: inputRefs.current[props.fieldIndex],
          blurOnSubmit: props.fieldIndex === formFieldsLength - 1,
          returnKeyType:
            props.fieldIndex === formFieldsLength - 1 ? 'done' : 'next',
          formControl,
          key: `${props.fieldIndex}${props.name}`,
        };

        return formInputFieldProps;
      },
      [formFieldsLength, formControl]
    );


  return { createProps, inputRefs };
}
