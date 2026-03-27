import Typography, { TypeScaleLabel } from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

type Variant = TypeScaleLabel;

export type TextProps = RNTextProps & {
  variant?: Variant;
};

export function Text({ variant = "h6", style, ...props }: TextProps) {
  const textColor = useThemeColor({}, "text");

  return (
    <RNText
      {...props}
      style={[
        { color: textColor },
        {
          fontSize: Typography.fontSize[variant],
          lineHeight: Typography.lineHeight[variant],
        },
        style,
        { fontFamily: "" },
      ]}
    />
  );
}

export function MonoText({ variant = "h6", style, ...props }: TextProps) {
  const textColor = useThemeColor({}, "text");

  return (
    <RNText
      {...props}
      style={[
        { color: textColor },
        {
          fontSize: Typography.fontSize[variant],
          lineHeight: Typography.lineHeight[variant],
        },
        style,
        { fontFamily: "SpaceMono" },
      ]}
    />
  );
}
