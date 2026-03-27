/**
 * Design System: Spacing
 * Consistent margin and padding scale used across the UI.
 */

type SpacingScale = {
    xxxl: number;
    xxl: number;
    xl: number;
    lg: number;
    md: number;
    sm: number;
    xs: number;
    xxs: number;
    xxxs: number;
    none: number;
};

export type SpacingScaleLabel =
    | "xxxl"
    | "xxl"
    | "xl"
    | "lg"
    | "md"
    | "sm"
    | "xs"
    | "xxs"
    | "xxxs"
    | "none";

const Spacing: SpacingScale = {
    xxxl: 96,
    xxl: 48,
    xl: 40,
    lg: 24,
    md: 20,
    sm: 14,
    xs: 12,
    xxs: 8,
    xxxs: 6,
    none: 0,
};

export default Spacing;
