import Spacing, { SpacingScaleLabel } from "@/constants/SPACING";
import PropTypes from "prop-types";
import React from "react";
import { View } from "react-native";

type Size = SpacingScaleLabel | number;

function Spacer({
  horizontal = false,
  size,
}: {
  horizontal?: boolean;
  size: Size;
}) {
  const defaultValue = "auto";

  const resolvedSize = typeof size === "string" ? Spacing[size] : size;

  return (
    <View
      style={{
        width: horizontal ? resolvedSize : defaultValue,
        height: !horizontal ? resolvedSize : defaultValue,
      }}
    ></View>
  );
}

Spacer.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  horizontal: PropTypes.bool,
};

export default Spacer;
