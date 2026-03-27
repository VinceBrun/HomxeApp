import { useThemeColor } from "@/hooks/useThemeColor";
import React, { forwardRef, memo, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button as PaperButton } from "react-native-paper";

type Props = React.ComponentProps<typeof PaperButton>;

const Button = forwardRef<React.ElementRef<typeof TouchableOpacity>, Props>(
  ({ mode, style, children, onPress, ...props }, ref) => {
    const surface = useThemeColor({}, 'card');
    const surfaceDisabled = useThemeColor({}, 'outlineBorder'); 
    const onSurfaceDisabled = useThemeColor({}, 'icon');
    const primaryContainer = useThemeColor({}, 'primary');

    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => setIsPressed(true);
    const handlePressOut = () => setIsPressed(false);

    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.5}
        disabled={props.disabled}
      >
        <PaperButton
          style={[
            styles.button,
            mode === "outlined" && {
              borderWidth: 1.2,
              backgroundColor: surface,
            },
            props.disabled === true && {
              backgroundColor: surfaceDisabled,
            },
            style,
          ]}
          labelStyle={[
            styles.text,
            props.disabled === true && { color: onSurfaceDisabled },
          ]}
          contentStyle={[
            styles.buttonContent,
            mode === "outlined" &&
              isPressed && { backgroundColor: primaryContainer },
          ]}
          mode={mode}
          {...props}
        >
          {children}
        </PaperButton>
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 30,
  },
  buttonContent: {
    padding: 4,
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
  },
});

export default memo(Button);
